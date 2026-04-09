const STORAGE_KEY = 'jobTrackerActivity'

function notifyActivityUpdated() {
  window.dispatchEvent(new Event('activity-updated'))
}

export function getActivityLog() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function addActivityLogEntry(entry) {
  const currentLog = getActivityLog()

  const nextEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  }

  const updatedLog = [nextEntry, ...currentLog].slice(0, 25)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLog))
  notifyActivityUpdated()
}

export function clearActivityLog() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  notifyActivityUpdated()
}
