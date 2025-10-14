const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Thesis = require('./Thesis');
const Calendar = require('./Calendar');
const Department = require('./Department');

// Define associations
User.hasMany(Thesis, { 
  foreignKey: 'adviserId', 
  as: 'advisedTheses' 
});
Thesis.belongsTo(User, { 
  foreignKey: 'adviserId', 
  as: 'adviser' 
});

User.hasMany(Calendar, { 
  foreignKey: 'createdById', 
  as: 'createdEvents' 
});
Calendar.belongsTo(User, { 
  foreignKey: 'createdById', 
  as: 'createdBy' 
});

User.hasMany(Thesis, { 
  foreignKey: 'reviewerId', 
  as: 'reviewedTheses' 
});
Thesis.belongsTo(User, { 
  foreignKey: 'reviewerId', 
  as: 'reviewer' 
});

Department.hasMany(User, { 
  foreignKey: 'headId', 
  as: 'head' 
});
User.belongsTo(Department, { 
  foreignKey: 'headId', 
  as: 'departmentHead' 
});

// Many-to-many relationship for thesis authors
const ThesisAuthors = sequelize.define('ThesisAuthors', {
  thesisId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'theses',
      key: 'id'
    }
  },
  userId: {
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
  foreignKey: 'userId', 
  as: 'authoredTheses' 
});
Thesis.belongsToMany(User, { 
  through: ThesisAuthors, 
  foreignKey: 'thesisId', 
  as: 'authors' 
});

module.exports = {
  sequelize,
  User,
  Thesis,
  Calendar,
  Department,
  ThesisAuthors
};
