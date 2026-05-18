const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trackedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrackedJob',
      default: null,
    },
    jobTitle: {
      type: String,
      default: 'Tracked job',
    },
    type: {
      type: String,
      enum: [
        'TRACKED',
        'STATUS_UPDATED',
        'NOTES_UPDATED',
        'FOLLOW_UP_UPDATED',
        'REMOVED',
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Activity', activitySchema)
