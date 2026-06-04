import { USE_BACKEND_API } from '../../config/api'
import { AUTH_TOKEN_KEY, requestJson } from '../../lib/apiClient'
import { readStorage, writeStorage } from '../../lib/storage'

function buildDemoToken(user) {
  return btoa(`${user.email}:${user.role}:${Date.now()}`)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

export const AUTH_USER_KEY = 'karang-taruna-auth-user'

export async function login({ email, password, role }) {
  if (USE_BACKEND_API) {
    const result = await requestJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    })
    if (result?.token) writeStorage(AUTH_TOKEN_KEY, result.token)
    if (result?.user) writeStorage(AUTH_USER_KEY, result.user)
    return result
  }

  // Mode lokal (tanpa backend): tidak ada validasi kredensial.
  const user = { id: null, name: role === 'admin' ? 'Admin' : 'Bendahara', email, role }
  writeStorage(AUTH_TOKEN_KEY, buildDemoToken(user))
  writeStorage(AUTH_USER_KEY, user)
  return { token: null, user }
}

export function logout() {
  writeStorage(AUTH_TOKEN_KEY, null)
  writeStorage(AUTH_USER_KEY, null)
}

export function getCurrentUser() {
  return readStorage(AUTH_USER_KEY)
}
