const { Sequelize } = require('sequelize');

// Determine database type from connection string or environment variable
const getDatabaseType = () => {
  if (process.env.DB_TYPE) {
    return process.env.DB_TYPE; // 'mysql' or 'postgres'
  }
  
  if (process.env.DATABASE_URL) {
    // Detect from connection string
    if (process.env.DATABASE_URL.startsWith('postgres://') || 
        process.env.DATABASE_URL.startsWith('postgresql://')) {
      return 'postgres';
    } else if (process.env.DATABASE_URL.startsWith('mysql://')) {
      return 'mysql';
    }
  }
  
  // Default to PostgreSQL if using Supabase, otherwise MySQL
  return process.env.DB_DIALECT || 'mysql';
};

const dbType = getDatabaseType();
const isPostgres = dbType === 'postgres';

// Support for connection string (Supabase, PlanetScale, Railway, etc.)
let sequelize;

if (process.env.DATABASE_URL) {
  // Use connection string (e.g., from Supabase, PlanetScale, Railway)
  const dialectOptions = {};
  
  // SSL configuration for cloud databases
  if (isPostgres) {
    // Supabase requires SSL
    dialectOptions.ssl = process.env.DB_SSL !== 'false' ? {
      require: true,
      rejectUnauthorized: false
    } : false;
  } else {
    // MySQL SSL
    dialectOptions.ssl = process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : false;
  }
  
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: isPostgres ? 'postgres' : 'mysql',
    logging: false, // Disable verbose SQL logging
    dialectOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
} else {
  // Use individual connection parameters
  const dialectOptions = {};
  
  if (isPostgres) {
    dialectOptions.ssl = process.env.DB_SSL !== 'false' ? {
      require: true,
      rejectUnauthorized: false
    } : false;
  } else {
    dialectOptions.ssl = process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : false;
  }
  
  sequelize = new Sequelize(
    process.env.DB_NAME || 'one_faith_archive',
    process.env.DB_USER || (isPostgres ? 'postgres' : 'root'),
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || (isPostgres ? 5432 : 3306),
      dialect: isPostgres ? 'postgres' : 'mysql',
      logging: false, // Disable verbose SQL logging
      dialectOptions,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`${isPostgres ? 'PostgreSQL' : 'MySQL'} database connected successfully`);
    
    // Import models to establish relationships
    require('../models');
    
    // Sync database (create tables if they don't exist)
    // Note: Sync is disabled by default to reduce console output
    // Enable it only when needed (e.g., first setup or schema changes)
    // Set ENABLE_SYNC=true in .env to enable automatic sync
    if (process.env.ENABLE_SYNC === 'true' && !process.env.SKIP_SYNC) {
      // Only create tables if they don't exist, don't alter existing tables
      // This prevents duplicate index creation issues
      // Silent sync to reduce console output
      await sequelize.sync({ alter: false, logging: false });
      console.log('Database synchronized');
    }
    // Otherwise, skip sync silently - tables already exist
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
