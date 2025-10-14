# One Faith One Archive

A comprehensive web-based platform for digitizing and preserving faith-based theses. This system helps faculty, researchers, and students manage, store, and access research works in a centralized digital archive.

## 🎯 Project Objectives

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

## 🚀 Features

### Core Features
- **Thesis Management**: Upload, store, and manage thesis documents
- **User Authentication**: Role-based access control (Student, Faculty, Admin, Adviser)
- **Calendar System**: Event scheduling and management for advisers and administrators
- **Search & Filter**: Advanced search capabilities with multiple filters
- **File Management**: Secure document storage with version control
- **Review System**: Thesis review and approval workflow
- **Analytics Dashboard**: Comprehensive statistics and reporting

### User Roles
- **Students**: Create, submit, and manage their theses
- **Faculty/Advisers**: Review theses, manage calendar events
- **Administrators**: Full system management and oversight

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** with Sequelize ORM
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Express Validator** for input validation

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hook Form** for form management
- **Framer Motion** for animations
- **React Hot Toast** for notifications

## 📁 Project Structure

```
one-faith-archive/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd one-faith-archive
   ```

2. **Database Setup**
   ```bash
   # Install MySQL and create database
   mysql -u root -p < backend/setup-mysql.sql
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with MySQL configuration
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=one_faith_archive
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Thesis Endpoints
- `GET /api/thesis` - Get all theses (public)
- `GET /api/thesis/:id` - Get single thesis
- `POST /api/thesis` - Create new thesis
- `PUT /api/thesis/:id` - Update thesis
- `POST /api/thesis/:id/document` - Upload thesis document
- `GET /api/thesis/:id/download` - Download thesis

### Calendar Endpoints
- `GET /api/calendar` - Get calendar events
- `POST /api/calendar` - Create new event
- `PUT /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/analytics` - Get system analytics
- `PUT /api/admin/thesis/:id/review` - Review thesis

## 🎨 UI Components

The application features a modern, responsive design with:
- Clean and intuitive interface
- Mobile-first responsive design
- Dark/light mode support
- Accessible components
- Smooth animations and transitions

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- File upload security
- Rate limiting
- CORS protection
- Helmet.js security headers

## 📊 Database Schema

### User Model
- Personal information (name, email, department)
- Role-based permissions
- Authentication data
- Profile settings

### Thesis Model
- Title, abstract, and metadata
- Author and adviser relationships (many-to-many for authors)
- File attachments (stored as JSON)
- Review and approval status
- Download/view statistics

### Calendar Model
- Event details and scheduling
- Attendee management (stored as JSON)
- Recurring events
- Attachments and reminders

### Department Model
- Department information and programs
- Contact details and statistics
- Head of department relationship

## 🚀 Deployment

### Backend Deployment
1. Set up MySQL database (local or cloud)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean)
4. Set up file storage (AWS S3, Google Cloud Storage)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, AWS S3)
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🔮 Future Enhancements

- Mobile application
- Advanced analytics and reporting
- Integration with external research databases
- AI-powered thesis recommendations
- Multi-language support
- Advanced file format support
- Collaborative editing features

---

**One Faith One Archive** - Preserving knowledge for future generations.
