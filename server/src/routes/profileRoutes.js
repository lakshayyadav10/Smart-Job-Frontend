const express = require('express')
const { getProfile, upsertProfile } = require('../controllers/profileController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, getProfile)
router.put('/', protect, upsertProfile)

module.exports = router
