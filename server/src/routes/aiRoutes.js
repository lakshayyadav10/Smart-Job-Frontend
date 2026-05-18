const express = require('express')
const {
  analyzeJobMatch,
  generateInterviewPrep,
  getAIHistory,
  getLatestJobMatch,
  getLatestInterviewPrep,
} = require('../controllers/aiController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/history', protect, getAIHistory)
router.post('/job-match/:trackedJobId', protect, analyzeJobMatch)
router.get('/job-match/:trackedJobId/latest', protect, getLatestJobMatch)
router.post('/interview-prep/:trackedJobId', protect, generateInterviewPrep)
router.get('/interview-prep/:trackedJobId/latest', protect, getLatestInterviewPrep)

module.exports = router
