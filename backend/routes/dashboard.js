const express = require('express');
const router = express.Router();
const { Thesis, User, Department, Calendar } = require('../models');
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
      const [
        totalTheses,
        totalUsers,
        totalDepartments,
        recentSubmissions,
        publishedThisMonth,
        pendingReviews
      ] = await Promise.all([
        Thesis.count(),
        User.count({ where: { isActive: true } }),
        Department.count({ where: { isActive: true } }),
        Thesis.count({
          where: {
            submittedAt: {
              [require('sequelize').Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        Thesis.count({
          where: {
            status: 'Published',
            publishedAt: {
              [require('sequelize').Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
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
      // User statistics
      const [
        myTheses,
        publishedTheses,
        totalViews,
        totalDownloads,
        pendingReviews
      ] = await Promise.all([
        Thesis.count({ where: { adviserId: userId } }),
        Thesis.count({ 
          where: { 
            adviserId: userId,
            status: 'Published'
          } 
        }),
        Thesis.sum('viewCount', { 
          where: { adviserId: userId } 
        }) || 0,
        Thesis.sum('downloadCount', { 
          where: { adviserId: userId } 
        }) || 0,
        Thesis.count({ 
          where: { 
            adviserId: userId,
            status: 'Under Review'
          } 
        })
      ]);

      stats = {
        myTheses,
        publishedTheses,
        totalViews,
        totalDownloads,
        pendingReviews
      };
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
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
      const [recentTheses, recentUsers] = await Promise.all([
        Thesis.findAll({
          where: {
            submittedAt: {
              [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          include: [{
            model: User,
            as: 'adviser',
            attributes: ['firstName', 'lastName']
          }],
          order: [['submittedAt', 'DESC']],
          limit: 10
        }),
        User.findAll({
          where: {
            createdAt: {
              [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          order: [['createdAt', 'DESC']],
          limit: 5
        })
      ]);

      activities = [
        ...recentTheses.map(thesis => ({
          type: 'thesis',
          title: `New thesis submitted: "${thesis.title}"`,
          date: thesis.submittedAt,
          author: `${thesis.adviser.firstName} ${thesis.adviser.lastName}`
        })),
        ...recentUsers.map(user => ({
          type: 'user',
          title: `New user registered: ${user.firstName} ${user.lastName}`,
          date: user.createdAt,
          role: user.role
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    } else {
      // User activity - their own thesis submissions and status changes
      const recentTheses = await Thesis.findAll({
        where: { adviserId: userId },
        order: [['submittedAt', 'DESC']],
        limit: 10
      });

      activities = recentTheses.map(thesis => ({
        type: 'thesis',
        title: `Thesis "${thesis.title}" status: ${thesis.status}`,
        date: thesis.submittedAt,
        status: thesis.status
      }));
    }

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Get user's recent theses
router.get('/my-theses', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const theses = await Thesis.findAll({
      where: { adviserId: userId },
      order: [['submittedAt', 'DESC']],
      limit,
      attributes: ['id', 'title', 'status', 'submittedAt', 'viewCount', 'downloadCount']
    });

    res.json(theses);
  } catch (error) {
    console.error('Error fetching user theses:', error);
    res.status(500).json({ error: 'Failed to fetch user theses' });
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
      events = await Calendar.findAll({
        where: {
          eventDate: {
            [require('sequelize').Op.gte]: new Date()
          }
        },
        order: [['eventDate', 'ASC']],
        limit
      });
    } else {
      // Users see events related to their department or theses
      events = await Calendar.findAll({
        where: {
          eventDate: {
            [require('sequelize').Op.gte]: new Date()
          },
          [require('sequelize').Op.or]: [
            { department: req.user.department },
            { 
              thesisId: {
                [require('sequelize').Op.in]: await Thesis.findAll({
                  where: { adviserId: userId },
                  attributes: ['id']
                }).then(results => results.map(t => t.id))
              }
            }
          ]
        },
        order: [['eventDate', 'ASC']],
        limit
      });
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
});

// Get department statistics
router.get('/department-stats', protect, async (req, res) => {
  try {
    const userDepartment = req.user.department;

    const [departmentInfo, thesisCount, userCount] = await Promise.all([
      Department.findOne({ where: { name: userDepartment } }),
      Thesis.count({ where: { department: userDepartment } }),
      User.count({ where: { department: userDepartment, isActive: true } })
    ]);

    const stats = {
      department: departmentInfo,
      thesisCount,
      userCount,
      recentSubmissions: await Thesis.count({
        where: {
          department: userDepartment,
          submittedAt: {
            [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({ error: 'Failed to fetch department statistics' });
  }
});

module.exports = router;
