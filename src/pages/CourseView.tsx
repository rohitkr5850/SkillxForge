import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, BookOpen, Award, Users, Star, Clock, CheckCircle, Circle } from 'lucide-react';
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
  difficulty: string;
  whatYoullLearn: string[];
  modules: Module[];
  progress?: number;
  isEnrolled?: boolean;
}

interface Module {
  day: number;
  title: string;
  type: 'video' | 'text' | 'quiz';
  content: string;
  completed?: boolean;
  quizQuestions?: QuizQuestion[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/courses/${id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCourse(); // Refresh course data
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
    }
  };
  
  const markModuleComplete = async (moduleIndex: number) => {
    try {
      await axios.post(`/api/courses/${id}/complete-module`, {
        moduleIndex
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCourse(); // Refresh course data
    } catch (error) {
      console.error('Error marking module complete:', error);
    }
  };

  const handleQuizSubmit = async () => {
    const currentModuleData = course?.modules[currentModule];
    if (!currentModuleData?.quizQuestions) return;

    const score = currentModuleData.quizQuestions.reduce((acc, question, index) => {
      return acc + (quizAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    const passed = score >= currentModuleData.quizQuestions.length * 0.7; // 70% to pass

    if (passed) {
      await markModuleComplete(currentModule);
    }

    alert(`Quiz completed! Score: ${score}/${currentModuleData.quizQuestions.length}${passed ? ' - Passed!' : ' - Please try again'}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-orange"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Course not found</h2>
          <p className="text-gray-400">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!course.isEnrolled ? (
          // Course Preview (Not Enrolled)
          <div className="max-w-4xl mx-auto">
            <div className="bg-card-bg border border-border-dark rounded-xl p-8 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                  <p className="text-gray-300 text-lg mb-6">{course.description}</p>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span>{course.studentsCount} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span>{course.duration} days</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">What you'll learn</h3>
                    <ul className="space-y-2">
                      {course.whatYoullLearn.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-black border border-border-dark rounded-xl p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-dark-orange mb-2">Free</div>
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full bg-dark-orange hover:bg-light-orange text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Instructor</span>
                        <span>{course.instructor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration</span>
                        <span>{course.duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level</span>
                        <span className="capitalize">{course.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category</span>
                        <span className="capitalize">{course.category.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Curriculum Preview */}
            <div className="bg-card-bg border border-border-dark rounded-xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Course Curriculum</h3>
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-border-dark rounded-lg">
                    <div className="flex-shrink-0">
                      {module.type === 'video' && <Play className="h-5 w-5 text-dark-orange" />}
                      {module.type === 'text' && <BookOpen className="h-5 w-5 text-blue-400" />}
                      {module.type === 'quiz' && <Award className="h-5 w-5 text-green-400" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Day {module.day}: {module.title}</h4>
                      <p className="text-sm text-gray-400 capitalize">{module.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Course Learning Interface (Enrolled)
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Course Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card-bg border border-border-dark rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span className="text-dark-orange">{course.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-dark-orange h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  {course.modules.map((module, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentModule(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentModule === index 
                          ? 'bg-dark-orange text-white' 
                          : 'bg-black border border-border-dark hover:border-dark-orange'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {module.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Day {module.day}</p>
                          <p className="text-xs truncate opacity-75">{module.title}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-card-bg border border-border-dark rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Day {currentModuleData.day}: {currentModuleData.title}</h2>
                    <p className="text-gray-400 capitalize">{currentModuleData.type} Module</p>
                  </div>
                  {!currentModuleData.completed && (
                    <button
                      onClick={() => markModuleComplete(currentModule)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark Complete</span>
                    </button>
                  )}
                </div>

                {/* Module Content */}
                <div className="mb-8">
                  {currentModuleData.type === 'video' && (
                    <div>
                      <div className="bg-black rounded-lg p-8 mb-4 text-center">
                        <Play className="h-16 w-16 text-dark-orange mx-auto mb-4" />
                        <p className="text-gray-400">Video Player Placeholder</p>
                        <p className="text-sm text-gray-500 mt-2">Video URL: {currentModuleData.content}</p>
                      </div>
                    </div>
                  )}

                  {currentModuleData.type === 'text' && (
                    <div className="prose prose-invert max-w-none">
                      <div className="bg-black rounded-lg p-6">
                        <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                          {currentModuleData.content}
                        </pre>
                      </div>
                    </div>
                  )}

                  {currentModuleData.type === 'quiz' && currentModuleData.quizQuestions && (
                    <div>
                      <div className="bg-black rounded-lg p-6 mb-6">
                        <p className="text-gray-300">{currentModuleData.content}</p>
                      </div>
                      
                      <div className="space-y-6">
                        {currentModuleData.quizQuestions.map((question, qIndex) => (
                          <div key={qIndex} className="bg-black rounded-lg p-6">
                            <h4 className="text-lg font-medium mb-4">
                              Question {qIndex + 1}: {question.question}
                            </h4>
                            <div className="space-y-2">
                              {question.options.map((option, oIndex) => (
                                <label key={oIndex} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800 transition-colors">
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    value={oIndex}
                                    checked={quizAnswers[qIndex] === oIndex}
                                    onChange={() => setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                                    className="text-dark-orange focus:ring-dark-orange"
                                  />
                                  <span>{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        <button
                          onClick={handleQuizSubmit}
                          className="bg-dark-orange hover:bg-light-orange text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Submit Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentModule(Math.max(0, currentModule - 1))}
                    disabled={currentModule === 0}
                    className="px-6 py-2 border border-border-dark text-gray-300 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentModule(Math.min(course.modules.length - 1, currentModule + 1))}
                    disabled={currentModule === course.modules.length - 1}
                    className="px-6 py-2 bg-dark-orange hover:bg-light-orange text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;