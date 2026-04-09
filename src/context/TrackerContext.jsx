
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getActivityLog } from '../utils/activityLog'
import { getTrackedJobs } from '../utils/trackedJobs'

const TrackerContext = createContext(null)

export function TrackerProvider({ children }) {
  const [trackedJobs, setTrackedJobs] = useState([])
  const [activityLog, setActivityLog] = useState([])

  useEffect(() => {
    const syncTrackerState = () => {
      setTrackedJobs(getTrackedJobs())
      setActivityLog(getActivityLog())
    }

    syncTrackerState()

    window.addEventListener('tracked-jobs-updated', syncTrackerState)
    window.addEventListener('activity-updated', syncTrackerState)

    return () => {
      window.removeEventListener('tracked-jobs-updated', syncTrackerState)
      window.removeEventListener('activity-updated', syncTrackerState)
    }
  }, [])

  const value = useMemo(() => {
    return {
      trackedJobs,
      activityLog,
    }
  }, [trackedJobs, activityLog])

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
