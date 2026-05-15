import { USERS } from '../../mocks/portalData'
import { readStorage, writeStorage } from '../../lib/storage'

const STORAGE_KEY = 'karang-taruna-users-v1'

const ROLE_STYLE = {
  admin: { bg: '#f3e8ff', color: '#7e22ce', icon: 'ADM' },
  bendahara: { bg: '#dbeafe', color: '#1e40af', icon: 'BND' },
  anggota: { bg: '#f1f5f9', color: '#475569', icon: 'AGT' },
}

function normalizeUser(item, idx = 0) {
  const role = String(item.role || 'anggota').toLowerCase()
  return {
    id: Number(item.id) || Date.now() + idx,
    name: String(item.name || 'Pengguna Baru').trim(),
    email: String(item.email || '').trim(),
    role,
    status: item.status || 'Aktif',
    lastLogin: String(item.lastLogin || '-').trim(),
  }
}

function safeParse(raw) {
  try {
    const parsed = raw
    if (!Array.isArray(parsed)) return null
    return parsed.map((item, idx) => normalizeUser(item, idx))
  } catch {
    return null
  }
}

export function getUsers() {
  if (typeof window === 'undefined') {
    return USERS.map((item, idx) => normalizeUser(item, idx))
  }
  const saved = safeParse(readStorage(STORAGE_KEY))
  if (saved && saved.length) return saved
  const seeded = USERS.map((item, idx) => normalizeUser(item, idx))
  writeStorage(STORAGE_KEY, seeded)
  return seeded
}

export function saveUsers(users) {
  if (typeof window === 'undefined') return
  writeStorage(STORAGE_KEY, users.map((item, idx) => normalizeUser(item, idx)))
}

export function getRoleStyle(role) {
  return ROLE_STYLE[role] || { bg: '#f1f5f9', color: '#334155', icon: 'USR' }
}

export const USER_ROLES = ['admin', 'bendahara', 'anggota']
export const USER_STATUS = ['Aktif', 'Nonaktif']
