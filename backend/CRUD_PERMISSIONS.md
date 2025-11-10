# CRUD Permissions Guide

## Overview
All user roles (admin, student, prof, faculty, adviser) can now perform CRUD operations on various resources, with appropriate restrictions.

## User Roles
- **admin**: Full access to all features and data
- **student**: Can create, read, update, and delete their own resources
- **prof**: Professor role with similar permissions to faculty
- **faculty**: Can create and manage resources
- **adviser**: Can advise and manage theses

## Thesis CRUD Permissions

### Create Thesis
- **Allowed**: All authenticated users (student, prof, faculty, admin, adviser)
- **Route**: `POST /api/thesis`
- **Note**: Students can now create theses

### Read Thesis
- **Public**: Published theses are visible to everyone
- **Private**: Draft and unpublished theses are only visible to authors and admins
- **Route**: `GET /api/thesis` (all) or `GET /api/thesis/:id` (single)

### Update Thesis
- **Allowed**: Authors of the thesis OR admin
- **Restrictions**: 
  - Non-admin users can only update theses in "Draft" status
  - Admins can update any thesis regardless of status
- **Route**: `PUT /api/thesis/:id`

### Delete Thesis
- **Allowed**: Authors of the thesis OR admin
- **Route**: `DELETE /api/thesis/:id`

## User CRUD Permissions

### Create User
- **Allowed**: Admin only (via API)
- **Note**: Regular users should use the registration endpoint
- **Route**: `POST /api/users`

### Read Users
- **Allowed**: All authenticated users
- **Restrictions**:
  - Admins can see all users
  - Other users can only see active users
- **Route**: `GET /api/users` (all) or `GET /api/users/:id` (single)

### Update User
- **Allowed**: User themselves OR admin
- **Restrictions**:
  - Users can update their own profile (firstName, lastName, phone, department, studentId)
  - Only admins can change role and active status
- **Route**: `PUT /api/users/:id`

### Delete User
- **Allowed**: User themselves OR admin
- **Restrictions**: Admins cannot delete their own account
- **Route**: `DELETE /api/users/:id`

## Database Reset

To reset the database and remove all non-legit data:

```bash
cd backend
npm run reset-db
```

This will:
1. Drop all existing tables
2. Recreate all tables with proper structure
3. Create a default admin user:
   - Email: `admin@faith.edu.ph`
   - Password: `admin123`
4. Create default departments (Computer Science, Information Technology, Business Administration)

**WARNING**: This will delete ALL existing data in the database!

## Course CRUD Permissions

### Create Course
- **Allowed**: Admin, Faculty, Prof
- **Route**: `POST /api/courses`
- **Required Fields**: name, code, departmentId, level

### Read Course
- **Allowed**: All authenticated users
- **Restrictions**: Non-admin users can only see active courses
- **Routes**: 
  - `GET /api/courses` (all courses)
  - `GET /api/courses/:id` (single course)
  - `GET /api/courses/department/:departmentId` (courses by department)

### Update Course
- **Allowed**: Admin, Faculty, Prof
- **Restrictions**: Only admins can change active status
- **Route**: `PUT /api/courses/:id`

### Delete Course
- **Allowed**: Admin, Faculty, Prof
- **Restrictions**: 
  - Non-admin users can only deactivate (not permanently delete)
  - Only admins can permanently delete
- **Route**: `DELETE /api/courses/:id`

## Department and Course Structure

### Department Model
- Departments can have multiple courses
- Each department has: name, code, description, headId, contactInfo, statistics

### Course Model
- Courses belong to a department (foreign key relationship)
- Each course has: name, code, description, departmentId, level (Undergraduate/Graduate/Doctoral), duration, credits
- Course code must be unique within a department

## Notes

- All routes now use Sequelize ORM (not Mongoose)
- The 'prof' role has been added to the User model
- Thesis authors are managed through a many-to-many relationship
- Courses are now properly structured under departments
- All CRUD operations are properly authenticated and authorized

