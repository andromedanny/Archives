# One Faith One Archive

A comprehensive web-based platform for digitizing and preserving faith-based theses. This system helps faculty, researchers, and students manage, store, and access research works in a centralized digital archive.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [File Purpose Documentation](#file-purpose-documentation)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Features](#features)
- [User Roles](#user-roles)

## 🎯 Project Overview

### General Objectives
- Develop a bank of thesis in digital form
- Make it easy to store theses from different departments
- Help faculty and researchers find information without physical records

### Specific Objectives
- Preserve integrity and longevity of faith-based theses through high-quality digital conversion and storage
- Provide advisers and administrators with a calendar management system for streamlined scheduling
- Reduce manual workload and automate research documentation processes
- Improve user access with a web-based system featuring a user-friendly interface
- Bring all research works together in one easy-to-use online platform

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js - Server framework
- **MySQL/PostgreSQL** with Sequelize ORM - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Supabase** - Cloud storage (optional)

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **FullCalendar** - Calendar component
- **React Hook Form** - Form management
- **Vite** - Build tool

## 📁 Project Structure

```
Archives/
├── backend/                    # Backend server code
│   ├── config/                 # Configuration files
│   │   ├── database.js         # Database connection configuration
│   │   ├── cloudStorage.js     # Cloud storage (Supabase) configuration
│   │   └── supabaseStorage.js  # Supabase storage helper functions
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── upload.js           # File upload middleware (Multer)
│   │   └── audit.js            # Audit logging middleware
│   ├── models/                 # Sequelize database models
│   │   ├── User.js             # User model (students, faculty, admin, adviser)
│   │   ├── Thesis.js           # Thesis model
│   │   ├── Calendar.js         # Calendar events model
│   │   ├── Department.js       # Department model
│   │   ├── Course.js           # Course/Program model
│   │   ├── AuditLog.js         # Audit log model
│   │   └── index.js            # Model associations and exports
│   ├── routes/                 # API route handlers
│   │   ├── auth.js             # Authentication routes (login, register)
│   │   ├── users.js            # User management routes
│   │   ├── thesis.js           # Thesis CRUD routes
│   │   ├── calendar.js         # Calendar event routes
│   │   ├── admin.js            # Admin-specific routes
│   │   ├── dashboard.js        # Dashboard data routes
│   │   └── courses.js          # Course management routes
│   ├── uploads/                # Local file storage (if not using cloud)
│   │   └── thesis/
│   │       └── documents/      # Uploaded thesis PDFs
│   ├── server.js               # Main Express server entry point
│   ├── package.json            # Backend dependencies
│   ├── env.example             # Environment variables template
│   └── vercel.json             # Vercel deployment configuration
│
├── frontend/                   # Frontend React application
│   ├── public/                 # Static assets
│   │   ├── faith logo.png      # Logo image
│   │   ├── FAITH-AERIAL-1024x576.jpg  # Background image
│   │   └── manifest.json       # PWA manifest
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Auth/
│   │   │   │   └── ProtectedRoute.js  # Route protection component
│   │   │   ├── Layout/
│   │   │   │   ├── Header.js          # Site header/navigation
│   │   │   │   ├── Footer.js          # Site footer
│   │   │   │   ├── Layout.js          # Main layout wrapper
│   │   │   │   ├── Sidebar.js         # Sidebar navigation
│   │   │   │   └── AuthLayout.js      # Authentication page layout
│   │   │   └── UI/
│   │   │       ├── BackgroundImage.js # Background image component
│   │   │       ├── LoadingSpinner.js  # Loading indicator
│   │   │       └── ProgressBar.js     # Progress bar component
│   │   ├── contexts/           # React Context providers
│   │   │   └── AuthContext.js  # Authentication state management
│   │   ├── pages/              # Page components
│   │   │   ├── Admin/          # Admin-only pages
│   │   │   │   ├── AdminDashboard.js    # Admin dashboard
│   │   │   │   ├── AdminTheses.js       # Thesis management
│   │   │   │   ├── AdminUsers.js        # User management
│   │   │   │   ├── AdminDepartments.js  # Department management
│   │   │   │   └── AdminAnalytics.js    # System analytics
│   │   │   ├── Adviser/        # Adviser-only pages
│   │   │   │   └── AdviserTheses.js     # Adviser thesis review
│   │   │   ├── Auth/           # Authentication pages
│   │   │   │   ├── Login.js             # Login page
│   │   │   │   ├── Register.js          # Registration page
│   │   │   │   └── ForgotPassword.js    # Password reset page
│   │   │   ├── Calendar/       # Calendar pages
│   │   │   │   ├── Calendar.js          # Calendar view
│   │   │   │   ├── CalendarCreate.js    # Create event
│   │   │   │   └── CalendarEvent.js     # Event details
│   │   │   ├── Dashboard/      # User dashboard
│   │   │   │   └── Dashboard.js         # Role-based dashboard
│   │   │   ├── Thesis/         # Thesis pages
│   │   │   │   ├── ThesisList.js        # Browse all theses
│   │   │   │   ├── ThesisDetail.js      # Thesis details
│   │   │   │   ├── ThesisCreate.js      # Create new thesis
│   │   │   │   ├── ThesisEdit.js        # Edit thesis
│   │   │   │   └── MyTheses.js          # User's theses
│   │   │   ├── User/           # User profile pages
│   │   │   │   ├── Profile.js           # User profile
│   │   │   │   ├── Settings.js          # Account settings
│   │   │   │   ├── Users.js             # User list
│   │   │   │   └── Researchers.js       # Researcher directory
│   │   │   └── NotFound.js     # 404 page
│   │   ├── services/           # API service layer
│   │   │   ├── api.js          # Axios instance and API methods
│   │   │   └── apiService.js   # API service utilities
│   │   ├── utils/              # Utility functions
│   │   │   └── formatters.js   # Date/number formatters
│   │   ├── styles/             # Global styles
│   │   │   └── utilities.css   # Utility CSS classes
│   │   ├── App.js              # Main React app component
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global CSS
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── vercel.json             # Vercel deployment configuration
│
└── README.md                   # This file
```

## 📄 File Purpose Documentation

### Backend Files

#### `server.js`
**Purpose**: Main Express server entry point
- Initializes Express application
- Configures middleware (CORS, Helmet, compression, rate limiting)
- Connects to database
- Registers all API routes
- Starts HTTP server
- Handles error middleware

#### Configuration Files (`config/`)

**`database.js`**
- Sequelize ORM configuration
- Database connection setup (MySQL/PostgreSQL)
- Connection pooling settings

**`cloudStorage.js`**
- Supabase cloud storage integration
- File upload/download functions
- URL generation for cloud-stored files

**`supabaseStorage.js`**
- Supabase storage helper functions
- Bucket configuration
- File URL retrieval

#### Middleware (`middleware/`)

**`auth.js`**
- JWT token verification
- User authentication middleware (`protect`)
- Optional authentication middleware
- Role-based access control

**`upload.js`**
- Multer configuration for file uploads
- File validation (type, size)
- Storage configuration (local/cloud)
- File info extraction

**`audit.js`**
- Audit logging for user actions
- Tracks file operations
- Logs system events

#### Models (`models/`)

**`User.js`**
- User model (students, faculty, admin, adviser)
- Authentication fields
- Profile information
- Role management

**`Thesis.js`**
- Thesis document model
- Metadata (title, abstract, keywords)
- File attachments
- Status tracking (Draft, Under Review, Approved, Published, Rejected)
- View/download statistics

**`Calendar.js`**
- Calendar events model
- Event types (thesis_defense, meeting, deadline, etc.)
- Department filtering
- Recurring events support

**`Department.js`**
- Department information
- Programs/courses association
- Department head relationship

**`Course.js`**
- Course/Program model
- Department association
- Course codes and names

**`AuditLog.js`**
- System audit trail
- User action logging
- File operation tracking

#### Routes (`routes/`)

**`auth.js`**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

**`users.js`**
- `GET /api/users` - Get users list (with filters)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/faculty/list` - Get faculty/advisers list

**`thesis.js`**
- `GET /api/thesis` - Get all theses (with filters/search)
- `GET /api/thesis/:id` - Get thesis by ID
- `POST /api/thesis` - Create new thesis
- `PUT /api/thesis/:id` - Update thesis
- `DELETE /api/thesis/:id` - Delete thesis
- `POST /api/thesis/:id/document` - Upload thesis document
- `GET /api/thesis/:id/view` - View thesis (increment view count)
- `GET /api/thesis/:id/download` - Download thesis PDF
- `POST /api/thesis/:id/submit` - Submit thesis for review
- `GET /api/thesis/my-theses` - Get current user's theses

**`calendar.js`**
- `GET /api/calendar` - Get calendar events
- `GET /api/calendar/:id` - Get event by ID
- `POST /api/calendar` - Create event
- `PUT /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event
- `GET /api/calendar/upcoming` - Get upcoming events

**`admin.js`**
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/analytics` - System analytics
- `PUT /api/admin/thesis/:id/review` - Review thesis
- `GET /api/admin/users` - Admin user management

**`dashboard.js`**
- `GET /api/dashboard/stats` - User dashboard statistics
- `GET /api/dashboard/activity` - Recent activity feed
- `GET /api/dashboard/my-theses` - User's theses
- `GET /api/dashboard/upcoming-events` - Upcoming events

**`courses.js`**
- `GET /api/courses` - Get courses list
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Frontend Files

#### Main Application Files

**`App.js`**
- Main React application component
- Route definitions
- Protected route configuration
- Layout wrapper

**`index.js`**
- React DOM rendering
- Root component mounting
- Global providers setup

#### Components

**`components/Auth/ProtectedRoute.js`**
- Route protection based on authentication
- Role-based access control
- Redirects to login if not authenticated

**`components/Layout/Header.js`**
- Site navigation header
- User menu
- Logo and branding

**`components/Layout/Footer.js`**
- Site footer
- Copyright information
- Links

**`components/Layout/Layout.js`**
- Main layout wrapper
- Sidebar integration
- Content area

**`components/Layout/Sidebar.js`**
- Sidebar navigation menu
- Role-based menu items
- Active route highlighting

**`components/UI/LoadingSpinner.js`**
- Loading indicator component
- Used during data fetching

**`components/UI/BackgroundImage.js`**
- Background image component
- Used across pages

#### Contexts

**`contexts/AuthContext.js`**
- Authentication state management
- Login/logout functions
- User profile management
- Token management

#### Pages

**Admin Pages** (`pages/Admin/`)
- **AdminDashboard.js**: Overview statistics, recent activity
- **AdminTheses.js**: Manage all theses, approve/reject/publish
- **AdminUsers.js**: User management, create/edit/delete users
- **AdminDepartments.js**: Department management
- **AdminAnalytics.js**: System analytics and reports

**Adviser Pages** (`pages/Adviser/`)
- **AdviserTheses.js**: Review student theses, approve/reject

**Auth Pages** (`pages/Auth/`)
- **Login.js**: User login form
- **Register.js**: User registration form
- **ForgotPassword.js**: Password reset request

**Calendar Pages** (`pages/Calendar/`)
- **Calendar.js**: Full calendar view with events
- **CalendarCreate.js**: Create new calendar event
- **CalendarEvent.js**: Event details and management

**Thesis Pages** (`pages/Thesis/`)
- **ThesisList.js**: Browse and search all published theses
- **ThesisDetail.js**: View thesis details and download
- **ThesisCreate.js**: Create new thesis with file upload
- **ThesisEdit.js**: Edit existing thesis
- **MyTheses.js**: View and manage user's own theses

**User Pages** (`pages/User/`)
- **Profile.js**: User profile view
- **Settings.js**: Account settings and preferences
- **Users.js**: User directory
- **Researchers.js**: Researcher directory with thesis counts

**Dashboard** (`pages/Dashboard/`)
- **Dashboard.js**: Role-based dashboard with stats and quick actions

#### Services

**`services/api.js`**
- Axios instance configuration
- API endpoint definitions
- Request/response interceptors
- Error handling

**`services/apiService.js`**
- API service utilities
- Helper functions for API calls

#### Utilities

**`utils/formatters.js`**
- Date formatting functions
- Number formatting
- Text formatting utilities

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher) or PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Archives
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp env.example .env
   # Edit .env with your API URL
   npm run dev
   ```

### Environment Variables

**Backend (.env)**
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=one_faith_archive
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Storage (optional)
STORAGE_TYPE=local  # or 'supabase'
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_STORAGE_BUCKET=thesis-documents
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Thesis Endpoints
- `GET /api/thesis` - Get all theses (with filters)
- `GET /api/thesis/:id` - Get thesis by ID
- `POST /api/thesis` - Create thesis
- `PUT /api/thesis/:id` - Update thesis
- `DELETE /api/thesis/:id` - Delete thesis
- `POST /api/thesis/:id/document` - Upload document
- `GET /api/thesis/:id/view` - View thesis
- `GET /api/thesis/:id/download` - Download PDF
- `POST /api/thesis/:id/submit` - Submit for review

### Calendar Endpoints
- `GET /api/calendar` - Get events
- `POST /api/calendar` - Create event
- `PUT /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/analytics` - Analytics data
- `PUT /api/admin/thesis/:id/review` - Review thesis

## ✨ Features

### Core Features
- ✅ User authentication and authorization
- ✅ Thesis upload and management
- ✅ Advanced search and filtering
- ✅ Calendar event management
- ✅ Role-based dashboards
- ✅ File upload (local or cloud storage)
- ✅ Thesis review workflow
- ✅ Analytics and reporting
- ✅ Department management
- ✅ User management

### User Roles
- **Student**: Create, submit, and manage theses
- **Faculty**: Create theses, view calendar
- **Adviser**: Review and approve/reject student theses
- **Admin**: Full system management and oversight

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- File upload security
- Rate limiting
- CORS protection
- Helmet.js security headers
- Password hashing with bcrypt

## 📝 License

This project is licensed under the MIT License.

---

**One Faith One Archive** - Preserving knowledge for future generations.

