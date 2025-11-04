const { sequelize } = require('./config/database');
const User = require('./models/User');

async function testLogin() {
  try {
    console.log('Testing login process...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Test finding user
    const user = await User.findOne({
      where: { email: 'admin@school.edu' },
      attributes: ['id', 'email', 'password', 'role']
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password
    });
    
    // Test password comparison
    const isValid = await user.comparePassword('admin123');
    console.log('✅ Password test:', isValid ? 'VALID' : 'INVALID');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testLogin();
