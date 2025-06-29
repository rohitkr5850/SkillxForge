import React, { useState, useEffect } from 'react';
import { User, Award, BookOpen, Star, Calendar, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface UserStats {
  coursesCreated: number;
  coursesCompleted: number;
  totalStudents: number;
  averageRating: number;
}

interface Badge {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    coursesCreated: 0,
    coursesCompleted: 0,
    totalStudents: 0,
    averageRating: 0
  });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: '',
    website: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [statsRes, badgesRes, profileRes] = await Promise.all([
        axios.get('/api/users/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/users/badges', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setStats(statsRes.data);
      setBadges(badgesRes.data);
      setProfileData({ ...profileData, ...profileRes.data });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put('/api/users/profile', profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getLevelProgress = (xp: number) => {
    const baseXP = 100;
    const level = Math.floor(xp / baseXP) + 1;
    const currentLevelXP = xp % baseXP;
    const nextLevelXP = baseXP;
    const progress = (currentLevelXP / nextLevelXP) * 100;
    
    return { level, progress, currentLevelXP, nextLevelXP };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-orange"></div>
      </div>
    );
  }

  const { level, progress, currentLevelXP, nextLevelXP } = getLevelProgress(user?.xp || 0);

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-card-bg border border-border-dark rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-dark-orange to-light-orange rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-3xl font-bold bg-black border border-border-dark rounded px-3 py-2 mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                )}
                <div className="flex items-center space-x-4 text-gray-400 mb-3">
                  <span>Level {level}</span>
                  <span>•</span>
                  <span>{user?.xp || 0} XP</span>
                  <span>•</span>
                  <span>Member since {new Date().getFullYear()}</span>
                </div>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-black border border-border-dark rounded px-3 py-2 text-gray-300"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-300">
                    {profileData.bio || 'Passionate learner and skill builder on SkillForge.'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-dark-orange hover:bg-light-orange text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="border border-border-dark text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="border border-border-dark text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Level Progress</span>
              <span className="text-dark-orange">{currentLevelXP}/{nextLevelXP} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-dark-orange to-light-orange h-3 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {nextLevelXP - currentLevelXP} XP until Level {level + 1}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statistics */}
          <div className="lg:col-span-2">
            <div className="bg-card-bg border border-border-dark rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-dark-orange mb-1">
                    {stats.coursesCreated}
                  </div>
                  <div className="text-sm text-gray-400">Courses Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {stats.coursesCompleted}
                  </div>
                  <div className="text-sm text-gray-400">Courses Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {stats.totalStudents}
                  </div>
                  <div className="text-sm text-gray-400">Students Taught</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400">Avg. Rating</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card-bg border border-border-dark rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { type: 'completed', course: 'React Hooks Mastery', date: '2 days ago' },
                  { type: 'created', course: 'Advanced TypeScript', date: '1 week ago' },
                  { type: 'badge', name: 'Course Creator', date: '2 weeks ago' },
                  { type: 'completed', course: 'UI/UX Fundamentals', date: '3 weeks ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border border-border-dark rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'completed' && <BookOpen className="h-5 w-5 text-green-400" />}
                      {activity.type === 'created' && <Star className="h-5 w-5 text-dark-orange" />}
                      {activity.type === 'badge' && <Award className="h-5 w-5 text-yellow-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white">
                        {activity.type === 'completed' && `Completed course: ${activity.course}`}
                        {activity.type === 'created' && `Created course: ${activity.course}`}
                        {activity.type === 'badge' && `Earned badge: ${activity.name}`}
                      </p>
                      <p className="text-sm text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="lg:col-span-1">
            <div className="bg-card-bg border border-border-dark rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Badges & Achievements</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'First Course', icon: '🎯', earned: true, description: 'Created your first course' },
                  { name: 'Quick Learner', icon: '⚡', earned: true, description: 'Completed 5 courses' },
                  { name: 'Mentor', icon: '👨‍🏫', earned: false, description: 'Teach 100 students' },
                  { name: 'Expert', icon: '🏆', earned: false, description: 'Reach level 10' },
                  { name: 'Popular', icon: '🌟', earned: true, description: 'Course rated 4.5+' },
                  { name: 'Consistent', icon: '📅', earned: false, description: '30-day learning streak' },
                ].map((badge, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border transition-all ${
                      badge.earned 
                        ? 'border-dark-orange bg-dark-orange/10' 
                        : 'border-border-dark bg-black opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-2 text-center">{badge.icon}</div>
                    <div className="text-sm font-medium text-center mb-1">{badge.name}</div>
                    <div className="text-xs text-gray-400 text-center">{badge.description}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border-dark">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Progress to Next Badge</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mentor Badge</span>
                      <span className="text-dark-orange">45/100</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-dark-orange h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;