
import { addActivityLogEntry } from "./activityLog"





const STORAGE_KEY = 'trackedJobs'

function notifyTrackedJobsUpdated() {
  window.dispatchEvent(new Event('tracked-jobs-updated'))
}

export function getTrackedJobs() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getTrackedJob(jobId) {
  return getTrackedJobs().find((job) => job.jobId === jobId)
}

export function isJobTracked(jobId) {
  return getTrackedJobs().some((job) => job.jobId === jobId)
}

export function addTrackedJob(jobId) {
  const trackedJobs = getTrackedJobs()

  if (trackedJobs.some((job) => job.jobId === jobId)) {
    return
  }

 const newTrackedJob = {
  jobId,
  status: 'Saved',
  savedAt: new Date().toISOString(),
  notes: '',
  followUpDate: '',
}

addActivityLogEntry({
  type: 'TRACKED',
  jobId,
  message: 'Added job to tracker',
})


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...trackedJobs, newTrackedJob])
  )

  notifyTrackedJobsUpdated()
}

export function updateTrackedJobStatus(jobId, status) {
  const trackedJobs = getTrackedJobs().map((job) =>
    job.jobId === jobId ? { ...job, status } : job
  )

  addActivityLogEntry({
  type: 'STATUS_UPDATED',
  jobId,
  message: `Updated status to ${status}`,
})


  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedJobs))
  notifyTrackedJobsUpdated()
}

export function updateTrackedJobNotes(jobId, notes) {
  const trackedJobs = getTrackedJobs().map((job) =>
    job.jobId === jobId ? { ...job, notes } : job
  )

  addActivityLogEntry({
  type: 'NOTES_UPDATED',
  jobId,
  message: notes ? 'Updated notes' : 'Cleared notes',
})


  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedJobs))
  notifyTrackedJobsUpdated()
}

export function removeTrackedJob(jobId) {
  const trackedJobs = getTrackedJobs().filter((job) => job.jobId !== jobId)

  addActivityLogEntry({
  type: 'REMOVED',
  jobId,
  message: 'Removed job from tracker',
})

  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedJobs))
  notifyTrackedJobsUpdated()
}


export const TRACKING_STATUSES = [
  'Saved',
  'Interested',
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
]


export function updateTrackedJobFollowUpDate(jobId, followUpDate) {
  const trackedJobs = getTrackedJobs().map((job) =>
    job.jobId === jobId ? { ...job, followUpDate } : job
  )


  addActivityLogEntry({
  type: 'FOLLOW_UP_UPDATED',
  jobId,
  message: followUpDate
    ? `Set follow-up date to ${followUpDate}`
    : 'Cleared follow-up date',
})

  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedJobs))
  notifyTrackedJobsUpdated()
}
