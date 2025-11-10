const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Course name is required'
      },
      len: {
        args: [1, 100],
        msg: 'Course name cannot exceed 100 characters'
      }
    }
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Course code is required'
      },
      len: {
        args: [1, 20],
        msg: 'Course code cannot exceed 20 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'departments',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  level: {
    type: DataTypes.ENUM('Undergraduate', 'Graduate', 'Doctoral'),
    allowNull: false,
    defaultValue: 'Undergraduate'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in years'
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Total credits required'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'courses',
  indexes: [
    { fields: ['name'] },
    { fields: ['code'] },
    { fields: ['department_id'] },
    { fields: ['level'] },
    { fields: ['is_active'] },
    { 
      fields: ['code', 'department_id'],
      unique: true,
      name: 'unique_course_code_per_department'
    }
  ]
});

// Instance methods
Course.prototype.getFullInfo = function() {
  return `${this.name} (${this.code})`;
};

module.exports = Course;

