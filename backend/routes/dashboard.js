const express = require('express');
const router = express.Router();
const { Thesis, User, Department, Calendar, Course } = require('../models');
const { protect } = require('../middleware/auth');

// Test route to verify server is working
router.get('/test', (req, res) => {
  res.json({ message: 'Dashboard routes are working!', timestamp: new Date().toISOString() });
});

// Mock data routes for testing (remove these in production)
router.get('/mock-stats', (req, res) => {
  res.json({
    totalTheses: 150,
    totalUsers: 45,
    totalDepartments: 3,
    recentSubmissions: 12,
    myTheses: 5,
    publishedTheses: 3,
    totalViews: 1250,
    totalDownloads: 89
  });
});

router.get('/mock-activity', (req, res) => {
  res.json([
    {
      type: 'thesis',
      title: 'New thesis submitted: "Machine Learning Applications"',
      date: new Date().toISOString(),
      author: 'John Doe'
    },
    {
      type: 'user',
      title: 'New user registered: Jane Smith',
      date: new Date(Date.now() - 3600000).toISOString(),
      role: 'student'
    }
  ]);
});

router.get('/mock-my-theses', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Machine Learning Applications in Healthcare',
      status: 'Published',
      submittedAt: new Date().toISOString(),
      viewCount: 45,
      downloadCount: 12
    },
    {
      id: 2,
      title: 'Web Development Best Practices',
      status: 'Under Review',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      viewCount: 23,
      downloadCount: 5
    }
  ]);
});

router.get('/mock-upcoming-events', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Thesis Defense - Machine Learning Research',
      eventDate: new Date(Date.now() + 86400000).toISOString(),
      eventType: 'thesis_defense'
    },
    {
      id: 2,
      title: 'Department Meeting',
      eventDate: new Date(Date.now() + 172800000).toISOString(),
      eventType: 'meeting'
    }
  ]);
});

router.get('/mock-department-stats', (req, res) => {
  res.json({
    department: {
      name: 'Computer Science',
      code: 'CS',
      description: 'Computer Science Department'
    },
    thesisCount: 45,
    userCount: 120,
    recentSubmissions: 8
  });
});

