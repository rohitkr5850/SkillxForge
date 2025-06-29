import express from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import Course from '../models/Course.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to require authentication
const requireAuth = passport.authenticate('jwt', { session: false });

// Get all published courses
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let filter = { isPublished: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's enrolled courses - MOVED BEFORE /:id route
router.get('/my-courses', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses.course',
        populate: {
          path: 'instructor',
          select: 'name avatar'
        }
      });

    const courses = user.enrolledCourses.map(ec => ({
      ...ec.course.toObject(),
      progress: ec.progress,
      isEnrolled: true
    }));

    res.json(courses);
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single course - MOVED AFTER my-courses route
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar')
      .populate('reviews.user', 'name avatar');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledCourses.find(
      ec => ec.course.toString() === course._id.toString()
    );

    const courseData = course.toObject();
    courseData.isEnrolled = !!enrollment;
    
    if (enrollment) {
      courseData.progress = enrollment.progress;
      // Mark completed modules
      courseData.modules = courseData.modules.map((module, index) => ({
        ...module,
        completed: enrollment.completedModules.some(cm => cm.moduleIndex === index)
      }));
    }

    res.json(courseData);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new course
router.post('/', requireAuth, [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('category').isIn(['development', 'design', 'marketing', 'business', 'data-science', 'other']),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
  body('modules').isArray({ min: 1, max: 5 }).withMessage('Course must have 1-5 modules')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const courseData = {
      ...req.body,
      instructor: req.user._id
    };

    const course = new Course(courseData);
    await course.save();

    // Add course to user's created courses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCourses: course._id }
    });

    // Give XP for creating a course
    const user = await User.findById(req.user._id);
    const leveledUp = user.addXP(50);
    await user.save();

    // Check for badges
    if (user.createdCourses.length === 1) {
      user.badges.push({
        name: 'First Course',
        description: 'Created your first course'
      });
      await user.save();
    }

    await course.populate('instructor', 'name avatar');
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in course
router.post('/:id/enroll', requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      ec => ec.course.toString() === course._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Enroll user
    user.enrolledCourses.push({
      course: course._id,
      progress: 0,
      completedModules: []
    });

    await user.save();

    // Update course students count
    await course.updateStudentsCount();
    await course.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete module
router.post('/:id/complete-module', requireAuth, async (req, res) => {
  try {
    const { moduleIndex } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);
    const enrollmentIndex = user.enrolledCourses.findIndex(
      ec => ec.course.toString() === course._id.toString()
    );

    if (enrollmentIndex === -1) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    const enrollment = user.enrolledCourses[enrollmentIndex];
    
    // Check if module already completed
    const alreadyCompleted = enrollment.completedModules.some(
      cm => cm.moduleIndex === moduleIndex
    );

    if (!alreadyCompleted) {
      enrollment.completedModules.push({ moduleIndex });
      
      // Update progress
      enrollment.progress = Math.round(
        (enrollment.completedModules.length / course.modules.length) * 100
      );

      // Give XP for completing module
      const leveledUp = user.addXP(20);
      
      // Check if course is completed
      if (enrollment.progress === 100) {
        user.addXP(50); // Bonus XP for course completion
        
        // Add completion badge if it's their first completed course
        const completedCoursesCount = user.enrolledCourses.filter(ec => ec.progress === 100).length;
        if (completedCoursesCount === 1) {
          user.badges.push({
            name: 'Course Completer',
            description: 'Completed your first course'
          });
        }
      }

      await user.save();
    }

    res.json({ message: 'Module completed successfully' });
  } catch (error) {
    console.error('Error completing module:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post('/:id/review', requireAuth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user has completed the course
    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledCourses.find(
      ec => ec.course.toString() === course._id.toString()
    );

    if (!enrollment || enrollment.progress < 100) {
      return res.status(400).json({ message: 'Must complete course before reviewing' });
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this course' });
    }

    // Add review
    course.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    // Recalculate average rating
    course.calculateAverageRating();
    await course.save();

    await course.populate('reviews.user', 'name avatar');
    res.json(course.reviews[course.reviews.length - 1]);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;