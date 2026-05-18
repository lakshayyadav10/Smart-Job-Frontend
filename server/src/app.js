
const express = require('express')
const cors = require('cors')
const healthRoutes = require('./routes/healthRoutes')
const authRoutes = require('./routes/authRoutes')
const trackedJobRoutes = require('./routes/trackedJobRoutes')
const activityRoutes = require('./routes/activityRoutes')
const profileRoutes = require('./routes/profileRoutes')
const aiRoutes = require('./routes/aiRoutes')

const app = express()
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Smart Job Tracker API',
  })
})

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/tracked-jobs', trackedJobRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/ai', aiRoutes)

module.exports = app
