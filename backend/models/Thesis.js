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
  adviser_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  academic_year: {
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
  main_document: {
    type: DataTypes.JSON,
    allowNull: true
  },
  supplementary_files: {
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
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  review_comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  review_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  download_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'theses',
  indexes: [
    { fields: ['title'] },
    { fields: ['department'] },
    { fields: ['program'] },
    { fields: ['academic_year'] },
    { fields: ['category'] },
    { fields: ['status'] },
    { fields: ['adviser_id'] },
    { fields: ['is_public'] },
    { fields: ['published_at'] }
  ]
});

// Instance methods
Thesis.prototype.incrementViewCount = async function() {
  this.view_count += 1;
  return await this.save();
};

Thesis.prototype.incrementDownloadCount = async function() {
  this.download_count += 1;
  return await this.save();
};

// Instance methods for authors
Thesis.prototype.addAuthor = async function(userId) {
  const { ThesisAuthors } = require('./index');
  await ThesisAuthors.findOrCreate({
    where: {
      thesis_id: this.id,
      user_id: userId
    }
  });
};

Thesis.prototype.removeAuthor = async function(userId) {
  const { ThesisAuthors } = require('./index');
  await ThesisAuthors.destroy({
    where: {
      thesis_id: this.id,
      user_id: userId
    }
  });
};

// Static methods
Thesis.searchTheses = async function(query, filters = {}) {
  const whereClause = {
    is_public: true,
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
        attributes: ['id', 'firstName', 'lastName'],
        through: { attributes: [] }
      },
      {
        model: sequelize.models.User,
        as: 'adviser',
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
    order: [['published_at', 'DESC']]
  });
};

module.exports = Thesis;
