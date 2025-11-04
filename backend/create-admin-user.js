const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root', // Change this to your MySQL username
      password: '', // Change this to your MySQL password
      database: 'one_faith_archive'
    });
    
    console.log('Connected to MySQL database');
    
    // Generate proper hash for admin123
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('Generated hash:', hashedPassword);
    
    // Check if admin user exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@school.edu']
    );
    
    if (existingUsers.length > 0) {
      console.log('Admin user exists, updating password...');
      await connection.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, 'admin@school.edu']
      );
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      await connection.execute(
        'INSERT INTO users (firstName, lastName, email, password, role, department, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['Admin', 'User', 'admin@school.edu', hashedPassword, 'admin', 'Computer Science', 1]
      );
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('\n📋 Login Credentials:');
    console.log('Email: admin@school.edu');
    console.log('Password: admin123');
    
    // Test the password
    const [users] = await connection.execute(
      'SELECT password FROM users WHERE email = ?',
      ['admin@school.edu']
    );
    
    if (users.length > 0) {
      const isValid = await bcrypt.compare('admin123', users[0].password);
      console.log('\n🔐 Password verification test:', isValid ? '✅ PASS' : '❌ FAIL');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. MySQL is running');
    console.log('2. Database "one_faith_archive" exists');
    console.log('3. MySQL credentials are correct in this script');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdminUser();
