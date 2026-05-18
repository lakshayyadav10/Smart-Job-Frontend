import { apiRequest } from './apiClient'

export function analyzeJobMatch(trackedJobId) {
  return apiRequest(`/ai/job-match/${trackedJobId}`, {
    method: 'POST',
  })
}

export function fetchLatestJobMatch(trackedJobId) {
  return apiRequest(`/ai/job-match/${trackedJobId}/latest`)
}

export function generateInterviewPrep(trackedJobId) {
  return apiRequest(`/ai/interview-prep/${trackedJobId}`, {
    method: 'POST',
  })
}

export function fetchLatestInterviewPrep(trackedJobId) {
  return apiRequest(`/ai/interview-prep/${trackedJobId}/latest`)
}

export function fetchAIHistory() {
  return apiRequest('/ai/history')
}
