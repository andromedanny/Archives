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
  event_type: {
    type: DataTypes.ENUM('thesis_submission', 'thesis_defense', 'title_defense', 'meeting', 'deadline', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
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
  thesis_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'theses',
      key: 'id'
    }
  },
  organizer_id: {
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
  is_recurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurrence_pattern: {
    type: DataTypes.JSON,
    allowNull: true
  },
  is_public: {
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
    { fields: ['event_date'] },
    { fields: ['event_type'] },
    { fields: ['department'] },
    { fields: ['thesis_id'] },
    { fields: ['organizer_id'] },
    { fields: ['status'] },
    { fields: ['is_public'] }
  ]
});

// Instance methods
Calendar.prototype.isUpcoming = function() {
  return new Date(this.event_date) > new Date();
};

Calendar.prototype.isPast = function() {
  return new Date(this.event_date) < new Date();
};

Calendar.prototype.getDuration = function() {
  if (this.end_date) {
    const start = new Date(this.event_date);
    const end = new Date(this.end_date);
    return Math.round((end - start) / (1000 * 60)); // Duration in minutes
  }
  return null;
};

// Static methods
Calendar.getUpcomingEvents = async function(limit = 10, department = null) {
  const whereClause = {
    event_date: {
      [require('sequelize').Op.gte]: new Date()
    },
    status: 'scheduled'
  };

  if (department) {
    whereClause.department = department;
  }

  return await this.findAll({
    where: whereClause,
    order: [['event_date', 'ASC']],
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
    event_date: {
      [require('sequelize').Op.between]: [startDate, endDate]
    }
  };

  if (department) {
    whereClause.department = department;
  }

  return await this.findAll({
    where: whereClause,
    order: [['event_date', 'ASC']],
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