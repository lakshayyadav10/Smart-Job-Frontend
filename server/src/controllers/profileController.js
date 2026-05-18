const UserProfile = require('../models/UserProfile')

async function getProfile(req, res) {
  const profile = await UserProfile.findOne({ user: req.user._id })

  res.status(200).json({
    success: true,
    profile,
  })
}

async function upsertProfile(req, res) {
  const profile = await UserProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      resumeText: req.body.resumeText || '',
      targetRole: req.body.targetRole || '',
      skills: req.body.skills || [],
      experienceLevel: req.body.experienceLevel || '',
      preferredLocations: req.body.preferredLocations || [],
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    message: 'Profile saved',
    profile,
  })
}

module.exports = {
  getProfile,
  upsertProfile,
}
