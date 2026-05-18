const Activity = require('../models/Activity')

async function getActivity(req, res) {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(25)

    res.status(200).json({
      success: true,
      activities,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activity',
    })
  }
}

module.exports = {
  getActivity,
}
