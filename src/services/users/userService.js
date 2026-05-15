import { getUsers, saveUsers } from './userStore'

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
  return getUsers()
}

export async function findUserById(id) {
  const users = getUsers()
  return users.find((item) => item.id === Number(id)) ?? null
}

export async function createUser(payload) {
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
  const targetId = Number(id)
  const users = getUsers()
  const nextUsers = users.filter((item) => item.id !== targetId)
  saveUsers(nextUsers)
  return true
}
