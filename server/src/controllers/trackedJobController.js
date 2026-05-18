const TrackedJob = require('../models/TrackedJob')
const logActivity = require('../utils/activityLogger')


async function getTrackedJobs(req, res) {
  try {
    const trackedJobs = await TrackedJob.find({ user: req.user._id }).sort({
      updatedAt: -1,
    })

    res.status(200).json({
      success: true,
      trackedJobs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tracked jobs',
    })
  }
}

async function createTrackedJob(req, res) {
  try {
    const {
      jobId,
      title,
      company,
      location,
      type,
      mode,
      experience,
      salary,
      description,
      url,
      status,
      notes,
      followUpDate,
    } = req.body

    if (!jobId || !title || !company) {
      return res.status(400).json({
        success: false,
        message: 'jobId, title, and company are required',
      })
    }

    const existingTrackedJob = await TrackedJob.findOne({
      user: req.user._id,
      jobId,
    })

    if (existingTrackedJob) {
      return res.status(400).json({
        success: false,
        message: 'Job is already tracked',
      })
    }

    const trackedJob = await TrackedJob.create({
      user: req.user._id,
      jobId,
      title,
      company,
      location,
      type,
      mode,
      experience,
      salary,
      description,
      url,
      status,
      notes,
      followUpDate: followUpDate || null,
    })

    await logActivity({
  user: req.user._id,
  trackedJob: trackedJob._id,
  jobTitle: trackedJob.title,
  type: 'TRACKED',
  message: 'Added job to tracker',
})


    res.status(201).json({
      success: true,
      message: 'Job added to tracker',
      trackedJob,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating tracked job',
    })
  }
}

async function updateTrackedJob(req, res) {
  try {
    const allowedUpdates = ['status', 'notes', 'followUpDate']

    const updates = Object.keys(req.body).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = req.body[key]
      }

      return acc
    }, {})

    if (updates.followUpDate === '') {
      updates.followUpDate = null
    }

    const existingTrackedJob = await TrackedJob.findOne({
  _id: req.params.id,
  user: req.user._id,
})

if (!existingTrackedJob) {
  return res.status(404).json({
    success: false,
    message: 'Tracked job not found',
  })
}



    const trackedJob = await TrackedJob.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    )

    if (updates.status && updates.status !== existingTrackedJob.status) {
  await logActivity({
    user: req.user._id,
    trackedJob: trackedJob._id,
    jobTitle: trackedJob.title,
    type: 'STATUS_UPDATED',
    message: `Updated status to ${updates.status}`,
  })
}

if (Object.prototype.hasOwnProperty.call(updates, 'notes')) {
  await logActivity({
    user: req.user._id,
    trackedJob: trackedJob._id,
    jobTitle: trackedJob.title,
    type: 'NOTES_UPDATED',
    message: updates.notes ? 'Updated notes' : 'Cleared notes',
  })
}

if (Object.prototype.hasOwnProperty.call(updates, 'followUpDate')) {
  await logActivity({
    user: req.user._id,
    trackedJob: trackedJob._id,
    jobTitle: trackedJob.title,
    type: 'FOLLOW_UP_UPDATED',
    message: updates.followUpDate
      ? `Set follow-up date to ${updates.followUpDate}`
      : 'Cleared follow-up date',
  })
}

    if (!trackedJob) {
      return res.status(404).json({
        success: false,
        message: 'Tracked job not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Tracked job updated',
      trackedJob,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating tracked job',
    })
  }

}




async function deleteTrackedJob(req, res) {
  try {
    const trackedJob = await TrackedJob.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!trackedJob) {
      return res.status(404).json({
        success: false,
        message: 'Tracked job not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Tracked job deleted',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting tracked job',
    })
  }

  
}



module.exports = {
  getTrackedJobs,
  createTrackedJob,
  updateTrackedJob,
  deleteTrackedJob,
}
