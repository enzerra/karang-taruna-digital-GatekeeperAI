import { API_BASE_URL } from '../config/api'
import { readStorage, writeStorage } from './storage'

export const AUTH_TOKEN_KEY = 'karang-taruna-auth-token'
const AUTH_USER_KEY = 'karang-taruna-auth-user'

function buildDemoToken(user) {
  if (!user?.email || !user?.role) return null
  return btoa(`${user.email}:${user.role}:${Date.now()}`)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

export function getAuthToken() {
  const token = readStorage(AUTH_TOKEN_KEY)
  if (token) return token

  const user = readStorage(AUTH_USER_KEY)
  const fallbackToken = buildDemoToken(user)
  if (fallbackToken) writeStorage(AUTH_TOKEN_KEY, fallbackToken)
  return fallbackToken
}

export async function requestJson(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL belum diatur.')
  }

  const token = getAuthToken()
  const method = String(options.method || 'GET').toUpperCase()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: method === 'GET' ? 'no-store' : options.cache,
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
