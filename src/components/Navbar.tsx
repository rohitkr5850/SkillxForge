import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, LogOut, Home, BookOpen, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-card-bg border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Zap className="h-8 w-8 text-dark-orange group-hover:text-light-orange transition-colors" />
            <span className="text-xl font-bold text-white">SkillForge</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-gray-300 hover:text-dark-orange transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/create-course" 
                  className="flex items-center space-x-1 text-gray-300 hover:text-dark-orange transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm">
                      <div className="text-dark-orange font-medium">{user.xp} XP</div>
                      <div className="text-xs text-gray-400">Level {user.level}</div>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-1 text-gray-300 hover:text-dark-orange transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-dark-orange hover:bg-light-orange text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;