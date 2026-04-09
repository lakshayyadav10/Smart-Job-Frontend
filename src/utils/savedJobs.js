const STORAGE_KEY = 'savedJobs'

function notifySavedJobsChanged() {
  window.dispatchEvent(new Event('saved-jobs-updated'))
}

export function getSavedJobIds() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

export function saveJobId(jobId) {
  const saved = getSavedJobIds()

  if (!saved.includes(jobId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved, jobId]))
    notifySavedJobsChanged()
  }
}

export function removeJobId(jobId) {
  const saved = getSavedJobIds().filter((id) => id !== jobId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  notifySavedJobsChanged()
}

export function isJobSaved(jobId) {
  return getSavedJobIds().includes(jobId)
}
