const mongoose = require('mongoose')

const aiAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trackedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'TrackedJob', required: true },
    type: { type: String, enum: ['JOB_MATCH', 'INTERVIEW_PREP'], required: true },
    result: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('AIAnalysis', aiAnalysisSchema)
