require('dotenv').config();
const { sequelize } = require('../config/database');
const Thesis = require('../models/Thesis');
const { ThesisAuthors } = require('../models');

async function clearTheses() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected successfully');
    
    console.log('Deleting all theses...');
    
    // Delete all thesis-author relationships first
    await ThesisAuthors.destroy({ where: {} });
    console.log('Thesis-author relationships deleted');
    
    // Delete all theses
    const deletedCount = await Thesis.destroy({ where: {} });
    console.log(`Deleted ${deletedCount} theses`);
    
    console.log('\nAll theses cleared successfully!');
    console.log('Users, departments, and courses remain intact.');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error clearing theses:', error);
    await sequelize.close();
    process.exit(1);
  }
}

clearTheses();

