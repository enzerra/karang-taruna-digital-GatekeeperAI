import { API_BASE_URL } from '../config/api'

export async function requestJson(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL belum diatur.')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request gagal dengan status ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}
