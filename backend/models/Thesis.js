const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Thesis = sequelize.define('Thesis', {
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
        msg: 'Thesis title is required'
      },
      len: {
        args: [1, 200],
        msg: 'Title cannot exceed 200 characters'
      }
    }
  },
  abstract: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Abstract is required'
      },
      len: {
        args: [1, 2000],
        msg: 'Abstract cannot exceed 2000 characters'
      }
    }
  },
  adviserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
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
  program: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Program is required'
      }
    }
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Academic year is required'
      }
    }
  },
  semester: {
    type: DataTypes.ENUM('1st Semester', '2nd Semester', 'Summer'),
    allowNull: false
  },
  keywords: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  category: {
    type: DataTypes.ENUM('Undergraduate', 'Graduate', 'Doctoral', 'Research Paper'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Under Review', 'Approved', 'Published', 'Rejected'),
    defaultValue: 'Draft'
  },
  mainDocument: {
    type: DataTypes.JSON,
    allowNull: true
  },
  supplementaryFiles: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      language: 'English'
    }
  },
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reviewComments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'theses',
  indexes: [
    { fields: ['title'] },
    { fields: ['department'] },
    { fields: ['program'] },
    { fields: ['academicYear'] },
    { fields: ['category'] },
    { fields: ['status'] },
    { fields: ['adviserId'] },
    { fields: ['isPublic'] },
    { fields: ['publishedAt'] }
  ]
});

// Instance methods
Thesis.prototype.incrementViewCount = async function() {
  this.viewCount += 1;
  return await this.save();
};

Thesis.prototype.incrementDownloadCount = async function() {
  this.downloadCount += 1;
  return await this.save();
};

// Static methods
Thesis.searchTheses = async function(query, filters = {}) {
  const whereClause = {
    isPublic: true,
    status: 'Published'
  };

  if (query) {
    const { Op } = require('sequelize');
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${query}%` } },
      { abstract: { [Op.like]: `%${query}%` } }
    ];
  }

  // Apply additional filters
  if (filters.department) {
    whereClause.department = filters.department;
  }
  if (filters.program) {
    whereClause.program = filters.program;
  }
  if (filters.academicYear) {
    whereClause.academicYear = filters.academicYear;
  }
  if (filters.category) {
    whereClause.category = filters.category;
  }

  return await this.findAll({
    where: whereClause,
    include: [
      {
        model: sequelize.models.User,
        as: 'authors',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: sequelize.models.User,
        as: 'adviser',
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
    order: [['publishedAt', 'DESC']]
  });
};

module.exports = Thesis;
