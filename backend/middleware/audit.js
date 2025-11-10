const AuditLog = require('../models/AuditLog');

/**
 * Audit Logging Middleware
 * Objective 5.5: Comprehensive audit logging for accountability
 */

/**
 * Log an action to the audit log
 * @param {Object} options - Log options
 * @param {Number} options.userId - User ID (optional)
 * @param {String} options.action - Action name (e.g., 'thesis.create', 'user.delete')
 * @param {String} options.resourceType - Resource type (e.g., 'thesis', 'user')
 * @param {Number} options.resourceId - Resource ID (optional)
 * @param {String} options.description - Description of the action
 * @param {Object} options.metadata - Additional metadata
 * @param {String} options.status - Status ('success', 'failure', 'pending')
 * @param {String} options.errorMessage - Error message (if status is 'failure')
 * @param {Object} options.req - Express request object (for IP and user agent)
 */
async function logAction({
  userId = null,
  action,
  resourceType = null,
  resourceId = null,
  description = null,
  metadata = {},
  status = 'success',
  errorMessage = null,
  req = null
}) {
  try {
    const ipAddress = req?.ip || req?.connection?.remoteAddress || null;
    const userAgent = req?.get('user-agent') || null;

    await AuditLog.create({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      description: description || `${action} ${resourceType || ''} ${resourceId || ''}`.trim(),
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata,
      status,
      error_message: errorMessage
    });
  } catch (error) {
    // Don't throw errors in audit logging - just log to console
    console.error('Error logging audit action:', error);
  }
}

/**
 * Middleware to automatically log API requests
 * @param {String} action - Action name
 * @param {String} resourceType - Resource type
 */
function auditMiddleware(action, resourceType = null) {
  return async (req, res, next) => {
    // Store original res.json to intercept responses
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      // Log after response is sent
      const userId = req.user?.id || null;
      const resourceId = req.params?.id || data?.data?.id || null;
      const status = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'failure';
      const errorMessage = data?.message || (status === 'failure' ? 'Request failed' : null);

      logAction({
        userId,
        action,
        resourceType,
        resourceId,
        description: `${action} ${resourceType || ''} ${resourceId || ''}`.trim(),
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          body: req.body ? Object.keys(req.body) : null
        },
        status,
        errorMessage,
        req
      }).catch(err => {
        console.error('Error in audit middleware:', err);
      });

      return originalJson(data);
    };

    next();
  };
}

/**
 * Log file operations
 * @param {Object} req - Express request object
 * @param {String} action - Action name
 * @param {Number} resourceId - Resource ID
 * @param {String} status - Status
 * @param {String} errorMessage - Error message
 */
async function logFileOperation(req, action, resourceId, status = 'success', errorMessage = null) {
  await logAction({
    userId: req.user?.id || null,
    action,
    resourceType: 'file',
    resourceId,
    description: `${action} file for resource ${resourceId}`,
    metadata: {
      filename: req.file?.filename || req.file?.originalname,
      size: req.file?.size,
      mimetype: req.file?.mimetype
    },
    status,
    errorMessage,
    req
  });
}

/**
 * Log user actions
 * @param {Object} req - Express request object
 * @param {String} action - Action name
 * @param {Number} userId - User ID
 * @param {String} status - Status
 * @param {String} errorMessage - Error message
 */
async function logUserAction(req, action, userId, status = 'success', errorMessage = null) {
  await logAction({
    userId: req.user?.id || null,
    action,
    resourceType: 'user',
    resourceId: userId,
    description: `${action} user ${userId}`,
    status,
    errorMessage,
    req
  });
}

module.exports = {
  logAction,
  auditMiddleware,
  logFileOperation,
  logUserAction
};

