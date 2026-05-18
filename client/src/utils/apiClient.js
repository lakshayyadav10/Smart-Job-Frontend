const API_URL = import.meta.env.VITE_API_URL

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken')

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!contentType.includes('application/json')) {
    throw new Error(
      'API did not return JSON. Check that the backend is running on port 5000 and VITE_API_URL points to http://localhost:5000/api.'
    )
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}
