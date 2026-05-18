import { apiRequest } from './apiClient'

export function fetchActivity() {
  return apiRequest('/activity')
}