// Get dashboard statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'admin') {
      // Admin statistics
      const Op = require('sequelize').Op;
      const [
        totalTheses,
        totalUsers,
        totalDepartments,
        recentSubmissions,
        publishedThisMonth,
        pendingReviews
      ] = await Promise.all([
        Thesis.count(),
        User.count({ where: { is_active: true } }),
        Department.count({ where: { is_active: true } }),
        Thesis.count({
          where: {
            submitted_at: {
              [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        Thesis.count({
          where: {
            status: 'Published',
            published_at: {
              [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),
        Thesis.count({ where: { status: 'Under Review' } })
      ]);

      stats = {
        totalTheses,
        totalUsers,
        totalDepartments,
        recentSubmissions,
        publishedThisMonth,
        pendingReviews
      };
    } else {
      // User statistics - count theses where user is an author
      const { ThesisAuthors } = require('../models');
      
      // Get all thesis IDs where user is an author
      const authoredTheses = await ThesisAuthors.findAll({
        where: { user_id: userId },
        attributes: ['thesis_id']
      });
      
      const thesisIds = authoredTheses.map(at => at.thesis_id);
      
      const [
        myTheses,
        publishedTheses,
        totalViews,
        totalDownloads,
        pendingReviews
      ] = await Promise.all([
        thesisIds.length > 0 ? Thesis.count({ 
          where: { 
            id: { [require('sequelize').Op.in]: thesisIds } 
          } 
        }) : 0,
        thesisIds.length > 0 ? Thesis.count({ 
          where: { 
            id: { [require('sequelize').Op.in]: thesisIds },
            status: 'Published'
          } 
        }) : 0,
        thesisIds.length > 0 ? Thesis.sum('view_count', { 
          where: { 
            id: { [require('sequelize').Op.in]: thesisIds } 
          } 
        }) || 0 : 0,
        thesisIds.length > 0 ? Thesis.sum('download_count', { 
          where: { 
            id: { [require('sequelize').Op.in]: thesisIds } 
          } 
        }) || 0 : 0,
        thesisIds.length > 0 ? Thesis.count({ 
          where: { 
            id: { [require('sequelize').Op.in]: thesisIds },
            status: 'Under Review'
          } 
        }) : 0
      ]);

      stats = {
        myTheses,
        publishedTheses,
        totalViews,
        totalDownloads,
        pendingReviews
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard statistics' 
    });
  }
});

// Get recent activity
router.get('/activity', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let activities = [];

    if (userRole === 'admin') {
      // Admin activity - recent thesis submissions and user registrations
      const Op = require('sequelize').Op;
      const [recentTheses, recentUsers] = await Promise.all([
        Thesis.findAll({
          where: {
            submitted_at: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          include: [{
            model: User,
            as: 'adviser',
            attributes: ['firstName', 'lastName']
          }],
          order: [['submitted_at', 'DESC']],
          limit: 10
        }),
        User.findAll({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          order: [['createdAt', 'DESC']],
          limit: 5
        })
      ]);

      activities = [
        ...recentTheses.map(thesis => ({
          id: thesis.id,
          type: 'thesis',
          title: `New thesis submitted: "${thesis.title}"`,
          date: thesis.submitted_at || thesis.createdAt,
          author: thesis.adviser ? `${thesis.adviser.firstName} ${thesis.adviser.lastName}` : 'Unknown'
        })),
        ...recentUsers.map(user => ({
          id: user.id,
          type: 'user',
          title: `New user registered: ${user.firstName} ${user.lastName}`,
          date: user.createdAt,
          role: user.role
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    } else {
      // User activity - their own thesis submissions and status changes
      const Op = require('sequelize').Op;
      const recentTheses = await Thesis.findAll({
        where: { adviser_id: userId },
        order: [['submitted_at', 'DESC']],
        limit: 10
      });

      activities = recentTheses.map(thesis => ({
        id: thesis.id,
        type: 'thesis',
        title: `Thesis "${thesis.title}" status: ${thesis.status}`,
        date: thesis.submitted_at || thesis.createdAt,
        status: thesis.status
      }));
    }

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recent activity' 
    });
  }
});

// Get user's recent theses
router.get('/my-theses', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;
    const { ThesisAuthors } = require('../models');
    const { Op } = require('sequelize');

    // Get thesis IDs where user is an author
    const authoredTheses = await ThesisAuthors.findAll({
      where: { user_id: userId },
      attributes: ['thesis_id']
    });
    
    const thesisIds = authoredTheses.map(at => at.thesis_id);
    
    const theses = thesisIds.length > 0 ? await Thesis.findAll({
      where: { 
        id: { [Op.in]: thesisIds } 
      },
      order: [['submitted_at', 'DESC']],
      limit,
      attributes: ['id', 'title', 'status', 'submitted_at', 'view_count', 'download_count']
    }) : [];

    res.json({
      success: true,
      data: theses
    });
  } catch (error) {
    console.error('Error fetching user theses:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user theses' 
    });
  }
});

// Get upcoming events
router.get('/upcoming-events', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const limit = parseInt(req.query.limit) || 5;

    let events = [];

    if (userRole === 'admin') {
      // Admin sees all upcoming events
      const Op = require('sequelize').Op;
      events = await Calendar.findAll({
        where: {
          event_date: {
            [Op.gte]: new Date()
          }
        },
        order: [['event_date', 'ASC']],
        limit
      });
    } else {
      // Users see events related to their department or theses
      const Op = require('sequelize').Op;
      const userThesisIds = await Thesis.findAll({
        where: { adviser_id: userId },
        attributes: ['id']
      }).then(results => results.map(t => t.id));
      
      events = await Calendar.findAll({
        where: {
          event_date: {
            [Op.gte]: new Date()
          },
          [Op.or]: [
            { department: req.user.department },
            ...(userThesisIds.length > 0 ? [{
              thesis_id: {
                [Op.in]: userThesisIds
              }
            }] : [])
          ]
        },
        order: [['event_date', 'ASC']],
        limit
      });
    }

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch upcoming events' 
    });
  }
});

// Get department statistics
router.get('/department-stats', protect, async (req, res) => {
  try {
    const userDepartment = req.user.department;
    const Op = require('sequelize').Op;

    const [departmentInfo, thesisCount, userCount] = await Promise.all([
      Department.findOne({ where: { name: userDepartment } }),
      Thesis.count({ where: { department: userDepartment } }),
      User.count({ where: { department: userDepartment, is_active: true } })
    ]);

    const stats = {
      department: departmentInfo,
      thesisCount,
      userCount,
      recentSubmissions: await Thesis.count({
        where: {
          department: userDepartment,
          submitted_at: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch department statistics' 
    });
  }
});

// @desc    Get all departments (accessible to all authenticated users)
// @route   GET /api/dashboard/departments
// @access  Private
router.get('/departments', protect, async (req, res) => {
  // Set timeout to prevent hanging requests (10 seconds)
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error('Database query timeout'));
    }, 10000); // 10 seconds timeout
  });

  try {
    // Race between database query and timeout
    const queryPromise = Department.findAll({
      where: { is_active: true },
      include: [{
        model: Course,
        as: 'courses',
        required: false,
        attributes: ['id', 'name', 'code', 'level', 'is_active'],
        where: { is_active: true }
      }],
      order: [['name', 'ASC']]
    });

    const departments = await Promise.race([queryPromise, timeoutPromise]);
    
    // Clear timeout if query completes successfully
    clearTimeout(timeout);

    // Ensure response is sent only once
    if (!res.headersSent) {
      res.json({
        success: true,
        count: departments.length,
        data: departments
      });
    }
  } catch (error) {
    // Clear timeout on error
    if (timeout) clearTimeout(timeout);
    
    console.error('Get departments error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Ensure response is sent only once
    if (!res.headersSent) {
      const statusCode = error.message === 'Database query timeout' ? 504 : 500;
      const message = error.message === 'Database query timeout' 
        ? 'Request timeout. Database may be slow or unavailable. Please try again.'
        : 'Server error';
      
      res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

module.exports = router;
