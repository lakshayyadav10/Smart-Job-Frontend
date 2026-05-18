
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import jobs from '../data/jobs'
import { useAuth } from './AuthContext'
import { getActivityLog } from '../utils/activityLog'
import {
  addTrackedJob as addLocalTrackedJob,
  getTrackedJobs as getLocalTrackedJobs,
  removeTrackedJob as removeLocalTrackedJob,
  updateTrackedJobFollowUpDate as updateLocalFollowUpDate,
  updateTrackedJobNotes as updateLocalNotes,
  updateTrackedJobStatus as updateLocalStatus,
} from '../utils/trackedJobs'
import { fetchActivity } from '../utils/activityApi'
import {
  createTrackedJob,
  deleteTrackedJob,
  fetchTrackedJobs,
  patchTrackedJob,
} from '../utils/trackedJobsApi'

const TrackerContext = createContext(null)

export function TrackerProvider({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth()
  const [trackedJobs, setTrackedJobs] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [isTrackerLoading, setIsTrackerLoading] = useState(true)

  const normalizeTrackedJob = (trackedJob) => {
    const fallbackJob = jobs.find((job) => String(job.id) === String(trackedJob.jobId))

    return {
      ...fallbackJob,
      ...trackedJob,
      id: fallbackJob?.id ?? trackedJob.jobId,
      trackingId: trackedJob._id,
      jobId: String(trackedJob.jobId),
      trackingStatus: trackedJob.status,
      trackingNotes: trackedJob.notes || '',
      followUpDate: trackedJob.followUpDate
        ? String(trackedJob.followUpDate).split('T')[0]
        : '',
    }
  }

  const syncTrackerState = async () => {
    if (isAuthLoading) return

    setIsTrackerLoading(true)

    try {
      if (isAuthenticated) {
        const [trackedJobsData, activityData] = await Promise.all([
          fetchTrackedJobs(),
          fetchActivity(),
        ])

        setTrackedJobs(trackedJobsData.trackedJobs.map(normalizeTrackedJob))
        setActivityLog(activityData.activities || [])
        return
      }

      setTrackedJobs(getLocalTrackedJobs().map(normalizeTrackedJob))
      setActivityLog(getActivityLog())
    } finally {
      setIsTrackerLoading(false)
    }
  }

  useEffect(() => {
    syncTrackerState()

    window.addEventListener('tracked-jobs-updated', syncTrackerState)
    window.addEventListener('activity-updated', syncTrackerState)

    return () => {
      window.removeEventListener('tracked-jobs-updated', syncTrackerState)
      window.removeEventListener('activity-updated', syncTrackerState)
    }
  }, [isAuthenticated, isAuthLoading])

  const findTrackedJob = (jobId) => {
    return trackedJobs.find((job) => String(job.jobId) === String(jobId))
  }

  const addTrackedJob = async (job) => {
    if (isAuthenticated) {
      await createTrackedJob(job)
      await syncTrackerState()
      return
    }

    addLocalTrackedJob(job.id)
  }

  const updateTrackedJob = async (jobId, updates) => {
    const trackedJob = findTrackedJob(jobId)

    if (isAuthenticated && trackedJob?.trackingId) {
      await patchTrackedJob(trackedJob.trackingId, updates)
      await syncTrackerState()
      return
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'status')) {
      updateLocalStatus(jobId, updates.status)
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'notes')) {
      updateLocalNotes(jobId, updates.notes)
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'followUpDate')) {
      updateLocalFollowUpDate(jobId, updates.followUpDate)
    }
  }

  const removeTrackedJob = async (jobId) => {
    const trackedJob = findTrackedJob(jobId)

    if (isAuthenticated && trackedJob?.trackingId) {
      await deleteTrackedJob(trackedJob.trackingId)
      await syncTrackerState()
      return
    }

    removeLocalTrackedJob(jobId)
  }

  const value = useMemo(() => {
    return {
      trackedJobs,
      activityLog,
      isTrackerLoading,
      addTrackedJob,
      updateTrackedJob,
      removeTrackedJob,
      refreshTracker: syncTrackerState,
    }
  }, [trackedJobs, activityLog, isTrackerLoading, isAuthenticated])

  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  )
}

export function useTracker() {
  const context = useContext(TrackerContext)

  if (!context) {
    throw new Error('useTracker must be used inside TrackerProvider')
  }

  return context
}
