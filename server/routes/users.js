import express from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Course from '../models/Course.js';

const router = express.Router();

// Middleware to require authentication
const requireAuth = passport.authenticate('jwt', { session: false });

// Get user statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('createdCourses')
      .populate('enrolledCourses.course');

    const coursesCreated = user.createdCourses.length;
    const coursesCompleted = user.enrolledCourses.filter(ec => ec.progress === 100).length;
    
    // Calculate total students taught
    let totalStudents = 0;
    for (const course of user.createdCourses) {
      totalStudents += course.studentsCount || 0;
    }

    // Calculate average rating of created courses
    const createdCoursesWithRatings = user.createdCourses.filter(course => course.totalRatings > 0);
    const averageRating = createdCoursesWithRatings.length > 0
      ? createdCoursesWithRatings.reduce((sum, course) => sum + course.rating, 0) / createdCoursesWithRatings.length
      : 0;

    res.json({
      coursesCreated,
      coursesCompleted,
      totalStudents,
      averageRating: Math.round(averageRating * 10) / 10
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user badges
router.get('/badges', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Define all available badges
    const allBadges = [
      {
        name: 'First Course',
        description: 'Created your first course',
        icon: '🎯',
        requirement: () => user.createdCourses.length >= 1
      },
      {
        name: 'Course Completer',
        description: 'Completed your first course',
        icon: '✅',
        requirement: () => user.enrolledCourses.some(ec => ec.progress === 100)
      },
      {
        name: 'Quick Learner',
        description: 'Completed 5 courses',
        icon: '⚡',
        requirement: () => user.enrolledCourses.filter(ec => ec.progress === 100).length >= 5
      },
      {
        name: 'Mentor',
        description: 'Teach 100 students',
        icon: '👨‍🏫',
        requirement: async () => {
          const courses = await Course.find({ instructor: user._id });
          const totalStudents = courses.reduce((sum, course) => sum + (course.studentsCount || 0), 0);
          return totalStudents >= 100;
        }
      },
      {
        name: 'Expert',
        description: 'Reach level 10',
        icon: '🏆',
        requirement: () => user.level >= 10
      },
      {
        name: 'Popular',
        description: 'Course rated 4.5+',
        icon: '🌟',
        requirement: async () => {
          const courses = await Course.find({ instructor: user._id });
          return courses.some(course => course.rating >= 4.5 && course.totalRatings >= 5);
        }
      }
    ];

    // Check which badges are earned
    const badges = [];
    for (const badge of allBadges) {
      const earned = typeof badge.requirement === 'function' 
        ? await badge.requirement() 
        : badge.requirement;
      
      const userBadge = user.badges.find(b => b.name === badge.name);
      
      badges.push({
        ...badge,
        earned,
        earnedAt: userBadge?.earnedAt
      });
    }

    res.json(badges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      name: user.name,
      bio: user.bio,
      website: user.website,
      location: user.location,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', requireAuth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('website').optional().trim().isURL().withMessage('Invalid website URL'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location must be less than 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, bio, website, location } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, website, location },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        bio: user.bio,
        website: user.website,
        location: user.location,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's created courses
router.get('/created-courses', requireAuth, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching created courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('name avatar xp level')
      .sort({ xp: -1 })
      .limit(10);

    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;