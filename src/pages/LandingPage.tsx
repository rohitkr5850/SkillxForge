import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Clock, Star, TrendingUp } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-dark-orange" />,
      title: "5-Day Micro-Courses",
      description: "Learn focused skills in bite-sized, manageable 5-day formats"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-dark-orange" />,
      title: "Multi-Format Learning",
      description: "Video tutorials, text guides, and interactive quizzes"
    },
    {
      icon: <Users className="h-8 w-8 text-dark-orange" />,
      title: "Peer Reviews",
      description: "Get feedback and rate courses from the community"
    },
    {
      icon: <Award className="h-8 w-8 text-dark-orange" />,
      title: "Gamification",
      description: "Earn XP, unlock badges, and level up your skills"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Learners" },
    { number: "500+", label: "Micro-Courses" },
    { number: "50+", label: "Skill Categories" },
    { number: "95%", label: "Completion Rate" }
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-orange/10 to-transparent"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Master Skills in 
            <span className="text-dark-orange block mt-2">5 Days</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up">
            Join the revolution of micro-learning. Create and discover bite-sized courses that transform your skills in just 5 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link 
              to="/login" 
              className="bg-dark-orange hover:bg-light-orange text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center group"
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-dark-orange text-dark-orange hover:bg-dark-orange hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Create Course
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-dark-orange mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SkillForge?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of learning with our innovative micro-course platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-card-bg p-6 rounded-xl border border-border-dark hover:border-dark-orange transition-all duration-300 group"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Preview */}
      <section className="py-20 bg-card-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Popular Courses</h2>
            <p className="text-gray-400 text-lg">
              Discover what others are learning
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Figma Fundamentals",
                instructor: "Sarah Design",
                rating: 4.9,
                students: 1234,
                image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg"
              },
              {
                title: "React Hooks Mastery",
                instructor: "Code Master",
                rating: 4.8,
                students: 987,
                image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg"
              },
              {
                title: "Digital Marketing Basics",
                instructor: "Marketing Pro",
                rating: 4.7,
                students: 756,
                image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg"
              }
            ].map((course, index) => (
              <div 
                key={index} 
                className="bg-black rounded-xl overflow-hidden border border-border-dark hover:border-dark-orange transition-all duration-300 group"
              >
                <div className="h-48 bg-gradient-to-br from-dark-orange/20 to-light-orange/20 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-dark-orange" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-dark-orange transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 mb-4">by {course.instructor}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{course.students}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Skills?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of learners who are mastering new skills every day
          </p>
          <Link 
            to="/login" 
            className="bg-dark-orange hover:bg-light-orange text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center group"
          >
            Get Started Free
            <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;