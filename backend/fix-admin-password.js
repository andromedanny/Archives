const { sequelize } = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function fixAdminPassword() {
  try {
    // Generate proper hash for admin123
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('Generated hash:', hashedPassword);
    
    // First, try to update existing admin user
    const [updatedRows] = await sequelize.query(
      'UPDATE users SET password = ? WHERE email = ?',
      {
        replacements: [hashedPassword, 'admin@school.edu'],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    if (updatedRows > 0) {
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('❌ No admin user found, creating new admin user...');
      
      // Create admin user using raw SQL
      await sequelize.query(
        'INSERT INTO users (firstName, lastName, email, password, role, department, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
        {
          replacements: ['Admin', 'User', 'admin@school.edu', hashedPassword, 'admin', 'Computer Science', 1],
          type: sequelize.QueryTypes.INSERT
        }
      );
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('Email: admin@school.edu');
    console.log('Password: admin123');
    
    // Test the password
    const adminUser = await User.findOne({ where: { email: 'admin@school.edu' } });
    if (adminUser) {
      const isValid = await adminUser.comparePassword('admin123');
      console.log('Password verification test:', isValid ? '✅ PASS' : '❌ FAIL');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixAdminPassword();
