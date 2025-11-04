const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Calendar = sequelize.define('Calendar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event title is required'
      },
      len: {
        args: [1, 200],
        msg: 'Title cannot exceed 200 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  eventType: {
    type: DataTypes.ENUM('thesis_submission', 'thesis_defense', 'title_defense', 'meeting', 'deadline', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  thesisId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'theses',
      key: 'id'
    }
  },
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  attendees: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurrencePattern: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'calendar_events',
  indexes: [
    { fields: ['eventDate'] },
    { fields: ['eventType'] },
    { fields: ['department'] },
    { fields: ['thesisId'] },
    { fields: ['organizerId'] },
    { fields: ['status'] },
    { fields: ['isPublic'] }
  ]
});

// Instance methods
Calendar.prototype.isUpcoming = function() {
  return new Date(this.eventDate) > new Date();
};

Calendar.prototype.isPast = function() {
  return new Date(this.eventDate) < new Date();
};

Calendar.prototype.getDuration = function() {
  if (this.endDate) {
    const start = new Date(this.eventDate);
    const end = new Date(this.endDate);
    return Math.round((end - start) / (1000 * 60)); // Duration in minutes
  }
  return null;
};

// Static methods
Calendar.getUpcomingEvents = async function(limit = 10, department = null) {
  const whereClause = {
    eventDate: {
      [require('sequelize').Op.gte]: new Date()
    },
    status: 'scheduled'
  };

  if (department) {
    whereClause.department = department;
  }

  return await this.findAll({
    where: whereClause,
    order: [['eventDate', 'ASC']],
    limit,
    include: [
      {
        model: sequelize.models.User,
        as: 'organizer',
        attributes: ['id', 'firstName', 'lastName']
      }
    ]
  });
};

Calendar.getEventsByDateRange = async function(startDate, endDate, department = null) {
  const whereClause = {
    eventDate: {
      [require('sequelize').Op.between]: [startDate, endDate]
    }
  };

  if (department) {
    whereClause.department = department;
  }

  return await this.findAll({
    where: whereClause,
    order: [['eventDate', 'ASC']],
    include: [
      {
        model: sequelize.models.User,
        as: 'organizer',
        attributes: ['id', 'firstName', 'lastName']
      }
    ]
  });
};

module.exports = Calendar;