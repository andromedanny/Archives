const express = require('express');
const jwt = require('jsonwebtoken');
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function testFullLogin() {
  try {
    console.log('Testing full login flow...');
    
    // Test JWT secret
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
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
      role: user.role
    });
    
    // Test password comparison
    const isValid = await user.comparePassword('admin123');
    console.log('✅ Password test:', isValid ? 'VALID' : 'INVALID');
    
    if (!isValid) {
      console.log('❌ Password validation failed');
      return;
    }
    
    // Test JWT token generation
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    
    console.log('✅ JWT token generated:', token.substring(0, 20) + '...');
    
    // Test response structure
    const response = {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
    
    console.log('✅ Response structure valid');
    console.log('Login test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testFullLogin();
