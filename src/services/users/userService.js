import { getUsers, saveUsers } from './userStore'
import { USE_BACKEND_API } from '../../config/api'
import { requestJson } from '../../lib/apiClient'

function sanitizeUserPayload(payload = {}) {
  return {
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim().toLowerCase(),
    role: String(payload.role || 'anggota').toLowerCase(),
    status: payload.status || 'Aktif',
    lastLogin: String(payload.lastLogin || '-').trim(),
  }
}

export async function listUsers() {
  if (USE_BACKEND_API) return requestJson('/api/users')
  return getUsers()
}

export async function findUserById(id) {
  if (USE_BACKEND_API) return requestJson(`/api/users/${Number(id)}`)
  const users = getUsers()
  return users.find((item) => item.id === Number(id)) ?? null
}

export async function createUser(payload) {
  if (USE_BACKEND_API) {
    return requestJson('/api/users', { method: 'POST', body: JSON.stringify(payload) })
  }
  const users = getUsers()
  const nextUser = {
    id: Date.now(),
    ...sanitizeUserPayload(payload),
  }
  const nextUsers = [nextUser, ...users]
  saveUsers(nextUsers)
  return nextUser
}

export async function updateUser(id, payload) {
  if (USE_BACKEND_API) {
    return requestJson(`/api/users/${Number(id)}`, { method: 'PUT', body: JSON.stringify(payload) })
  }
  const targetId = Number(id)
  const users = getUsers()
  const nextUsers = users.map((item) => {
    if (item.id !== targetId) return item
    return { ...item, ...sanitizeUserPayload(payload) }
  })
  saveUsers(nextUsers)
  return nextUsers.find((item) => item.id === targetId) ?? null
}

export async function removeUser(id) {
  if (USE_BACKEND_API) {
    await requestJson(`/api/users/${Number(id)}`, { method: 'DELETE' })
    return true
  }
  const targetId = Number(id)
  const users = getUsers()
  const nextUsers = users.filter((item) => item.id !== targetId)
  saveUsers(nextUsers)
  return true
}
