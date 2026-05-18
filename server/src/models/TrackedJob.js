const mongoose = require('mongoose')

const trackedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: 'Not specified',
    },
    type: {
      type: String,
      default: 'Not specified',
    },
    mode: {
      type: String,
      default: 'Not specified',
    },
    experience: {
      type: String,
      default: 'Not specified',
    },
    salary: {
      type: String,
      default: 'Not disclosed',
    },
    description: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Saved', 'Interested', 'Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Saved',
    },
    notes: {
      type: String,
      default: '',
    },
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

trackedJobSchema.index({ user: 1, jobId: 1 }, { unique: true })

module.exports = mongoose.model('TrackedJob', trackedJobSchema)
