const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Thesis = require('./Thesis');
const Calendar = require('./Calendar');
const Department = require('./Department');
const Course = require('./Course');
const AuditLog = require('./AuditLog');

// Define associations
User.hasMany(Thesis, { 
  foreignKey: 'adviser_id', 
  as: 'advisedTheses' 
});
Thesis.belongsTo(User, { 
  foreignKey: 'adviser_id', 
  as: 'adviser' 
});

User.hasMany(Calendar, { 
  foreignKey: 'organizer_id', 
  as: 'organizedEvents' 
});
Calendar.belongsTo(User, { 
  foreignKey: 'organizer_id', 
  as: 'organizer' 
});

Thesis.hasMany(Calendar, { 
  foreignKey: 'thesis_id', 
  as: 'events' 
});
Calendar.belongsTo(Thesis, { 
  foreignKey: 'thesis_id', 
  as: 'thesis' 
});

User.hasMany(Thesis, { 
  foreignKey: 'reviewer_id', 
  as: 'reviewedTheses' 
});
Thesis.belongsTo(User, { 
  foreignKey: 'reviewer_id', 
  as: 'reviewer' 
});

Department.hasMany(User, { 
  foreignKey: 'head_id', 
  as: 'head' 
});
User.belongsTo(Department, { 
  foreignKey: 'head_id', 
  as: 'departmentHead' 
});

// Department-Course relationship
Department.hasMany(Course, {
  foreignKey: 'department_id',
  as: 'courses'
});
Course.belongsTo(Department, {
  foreignKey: 'department_id',
  as: 'department'
});

// Many-to-many relationship for thesis authors
const ThesisAuthors = sequelize.define('ThesisAuthors', {
  thesis_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'theses',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'thesis_authors',
  timestamps: false
});

User.belongsToMany(Thesis, { 
  through: ThesisAuthors, 
  foreignKey: 'user_id', 
  as: 'authoredTheses' 
});
Thesis.belongsToMany(User, { 
  through: ThesisAuthors, 
  foreignKey: 'thesis_id', 
  as: 'authors' 
});

// AuditLog associations
User.hasMany(AuditLog, {
  foreignKey: 'user_id',
  as: 'auditLogs'
});
AuditLog.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

module.exports = {
  sequelize,
  User,
  Thesis,
  Calendar,
  Department,
  Course,
  ThesisAuthors,
  AuditLog
};
