const Activity = require('../models/Activity')

async function logActivity({ user, trackedJob, jobTitle, type, message }) {
  await Activity.create({
    user,
    trackedJob: trackedJob || null,
    jobTitle: jobTitle || 'Tracked job',
    type,
    message,
  })
}

module.exports = logActivity
