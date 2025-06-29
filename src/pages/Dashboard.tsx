import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Clock, Users, Star, Award, TrendingUp, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar?: string;
  };
  duration: number;
  studentsCount: number;
  rating: number;
  category: string;
  thumbnail?: string;
  progress?: number;
  isEnrolled?: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const [coursesRes, myCoursesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/courses`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/courses/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setCourses(coursesRes.data);
      setMyCourses(myCoursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.category.toLowerCase() === filter;
  });

  const categories = ['all', 'design', 'development', 'marketing', 'business'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-400">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-bg border border-border-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Experience Points</p>
                <p className="text-2xl font-bold text-dark-orange">{user?.xp || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-dark-orange" />
            </div>
          </div>
          <div className="bg-card-bg border border-border-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Level</p>
                <p className="text-2xl font-bold text-white">{user?.level || 1}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-card-bg border border-border-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Enrolled Courses</p>
                <p className="text-2xl font-bold text-white">{myCourses.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-card-bg border border-border-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Badges Earned</p>
                <p className="text-2xl font-bold text-white">{user?.badges?.length || 0}</p>
              </div>
              <Award className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        {myCourses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Continue Learning</h2>
              <Link 
                to="/create-course" 
                className="bg-dark-orange hover:bg-light-orange text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Course</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <Link 
                  key={course._id} 
                  to={`/course/${course._id}`}
                  className="bg-card-bg border border-border-dark rounded-xl overflow-hidden hover:border-dark-orange transition-all duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-br from-dark-orange/20 to-light-orange/20 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-dark-orange" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-dark-orange transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration} days</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{course.rating}</span>
                      </span>
                    </div>
                    {course.progress !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-dark-orange">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-dark-orange h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Create Course CTA if no enrolled courses */}
        {myCourses.length === 0 && (
          <div className="mb-12">
            <div className="bg-card-bg border border-border-dark rounded-xl p-8 text-center">
              <BookOpen className="h-16 w-16 text-dark-orange mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Start Your Learning Journey</h2>
              <p className="text-gray-400 mb-6">Enroll in courses or create your own to begin earning XP and badges!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/create-course" 
                  className="bg-dark-orange hover:bg-light-orange text-white px-6 py-3 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Course</span>
                </Link>
                <button 
                  onClick={() => document.getElementById('discover-courses')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-dark-orange text-dark-orange hover:bg-dark-orange hover:text-white px-6 py-3 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Browse Courses</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discover New Courses */}
        <div id="discover-courses">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Discover New Courses</h2>
            <div className="flex items-center space-x-4">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-card-bg border border-border-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-orange"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredCourses.length === 0 ? (
            <div className="bg-card-bg border border-border-dark rounded-xl p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
              <p className="text-gray-400 mb-4">Be the first to create a course in this category!</p>
              <Link 
                to="/create-course" 
                className="bg-dark-orange hover:bg-light-orange text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Course</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link 
                  key={course._id} 
                  to={`/course/${course._id}`}
                  className="bg-card-bg border border-border-dark rounded-xl overflow-hidden hover:border-dark-orange transition-all duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-br from-dark-orange/20 to-light-orange/20 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-dark-orange" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-dark-orange transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <p className="text-gray-300 text-sm mb-4">by {course.instructor.name}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration} days</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.studentsCount}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{course.rating}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;