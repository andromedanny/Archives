const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Department name is required'
      },
      len: {
        args: [1, 100],
        msg: 'Department name cannot exceed 100 characters'
      }
    }
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Department code is required'
      },
      len: {
        args: [1, 10],
        msg: 'Department code cannot exceed 10 characters'
      }
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Description cannot exceed 500 characters'
      }
    }
  },
  headId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  programs: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  contactInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  statistics: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      totalStudents: 0,
      totalFaculty: 0,
      totalTheses: 0
    }
  }
}, {
  tableName: 'departments',
  indexes: [
    { fields: ['name'] },
    { fields: ['code'] },
    { fields: ['isActive'] }
  ]
});

// Instance methods
Department.prototype.getFullInfo = function() {
  return `${this.name} (${this.code})`;
};

Department.prototype.updateStatistics = async function() {
  const { Op } = require('sequelize');
  const User = sequelize.models.User;
  const Thesis = sequelize.models.Thesis;
  
  const [studentCount, facultyCount, thesisCount] = await Promise.all([
    User.count({ 
      where: { 
        department: this.name, 
        role: 'student', 
        isActive: true 
      } 
    }),
    User.count({ 
      where: { 
        department: this.name, 
        role: { [Op.in]: ['faculty', 'adviser'] }, 
        isActive: true 
      } 
    }),
    Thesis.count({ 
      where: { 
        department: this.name, 
        status: 'Published' 
      } 
    })
  ]);
  
  this.statistics = {
    totalStudents: studentCount,
    totalFaculty: facultyCount,
    totalTheses: thesisCount
  };
  
  return await this.save();
};

module.exports = Department;
