const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    resumeText: {
      type: String,
      default: '',
    },
    targetRole: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      default: '',
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('UserProfile', userProfileSchema)
