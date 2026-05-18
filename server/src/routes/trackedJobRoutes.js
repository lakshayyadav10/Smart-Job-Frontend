const express = require('express')
const {
  getTrackedJobs,
  createTrackedJob,
  updateTrackedJob,
  deleteTrackedJob,
} = require('../controllers/trackedJobController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router
  .route('/')
  .get(protect, getTrackedJobs)
  .post(protect, createTrackedJob)

router
  .route('/:id')
  .patch(protect, updateTrackedJob)
  .delete(protect, deleteTrackedJob)

module.exports = router
