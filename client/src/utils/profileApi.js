import { apiRequest } from './apiClient'

export function fetchProfile() {
  return apiRequest('/profile')
}

export function saveProfile(profile) {
  return apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  })
}
