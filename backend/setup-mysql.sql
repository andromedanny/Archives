-- MySQL setup script for One Faith One Archive
-- Run this script to create the database and initial setup

-- Create database
CREATE DATABASE IF NOT EXISTS one_faith_archive CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create test database
CREATE DATABASE IF NOT EXISTS one_faith_archive_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the main database
USE one_faith_archive;

-- Create a user for the application (optional - you can use root)
-- CREATE USER 'archive_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON one_faith_archive.* TO 'archive_user'@'localhost';
-- GRANT ALL PRIVILEGES ON one_faith_archive_test.* TO 'archive_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Note: The tables will be created automatically by Sequelize when you run the application
-- This script just sets up the database structure

-- If you want to create tables manually, uncomment the following:

/*
-- Users table
CREATE TABLE IF NOT EXISTS users (
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
    INDEX idx_role (role)
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
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

-- Theses table
CREATE TABLE IF NOT EXISTS theses (
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
    FOREIGN KEY (adviserId) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (reviewerId) REFERENCES users(id) ON DELETE SET NULL
);

-- Thesis Authors junction table
CREATE TABLE IF NOT EXISTS thesis_authors (
    thesisId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (thesisId, userId),
    FOREIGN KEY (thesisId) REFERENCES theses(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Calendars table
CREATE TABLE IF NOT EXISTS calendars (
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
    FOREIGN KEY (createdById) REFERENCES users(id) ON DELETE RESTRICT
);
*/
