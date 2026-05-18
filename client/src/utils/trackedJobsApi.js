import { apiRequest } from './apiClient'

export function fetchTrackedJobs() {
  return apiRequest('/tracked-jobs')
}

export function createTrackedJob(job) {
  return apiRequest('/tracked-jobs', {
    method: 'POST',
    body: JSON.stringify({
      jobId: String(job.id),
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      mode: job.mode,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      url: job.url,
      status: 'Saved',
      notes: '',
      followUpDate: null,
    }),
  })
}

export function patchTrackedJob(trackedJobId, updates) {
  return apiRequest(`/tracked-jobs/${trackedJobId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export function deleteTrackedJob(trackedJobId) {
  return apiRequest(`/tracked-jobs/${trackedJobId}`, {
    method: 'DELETE',
  })
}
