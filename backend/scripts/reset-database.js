require('dotenv').config();
// Set SKIP_SYNC to prevent auto-sync during reset
process.env.SKIP_SYNC = 'true';

const { sequelize, connectDB } = require('../config/database');
const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Thesis = require('../models/Thesis');

// Import all models to ensure relationships are set up
const { ThesisAuthors } = require('../models');

async function resetDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    // Detect database type from connection options or DATABASE_URL
    const dbType = sequelize.options.dialect || 'mysql';
    const isPostgres = dbType === 'postgres';
    const dbName = sequelize.config.database || sequelize.config.host || 'unknown';
    
    console.log(`${isPostgres ? 'PostgreSQL' : 'MySQL'} database connected successfully`);
    console.log(`Database: ${dbName}`);
    
    console.log('Starting database reset...');
    console.log('WARNING: This will delete ALL data in the database!');
    
    // Handle foreign key constraints based on database type
    if (isPostgres) {
      // PostgreSQL: Use sync with force: true to drop and recreate tables
      console.log('Dropping and recreating all tables (PostgreSQL)...');
      // Import models first to ensure they're registered
      require('../models');
      // Sync with force: true will drop existing tables and recreate them
      await sequelize.sync({ force: true });
    } else {
      // MySQL: Disable foreign key checks temporarily
      console.log('Dropping all tables (MySQL)...');
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelize.drop();
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      // Now sync to create all tables
      await sequelize.sync({ force: false });
    }
    
    console.log('Database tables recreated');
    
    // Create a default admin user
    // Note: Password will be hashed automatically by User model's beforeCreate hook
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@faith.edu.ph',
      password: 'admin123', // Plain password - will be hashed by User model hook
      role: 'admin',
      department: 'Administration',
      student_id: 'ADMIN001',
      is_active: true,
      is_email_verified: true
    });
    console.log('Default admin user created:', adminUser.email);
    
    // Create a dummy student user
    const studentUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'student@faith.edu.ph',
      password: 'student123', // Plain password - will be hashed by User model hook
      role: 'student',
      department: 'Computer Science',
      student_id: 'STU001',
      is_active: true,
      is_email_verified: true
    });
    console.log('Dummy student user created:', studentUser.email);
    
    // Create default departments with courses
    const departmentsData = [
      {
        name: 'College of Engineering',
        code: 'COE',
        description: 'College of Engineering',
        is_active: true,
        courses: [
          {
            name: 'BS Computer Engineering',
            code: 'BS-CpE',
            description: 'Bachelor of Science in Computer Engineering',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Electronics Engineering',
            code: 'BS-ECE',
            description: 'Bachelor of Science in Electronics Engineering',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Industrial Engineering',
            code: 'BS-IE',
            description: 'Bachelor of Science in Industrial Engineering',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          }
        ]
      },
      {
        name: 'College of Computing and Information Technology',
        code: 'CCIT',
        description: 'College of Computing and Information Technology',
        is_active: true,
        courses: [
          {
            name: 'BS Information Technology',
            code: 'BS-IT',
            description: 'Bachelor of Science in Information Technology',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Computer Science',
            code: 'BS-CS',
            description: 'Bachelor of Science in Computer Science',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Entertainment and Multimedia Computing',
            code: 'BS-EMC',
            description: 'Bachelor of Science in Entertainment and Multimedia Computing',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          }
        ]
      },
      {
        name: 'College of Business and Accountancy',
        code: 'CBA',
        description: 'College of Business and Accountancy',
        is_active: true,
        courses: [
          {
            name: 'BS Accountancy',
            code: 'BS-A',
            description: 'Bachelor of Science in Accountancy',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Management Accounting',
            code: 'BS-MA',
            description: 'Bachelor of Science in Management Accounting',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Business Administration',
            code: 'BS-BA',
            description: 'Bachelor of Science in Business Administration',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Entrepreneurship',
            code: 'BS-ENT',
            description: 'Bachelor of Science in Entrepreneurship',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          }
        ]
      },
      {
        name: 'College of Tourism and Hospitality Management',
        code: 'CTHM',
        description: 'College of Tourism and Hospitality Management',
        is_active: true,
        courses: [
          {
            name: 'BS Hospitality Management',
            code: 'BS-HM',
            description: 'Bachelor of Science in Hospitality Management',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Tourism Management',
            code: 'BS-TM',
            description: 'Bachelor of Science in Tourism Management',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          }
        ]
      },
      {
        name: 'College of Public Safety',
        code: 'CPS',
        description: 'College of Public Safety',
        is_active: true,
        courses: [
          {
            name: 'BS Criminology',
            code: 'BS-CRIM',
            description: 'Bachelor of Science in Criminology',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Forensic Science',
            code: 'BS-FS',
            description: 'Bachelor of Science in Forensic Science',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          }
        ]
      },
      {
        name: 'College of Arts, Sciences, and Education',
        code: 'CASE',
        description: 'College of Arts, Sciences, and Education',
        is_active: true,
        courses: [
          {
            name: 'BA Communication',
            code: 'BA-COMM',
            description: 'Bachelor of Arts in Communication',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Psychology',
            code: 'BS-PSY',
            description: 'Bachelor of Science in Psychology',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Mathematics',
            code: 'BS-MATH',
            description: 'Bachelor of Science in Mathematics',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'Bachelor of Elementary Education',
            code: 'BEED',
            description: 'Bachelor of Elementary Education',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'Bachelor of Secondary Education',
            code: 'BSED',
            description: 'Bachelor of Secondary Education',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          }
        ]
      },
      {
        name: 'College of Allied Health Sciences',
        code: 'CAHS',
        description: 'College of Allied Health Sciences',
        is_active: true,
        courses: [
          {
            name: 'BS Nursing',
            code: 'BS-N',
            description: 'Bachelor of Science in Nursing',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          },
          {
            name: 'BS Medical Laboratory Science',
            code: 'BS-MLS',
            description: 'Bachelor of Science in Medical Laboratory Science',
            level: 'Undergraduate',
            duration: 4,
            credits: 120,
            is_active: true
          }
        ]
      },
      {
        name: 'School of Graduate Studies',
        code: 'SGS',
        description: 'School of Graduate Studies - Master\'s degrees and other postgraduate studies',
        is_active: true,
        courses: [
          {
            name: 'Graduate Programs',
            code: 'GRAD',
            description: 'Master\'s degrees and other postgraduate studies',
            level: 'Graduate',
            duration: 2,
            credits: 36,
            is_active: true
          }
        ]
      }
    ];
    
    for (const deptData of departmentsData) {
      const { courses, ...deptInfo } = deptData;
      const department = await Department.create(deptInfo);
      console.log(`Department created: ${department.name}`);
      
      // Create courses for this department
      for (const courseData of courses) {
        await Course.create({
          ...courseData,
          department_id: department.id
        });
        console.log(`  Course created: ${courseData.name} (${courseData.code})`);
      }
    }
    
    console.log('\nDatabase reset completed successfully!');
    console.log('\nDefault Admin Credentials:');
    console.log('Email: admin@faith.edu.ph');
    console.log('Password: admin123');
    console.log('\nDefault Student Credentials:');
    console.log('Email: student@faith.edu.ph');
    console.log('Password: student123');
    console.log('\nPlease change the password after first login.');
    
    await sequelize.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the reset
resetDatabase();

