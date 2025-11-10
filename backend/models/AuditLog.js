const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Audit Log Model
 * Objective 5.5: Comprehensive audit logging for accountability
 */
const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Action is required'
      }
    }
  },
  resource_type: {
    type: DataTypes.STRING(50),
    allowNull: true // e.g., 'thesis', 'user', 'calendar', 'file'
  },
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  status: {
    type: DataTypes.ENUM('success', 'failure', 'pending'),
    defaultValue: 'success'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['action'] },
    { fields: ['resource_type'] },
    { fields: ['resource_id'] },
    { fields: ['created_at'] },
    { fields: ['status'] }
  ]
});

module.exports = AuditLog;

