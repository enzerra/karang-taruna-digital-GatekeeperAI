import { API_BASE_URL } from '../config/api'
import { readStorage } from './storage'

export const AUTH_TOKEN_KEY = 'karang-taruna-auth-token'

export async function requestJson(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL belum diatur.')
  }

  const token = readStorage(AUTH_TOKEN_KEY)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Request gagal dengan status ${response.status}`
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      // abaikan body non-JSON
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}
