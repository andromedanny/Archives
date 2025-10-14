-- One Faith One Archive - Complete Database Setup
-- Run this script in your MySQL database to create all tables

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS one_faith_archive CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE one_faith_archive;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS thesis_authors;
DROP TABLE IF EXISTS calendars;
DROP TABLE IF EXISTS theses;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin', 'adviser') DEFAULT 'student',
    department VARCHAR(255) NOT NULL,
    studentId VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    avatar VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    lastLogin DATETIME,
    resetPasswordToken VARCHAR(255),
    resetPasswordExpire DATETIME,
    emailVerificationToken VARCHAR(255),
    isEmailVerified BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_studentId (studentId),
    INDEX idx_department (department),
    INDEX idx_role (role),
    INDEX idx_isActive (isActive)
);

-- Create departments table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(500),
    headId INT,
    programs JSON,
    contactInfo JSON,
    isActive BOOLEAN DEFAULT TRUE,
    statistics JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_code (code),
    INDEX idx_isActive (isActive),
    FOREIGN KEY (headId) REFERENCES users(id) ON DELETE SET NULL
);

-- Create theses table
CREATE TABLE theses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    abstract TEXT NOT NULL,
    adviserId INT NOT NULL,
    department VARCHAR(255) NOT NULL,
    program VARCHAR(255) NOT NULL,
    academicYear VARCHAR(255) NOT NULL,
    semester ENUM('1st Semester', '2nd Semester', 'Summer') NOT NULL,
    keywords JSON,
    category ENUM('Undergraduate', 'Graduate', 'Doctoral', 'Research Paper') NOT NULL,
    status ENUM('Draft', 'Under Review', 'Approved', 'Published', 'Rejected') DEFAULT 'Draft',
    mainDocument JSON,
    supplementaryFiles JSON,
    metadata JSON,
    reviewerId INT,
    reviewComments TEXT,
    reviewScore INT CHECK (reviewScore >= 0 AND reviewScore <= 100),
    reviewedAt DATETIME,
    downloadCount INT DEFAULT 0,
    viewCount INT DEFAULT 0,
    isPublic BOOLEAN DEFAULT FALSE,
    publishedAt DATETIME,
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_title (title),
    INDEX idx_department (department),
    INDEX idx_program (program),
    INDEX idx_academicYear (academicYear),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_adviserId (adviserId),
    INDEX idx_isPublic (isPublic),
    INDEX idx_publishedAt (publishedAt),
    INDEX idx_submittedAt (submittedAt),
    FOREIGN KEY (adviserId) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (reviewerId) REFERENCES users(id) ON DELETE SET NULL
);

-- Create thesis_authors junction table (many-to-many relationship)
CREATE TABLE thesis_authors (
    thesisId INT NOT NULL,
    userId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (thesisId, userId),
    FOREIGN KEY (thesisId) REFERENCES theses(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_thesisId (thesisId),
    INDEX idx_userId (userId)
);

-- Create calendars table
CREATE TABLE calendars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    location VARCHAR(100),
    eventType ENUM('Thesis Defense', 'Submission Deadline', 'Review Meeting', 'Workshop', 'Conference', 'Other') NOT NULL,
    department VARCHAR(255) NOT NULL,
    createdById INT NOT NULL,
    attendees JSON,
    isRecurring BOOLEAN DEFAULT FALSE,
    recurringPattern JSON,
    isAllDay BOOLEAN DEFAULT FALSE,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Postponed') DEFAULT 'Scheduled',
    reminders JSON,
    attachments JSON,
    notes VARCHAR(1000),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_startDate_endDate (startDate, endDate),
    INDEX idx_department (department),
    INDEX idx_eventType (eventType),
    INDEX idx_createdById (createdById),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    FOREIGN KEY (createdById) REFERENCES users(id) ON DELETE RESTRICT
);

-- Insert sample departments
INSERT INTO departments (name, code, description, contactInfo, programs) VALUES
('Computer Science', 'CS', 'Department of Computer Science and Information Technology', 
 '{"email": "cs@school.edu", "phone": "+1234567890", "office": "Building A, Room 101"}',
 '[{"name": "Bachelor of Science in Computer Science", "level": "Undergraduate", "duration": 4}, {"name": "Master of Science in Computer Science", "level": "Graduate", "duration": 2}]'),
 
('Information Technology', 'IT', 'Department of Information Technology', 
 '{"email": "it@school.edu", "phone": "+1234567891", "office": "Building B, Room 201"}',
 '[{"name": "Bachelor of Science in Information Technology", "level": "Undergraduate", "duration": 4}]'),
 
('Business Administration', 'BA', 'Department of Business Administration', 
 '{"email": "ba@school.edu", "phone": "+1234567892", "office": "Building C, Room 301"}',
 '[{"name": "Bachelor of Science in Business Administration", "level": "Undergraduate", "duration": 4}, {"name": "Master of Business Administration", "level": "Graduate", "duration": 2}]'),
 
('Education', 'EDU', 'Department of Education', 
 '{"email": "edu@school.edu", "phone": "+1234567893", "office": "Building D, Room 401"}',
 '[{"name": "Bachelor of Elementary Education", "level": "Undergraduate", "duration": 4}, {"name": "Bachelor of Secondary Education", "level": "Undergraduate", "duration": 4}]'),
 
