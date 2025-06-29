# 🔥 SkillForge - Master Skills in 5 Days

<div align="center">

![SkillForge Logo](https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

**The Revolutionary Micro-Learning Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://typescriptlang.org/)


</div>

---

## 🌟 Overview

**SkillForge** is a cutting-edge micro-learning platform that revolutionizes skill acquisition through focused, bite-sized 5-day courses. Whether you're looking to learn new technologies, teach others, or build a community of learners, SkillForge provides the perfect environment for rapid skill development.

### ✨ Why SkillForge?

- 🎯 **Focused Learning**: Master specific skills in just 5 days
- 🏆 **Gamification**: Earn XP, unlock badges, and level up
- 👥 **Community-Driven**: Learn from peers and industry experts
- 📱 **Multi-Format**: Video, text, and interactive quizzes
- 🔄 **Progress Tracking**: Visual progress indicators and completion certificates

---

## 🚀 Features

### 🎓 **Learning Experience**
- **5-Day Micro-Courses**: Structured learning paths designed for quick mastery
- **Multi-Format Content**: Video tutorials, text guides, and interactive quizzes
- **Progress Tracking**: Real-time progress indicators and completion tracking
- **Personalized Dashboard**: Track your learning journey and achievements

### 🏆 **Gamification System**
- **XP Points**: Earn experience points for completing modules and courses
- **Level System**: Progress through levels as you gain more experience
- **Achievement Badges**: Unlock special badges for milestones and accomplishments
- **Leaderboards**: Compete with other learners and see your ranking

### 👨‍🏫 **Course Creation**
- **Intuitive Course Builder**: Easy-to-use interface for creating engaging courses
- **Flexible Module System**: Support for video, text, and quiz-based modules
- **Course Analytics**: Track student engagement and course performance
- **Review System**: Peer reviews and ratings for quality assurance

### 🔐 **Authentication & Security**
- **Multiple Login Options**: Email/password and Google OAuth integration
- **Secure JWT Authentication**: Industry-standard token-based authentication
- **Rate Limiting**: Protection against abuse and spam
- **Data Encryption**: Secure handling of user data and passwords

### 📊 **Analytics & Insights**
- **User Statistics**: Comprehensive stats on learning progress and achievements
- **Course Analytics**: Detailed insights for course creators
- **Progress Visualization**: Beautiful charts and progress indicators
- **Performance Metrics**: Track completion rates and engagement

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing library

### **Security & Performance**
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Data sanitization and validation
- **Environment Variables** - Secure configuration management

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **npm** or **yarn** package manager

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skillforge.git
cd skillforge
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:

```bash
cp server/.env.example server/.env
```

Configure your environment variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/skillforge

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application URLs
CLIENT_URL=http://localhost:5173
PORT=5000
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. Start the Application

```bash
# Start both frontend and backend concurrently
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📁 Project Structure

```
skillforge/
├── 📁 src/                    # Frontend React application
│   ├── 📁 components/         # Reusable UI components
│   ├── 📁 contexts/           # React context providers
│   ├── 📁 pages/              # Application pages/routes
│   └── 📁 types/              # TypeScript type definitions
├── 📁 server/                 # Backend Node.js application
│   ├── 📁 config/             # Configuration files
│   ├── 📁 models/             # MongoDB/Mongoose models
│   ├── 📁 routes/             # Express.js route handlers
│   └── 📁 middleware/         # Custom middleware functions
├── 📁 public/                 # Static assets
└── 📄 package.json           # Project dependencies and scripts
```

---

## 🔧 Configuration

### Google OAuth Setup (Optional)

To enable Google Sign-In:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Update your `.env` file with the credentials

### MongoDB Configuration

For production deployment, consider using:
- **MongoDB Atlas** (cloud-hosted MongoDB)
- **Local MongoDB** with proper security configuration
- **Docker MongoDB** for containerized deployment

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
GET  /api/auth/google      # Google OAuth login
```

### Course Endpoints

```http
GET    /api/courses           # Get all courses
GET    /api/courses/:id       # Get specific course
POST   /api/courses           # Create new course
POST   /api/courses/:id/enroll # Enroll in course
POST   /api/courses/:id/complete-module # Complete module
```

### User Endpoints

```http
GET  /api/users/stats         # User statistics
GET  /api/users/badges        # User badges
GET  /api/users/profile       # User profile
PUT  /api/users/profile       # Update profile
```

---

## 🎨 Design System

SkillForge uses a carefully crafted design system with:

### Color Palette
- **Primary Orange**: `#FF6B35` (Dark Orange)
- **Secondary Orange**: `#FF8A5C` (Light Orange)
- **Background**: `#0A0A0A` (Dark Background)
- **Card Background**: `#1A1A1A`
- **Border**: `#333333`

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Optimized for readability
- **Code**: Monospace font for technical content

### Components
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Subtle micro-interactions
- **Accessibility**: WCAG 2.1 compliant
- **Dark Theme**: Eye-friendly dark interface

---

## 🚀 Deployment

### Production Build

```bash
# Build the frontend for production
npm run build

# The built files will be in the 'dist' directory
```

### Deployment Options

#### **Vercel (Recommended for Frontend)**
```bash
npm install -g vercel
vercel --prod
```

#### **Heroku (Full-Stack)**
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
git push heroku main
```

#### **Docker**
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🧪 Testing

```bash
# Run frontend tests
npm run test

# Run backend tests
npm run test:server

# Run all tests
npm run test:all
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Code of Conduct
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React library
- **Tailwind CSS** - For the utility-first CSS framework
- **MongoDB** - For the flexible NoSQL database
- **Lucide** - For the beautiful icon library
- **All Contributors** - For making this project better

---

## 📞 Support

Need help? We're here for you!

- 📧 **Email**: support@skillforge.dev
- 💬 **Discord**: [Join our community](https://discord.gg/skillforge)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/skillforge/issues)
- 📖 **Documentation**: [Full Documentation](https://docs.skillforge.dev)

---

### 🎯 Current Focus (v1.0)
- [x] Core learning platform
- [x] User authentication
- [x] Course creation and management
- [x] Progress tracking
- [x] Gamification system

### 🌟 Future Plans (v2.0)
- [ ] Multi-language support
- [ ] Advanced collaboration tools
- [ ] Enterprise features
- [ ] API for third-party integrations
- [ ] Advanced certification system

---

<div align="center">

**Made with ❤️ by the SkillForge Team**

[⭐ Star this repo](https://github.com/yourusername/skillforge) • [🍴 Fork it](https://github.com/yourusername/skillforge/fork) • [📢 Share it](https://twitter.com/intent/tweet?text=Check%20out%20SkillForge%20-%20Master%20Skills%20in%205%20Days!&url=https://github.com/yourusername/skillforge)

</div>
