const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Calendar = sequelize.define('Calendar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event title is required'
      },
      len: {
        args: [1, 100],
        msg: 'Title cannot exceed 100 characters'
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
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'Location cannot exceed 100 characters'
      }
    }
  },
  eventType: {
    type: DataTypes.ENUM('Thesis Defense', 'Submission Deadline', 'Review Meeting', 'Workshop', 'Conference', 'Other'),
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Department is required'
      }
    }
  },
  createdById: {
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
  recurringPattern: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isAllDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    defaultValue: 'Medium'
  },
  status: {
    type: DataTypes.ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Postponed'),
    defaultValue: 'Scheduled'
  },
  reminders: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  notes: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Notes cannot exceed 1000 characters'
      }
    }
  }
}, {
  tableName: 'calendars',
  indexes: [
    { fields: ['startDate', 'endDate'] },
    { fields: ['department'] },
    { fields: ['eventType'] },
    { fields: ['createdById'] },
    { fields: ['status'] }
  ]
});

// Instance methods
Calendar.prototype.getDuration = function() {
  if (this.isAllDay) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day(s)`;
  }
  
  const startTime = this.startTime.split(':');
  const endTime = this.endTime.split(':');
  const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
  const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
  const durationMinutes = endMinutes - startMinutes;
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

Calendar.prototype.isHappeningNow = function() {
  const now = new Date();
  const startDateTime = new Date(`${this.startDate} ${this.startTime}`);
  const endDateTime = new Date(`${this.endDate} ${this.endTime}`);
  
  return now >= startDateTime && now <= endDateTime;
};

Calendar.prototype.isUpcoming = function() {
  const now = new Date();
  const startDateTime = new Date(`${this.startDate} ${this.startTime}`);
  
  return startDateTime > now;
};

// Static methods
Calendar.getEventsByDateRange = async function(startDate, endDate, department = null) {
  const { Op } = require('sequelize');
  const whereClause = {
    startDate: { [Op.gte]: startDate },
    endDate: { [Op.lte]: endDate }
  };
  
  if (department) {
    whereClause.department = department;
  }
  
  return await this.findAll({
    where: whereClause,
    include: [
      {
        model: sequelize.models.User,
        as: 'createdBy',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [['startDate', 'ASC'], ['startTime', 'ASC']]
  });
};

Calendar.getUpcomingEvents = async function(limit = 10, department = null) {
  const { Op } = require('sequelize');
  const now = new Date();
  const whereClause = {
    startDate: { [Op.gte]: now },
    status: { [Op.in]: ['Scheduled', 'In Progress'] }
  };
  
  if (department) {
    whereClause.department = department;
  }
  
  return await this.findAll({
    where: whereClause,
    include: [
      {
        model: sequelize.models.User,
        as: 'createdBy',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [['startDate', 'ASC'], ['startTime', 'ASC']],
    limit: limit
  });
};

module.exports = Calendar;
