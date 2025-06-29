import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, Upload, FileText, Video, HelpCircle } from 'lucide-react';
import axios from 'axios';

interface Module {
  day: number;
  title: string;
  type: 'video' | 'text' | 'quiz';
  content: string;
  quizQuestions?: QuizQuestion[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    category: 'development',
    difficulty: 'beginner',
    whatYoullLearn: [''],
    prerequisites: ['']
  });
  const [modules, setModules] = useState<Module[]>([
    { day: 1, title: '', type: 'video', content: '', quizQuestions: [] }
  ]);

  const categories = ['development', 'design', 'marketing', 'business', 'data-science', 'other'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const handleCourseChange = (field: string, value: string) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'whatYoullLearn' | 'prerequisites', index: number, value: string) => {
    setCourse(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'whatYoullLearn' | 'prerequisites') => {
    setCourse(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'whatYoullLearn' | 'prerequisites', index: number) => {
    setCourse(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleModuleChange = (index: number, field: keyof Module, value: any) => {
    setModules(prev => prev.map((module, i) => 
      i === index ? { ...module, [field]: value } : module
    ));
  };

  const addModule = () => {
    if (modules.length < 5) {
      setModules(prev => [...prev, {
        day: prev.length + 1,
        title: '',
        type: 'video',
        content: '',
        quizQuestions: []
      }]);
    }
  };

  const removeModule = (index: number) => {
    setModules(prev => prev.filter((_, i) => i !== index));
  };

  const addQuizQuestion = (moduleIndex: number) => {
    const newQuestion: QuizQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    handleModuleChange(moduleIndex, 'quizQuestions', [
      ...(modules[moduleIndex].quizQuestions || []),
      newQuestion
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        ...course,
        modules,
        duration: modules.length,
        whatYoullLearn: course.whatYoullLearn.filter(item => item.trim()),
        prerequisites: course.prerequisites.filter(item => item.trim())
      };

      const response = await axios.post('/api/courses', courseData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      navigate(`/course/${response.data._id}`);
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create a New Course</h1>
          <p className="text-gray-400">Share your knowledge with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card-bg border border-border-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={course.title}
                  onChange={(e) => handleCourseChange('title', e.target.value)}
                  className="w-full bg-black border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dark-orange"
                  placeholder="e.g., React Hooks Mastery in 5 Days"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={course.category}
                  onChange={(e) => handleCourseChange('category', e.target.value)}
                  className="w-full bg-black border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dark-orange"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={course.description}
                onChange={(e) => handleCourseChange('description', e.target.value)}
                className="w-full bg-black border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dark-orange"
                placeholder="Describe what students will learn in this course..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={course.difficulty}
                onChange={(e) => handleCourseChange('difficulty', e.target.value)}
                className="w-full bg-black border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dark-orange"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-card-bg border border-border-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">What Students Will Learn</h2>
            {course.whatYoullLearn.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('whatYoullLearn', index, e.target.value)}
                  className="flex-1 bg-black border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dark-orange"
                  placeholder="e.g., Master React hooks patterns"
                />
                {course.whatYoullLearn.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('whatYoullLearn', index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('whatYoullLearn')}
              className="text-dark-orange hover:text-light-orange flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add learning outcome</span>
            </button>
          </div>

          {/* Course Modules (5 Days) */}
          <div className="bg-card-bg border border-border-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Course Modules (5 Days Max)</h2>
            
            {modules.map((module, index) => (
              <div key={index} className="border border-border-dark rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Day {module.day}</h3>
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    required
                    value={module.title}
                    onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                    className="bg-black border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dark-orange"
                    placeholder="Module title"
                  />
                  <select
                    value={module.type}
                    onChange={(e) => handleModuleChange(index, 'type', e.target.value as 'video' | 'text' | 'quiz')}
                    className="bg-black border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dark-orange"
                  >
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>

                <textarea
                  required
                  rows={3}
                  value={module.content}
                  onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                  className="w-full bg-black border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dark-orange mb-4"
                  placeholder={
                    module.type === 'video' ? 'Video URL or description' :
                    module.type === 'text' ? 'Text content or article' :
                    'Quiz instructions'
                  }
                />

                {module.type === 'quiz' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Quiz Questions</h4>
                      <button
                        type="button"
                        onClick={() => addQuizQuestion(index)}
                        className="text-dark-orange hover:text-light-orange text-sm flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Question</span>
                      </button>
                    </div>
                    {(module.quizQuestions || []).map((question, qIndex) => (
                      <div key={qIndex} className="border border-gray-700 rounded p-3 mb-3">
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => {
                            const newQuestions = [...(module.quizQuestions || [])];
                            newQuestions[qIndex].question = e.target.value;
                            handleModuleChange(index, 'quizQuestions', newQuestions);
                          }}
                          className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white mb-3"
                          placeholder="Question text"
                        />
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2 mb-2">
                            <input
                              type="radio"
                              name={`question-${index}-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() => {
                                const newQuestions = [...(module.quizQuestions || [])];
                                newQuestions[qIndex].correctAnswer = oIndex;
                                handleModuleChange(index, 'quizQuestions', newQuestions);
                              }}
                              className="text-dark-orange"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newQuestions = [...(module.quizQuestions || [])];
                                newQuestions[qIndex].options[oIndex] = e.target.value;
                                handleModuleChange(index, 'quizQuestions', newQuestions);
                              }}
                              className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-1 text-white"
                              placeholder={`Option ${oIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {modules.length < 5 && (
              <button
                type="button"
                onClick={addModule}
                className="w-full border-2 border-dashed border-border-dark hover:border-dark-orange rounded-lg py-4 text-gray-400 hover:text-dark-orange transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Day {modules.length + 1}</span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-border-dark text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-dark-orange hover:bg-light-orange text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Creating...' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;