('Theology', 'THEO', 'Department of Theology', 
 '{"email": "theo@school.edu", "phone": "+1234567894", "office": "Building E, Room 501"}',
 '[{"name": "Bachelor of Theology", "level": "Undergraduate", "duration": 4}, {"name": "Master of Divinity", "level": "Graduate", "duration": 3}]');

-- Insert sample admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (firstName, lastName, email, password, role, department, isActive, isEmailVerified) VALUES
('Admin', 'User', 'admin@school.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4.8.8.8', 'admin', 'Computer Science', TRUE, TRUE);

-- Insert sample faculty users
INSERT INTO users (firstName, lastName, email, password, role, department, isActive, isEmailVerified) VALUES
('Dr. John', 'Smith', 'john.smith@school.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4.8.8.8', 'faculty', 'Computer Science', TRUE, TRUE),
('Dr. Maria', 'Garcia', 'maria.garcia@school.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4.8.8.8', 'adviser', 'Information Technology', TRUE, TRUE),
('Prof. Robert', 'Johnson', 'robert.johnson@school.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4.8.8.8', 'faculty', 'Business Administration', TRUE, TRUE);

-- Insert sample student users
INSERT INTO users (firstName, lastName, email, password, role, department, studentId, isActive, isEmailVerified) VALUES
('Alice', 'Brown', 'alice.brown@student.school.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4.8.8.8', 'student', 'Computer Science', 'CS2024001', TRUE, TRUE),
('Bob', 'Wilson', 'bob.wilson@student.school.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4.8.8.8', 'student', 'Information Technology', 'IT2024002', TRUE, TRUE),
('Carol', 'Davis', 'carol.davis@student.school.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4.8.8.8', 'student', 'Business Administration', 'BA2024003', TRUE, TRUE);

-- Insert sample theses
INSERT INTO theses (title, abstract, adviserId, department, program, academicYear, semester, keywords, category, status, isPublic, publishedAt, submittedAt) VALUES
('Web-Based Learning Management System', 'This thesis presents a comprehensive web-based learning management system designed to enhance educational delivery and student engagement through modern web technologies.', 2, 'Computer Science', 'Bachelor of Science in Computer Science', '2023-2024', '2nd Semester', '["web development", "education", "learning management", "system"]', 'Undergraduate', 'Published', TRUE, '2024-06-15 10:00:00', '2024-05-01 09:00:00'),
('E-Commerce Platform for Small Businesses', 'An innovative e-commerce solution tailored for small businesses, featuring user-friendly interface and comprehensive business management tools.', 3, 'Information Technology', 'Bachelor of Science in Information Technology', '2023-2024', '2nd Semester', '["e-commerce", "small business", "web platform", "business management"]', 'Undergraduate', 'Published', TRUE, '2024-06-20 14:30:00', '2024-05-05 11:00:00'),
('Digital Marketing Strategies for Educational Institutions', 'A comprehensive study on effective digital marketing strategies specifically designed for educational institutions to improve student enrollment and engagement.', 4, 'Business Administration', 'Bachelor of Science in Business Administration', '2023-2024', '2nd Semester', '["digital marketing", "education", "enrollment", "strategies"]', 'Undergraduate', 'Under Review', FALSE, NULL, '2024-05-10 16:00:00');

-- Insert thesis authors (many-to-many relationship)
INSERT INTO thesis_authors (thesisId, userId) VALUES
(1, 5), -- Alice Brown is author of thesis 1
(2, 6), -- Bob Wilson is author of thesis 2
(3, 7); -- Carol Davis is author of thesis 3

-- Insert sample calendar events
INSERT INTO calendars (title, description, startDate, endDate, startTime, endTime, location, eventType, department, createdById, attendees, priority, status) VALUES
('Thesis Defense - Web-Based LMS', 'Final defense presentation for the Web-Based Learning Management System thesis', '2024-06-10', '2024-06-10', '09:00:00', '11:00:00', 'Room A101', 'Thesis Defense', 'Computer Science', 2, '[{"userId": 5, "role": "Required", "status": "Accepted"}]', 'High', 'Completed'),
('Thesis Submission Deadline', 'Deadline for thesis submission for current semester', '2024-05-31', '2024-05-31', '23:59:59', '23:59:59', 'Online Submission', 'Submission Deadline', 'Computer Science', 1, '[]', 'Critical', 'Completed'),
('Faculty Meeting', 'Monthly faculty meeting to discuss academic matters', '2024-07-15', '2024-07-15', '14:00:00', '16:00:00', 'Conference Room B', 'Review Meeting', 'Computer Science', 1, '[{"userId": 2, "role": "Required", "status": "Accepted"}, {"userId": 3, "role": "Required", "status": "Pending"}]', 'Medium', 'Scheduled');

-- Update department statistics
UPDATE departments SET statistics = '{"totalStudents": 3, "totalFaculty": 3, "totalTheses": 3}' WHERE name = 'Computer Science';
UPDATE departments SET statistics = '{"totalStudents": 1, "totalFaculty": 1, "totalTheses": 1}' WHERE name = 'Information Technology';
UPDATE departments SET statistics = '{"totalStudents": 1, "totalFaculty": 1, "totalTheses": 1}' WHERE name = 'Business Administration';

-- Show success message
SELECT 'Database setup completed successfully!' as message;
SELECT 'Tables created: users, departments, theses, thesis_authors, calendars' as tables_created;
SELECT 'Sample data inserted: 1 admin, 3 faculty, 3 students, 5 departments, 3 theses, 3 events' as sample_data;
