# One Faith One Archive - Backend

The backend API for the One Faith One Archive platform, built with Node.js, Express.js, and MySQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p < setup-mysql.sql
   ```

3. **Environment Setup**
   ```bash
   # Create .env file with MySQL configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Start Production Server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── upload.js            # File upload middleware
├── models/
│   ├── User.js              # User model
│   ├── Thesis.js            # Thesis model
│   ├── Calendar.js          # Calendar model
│   └── Department.js        # Department model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── thesis.js            # Thesis management routes
│   ├── calendar.js          # Calendar routes
│   └── admin.js             # Admin routes
├── uploads/                 # File upload directory
├── server.js                # Main server file
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=one_faith_archive
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_TEST_NAME=one_faith_archive_test

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@school.edu
ADMIN_PASSWORD=admin123
```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update profile | Private |
| PUT | `/change-password` | Change password | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all users | Admin |
| GET | `/:id` | Get single user | Private |
| PUT | `/:id` | Update user | Private/Admin |
| DELETE | `/:id` | Delete user | Admin |
| POST | `/:id/avatar` | Upload avatar | Private |
| GET | `/faculty/list` | Get faculty list | Private |

### Thesis Routes (`/api/thesis`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all theses | Public |
| GET | `/:id` | Get single thesis | Public |
| POST | `/` | Create thesis | Student/Faculty |
| PUT | `/:id` | Update thesis | Author/Admin |
| POST | `/:id/document` | Upload document | Author/Admin |
| POST | `/:id/supplementary` | Upload supplementary files | Author/Admin |
| PUT | `/:id/submit` | Submit for review | Author |
| GET | `/:id/download` | Download thesis | Public |
| GET | `/user/my-theses` | Get user's theses | Private |

### Calendar Routes (`/api/calendar`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get calendar events | Private |
| GET | `/upcoming` | Get upcoming events | Private |
| GET | `/:id` | Get single event | Private |
| POST | `/` | Create event | Faculty/Admin/Adviser |
| PUT | `/:id` | Update event | Creator/Admin |
| DELETE | `/:id` | Delete event | Creator/Admin |
| PUT | `/:id/respond` | Respond to event | Private |
| POST | `/:id/attachments` | Upload attachments | Creator/Admin |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/dashboard` | Get dashboard stats | Admin |
| GET | `/analytics` | Get system analytics | Admin |
| PUT | `/thesis/:id/review` | Review thesis | Admin |
| GET | `/thesis/pending` | Get pending theses | Admin |
| POST | `/bulk` | Bulk operations | Admin |
| GET | `/departments` | Get departments | Admin |
| POST | `/departments` | Create department | Admin |
| PUT | `/departments/:id` | Update department | Admin |
| DELETE | `/departments/:id` | Delete department | Admin |

## 🗄️ Database Models

### User Model
```javascript
{
  id: Integer (Primary Key),
  firstName: String(50),
  lastName: String(50),
  email: String (unique),
  password: String (hashed),
  role: ENUM('student', 'faculty', 'admin', 'adviser'),
  department: String,
  studentId: String (unique),
  phone: String(20),
  avatar: String,
  isActive: Boolean,
  lastLogin: DateTime,
  // ... other fields
}
```

### Thesis Model
```javascript
{
  id: Integer (Primary Key),
  title: String(200),
  abstract: Text,
  adviserId: Integer (Foreign Key),
  department: String,
  program: String,
  academicYear: String,
  semester: ENUM('1st Semester', '2nd Semester', 'Summer'),
  keywords: JSON,
  category: ENUM('Undergraduate', 'Graduate', 'Doctoral', 'Research Paper'),
  status: ENUM('Draft', 'Under Review', 'Approved', 'Published', 'Rejected'),
  mainDocument: JSON,
  supplementaryFiles: JSON,
  metadata: JSON,
  reviewerId: Integer (Foreign Key),
  reviewComments: Text,
  reviewScore: Integer,
  downloadCount: Integer,
  viewCount: Integer,
  isPublic: Boolean,
  // ... other fields
}
```

### Calendar Model
```javascript
{
  id: Integer (Primary Key),
  title: String(100),
  description: String(500),
  startDate: Date,
  endDate: Date,
  startTime: Time,
  endTime: Time,
  location: String(100),
  eventType: ENUM('Thesis Defense', 'Submission Deadline', 'Review Meeting', 'Workshop', 'Conference', 'Other'),
  department: String,
  createdById: Integer (Foreign Key),
  attendees: JSON,
  isRecurring: Boolean,
  priority: ENUM('Low', 'Medium', 'High', 'Critical'),
  status: ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Postponed'),
  // ... other fields
}
```

### Department Model
```javascript
{
  id: Integer (Primary Key),
  name: String(100) (unique),
  code: String(10) (unique),
  description: String(500),
  headId: Integer (Foreign Key),
  programs: JSON,
  contactInfo: JSON,
  isActive: Boolean,
  statistics: JSON,
  // ... other fields
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different user roles
- **Input Validation**: Comprehensive input validation using express-validator
- **File Upload Security**: Secure file upload with type and size restrictions
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Cross-origin resource sharing configuration
- **Helmet.js**: Security headers for protection against common vulnerabilities

## 📁 File Upload

The system supports file uploads for:
- User avatars (images)
- Thesis documents (PDF, DOC, DOCX)
- Supplementary files (various formats)
- Calendar attachments

Files are stored in the `uploads/` directory with organized subdirectories:
- `uploads/avatars/` - User profile pictures
- `uploads/thesis/documents/` - Main thesis documents
- `uploads/thesis/supplementary/` - Supplementary files
- `uploads/calendar/attachments/` - Calendar event attachments

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Error Handling**: Comprehensive error handling middleware
- **Health Check**: `/api/health` endpoint for monitoring

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure JWT secret
- [ ] Set up MySQL database connection
- [ ] Configure file storage (local or cloud)
- [ ] Set up email service for notifications
- [ ] Configure CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Conventional commit messages

## 📝 API Documentation

For detailed API documentation, visit `/api/docs` when the server is running, or check the individual route files for inline documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For backend-specific issues or questions, please create an issue in the repository or contact the development team.
