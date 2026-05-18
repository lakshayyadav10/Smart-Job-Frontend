const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Job Tracker API is running',
    date: new Date().toISOString(),
  })
})

module.exports = router
