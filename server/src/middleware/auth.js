import { httpError } from './errors.js'
import store from '../store/index.js'

// Parses the simple base64url token from headers: Authorization: Bearer <token>
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    if (!authHeader.startsWith('Bearer ')) {
      throw httpError(401, 'Akses ditolak. Token tidak ditemukan.')
    }

    const token = authHeader.substring(7)
    const payloadBuffer = Buffer.from(token, 'base64url').toString('utf8')
    const [email, role, timestamp] = payloadBuffer.split(':')

    if (!email || !role) {
      throw httpError(401, 'Token tidak valid.')
    }

    // Check if token is expired (e.g. 24 hours) - naive demo check
    const ageMs = Date.now() - Number(timestamp)
    if (ageMs > 24 * 60 * 60 * 1000) {
      throw httpError(401, 'Token kedaluwarsa, silakan login ulang.')
    }

    const user = await store.getUserByEmail(email)
    if (!user || user.status?.toLowerCase() === 'nonaktif') {
      throw httpError(401, 'Pengguna tidak valid atau akun dinonaktifkan.')
    }

    if (user.role && String(user.role).toLowerCase() !== String(role).toLowerCase()) {
      throw httpError(401, 'Token tidak cocok dengan akun pengguna.')
    }

    // Attach user to request
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(httpError(401, 'Akses ditolak.'))
    const currentRole = String(req.user.role || '').toLowerCase()
    const normalizedAllowedRoles = allowedRoles.map((role) => String(role).toLowerCase())
    if (!normalizedAllowedRoles.includes(currentRole)) {
      return next(httpError(403, 'Anda tidak memiliki izin untuk rute ini.'))
    }
    next()
  }
}