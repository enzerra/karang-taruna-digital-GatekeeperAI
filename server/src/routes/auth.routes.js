import { Router } from 'express'
import store from '../store/index.js'
import { publicUser } from '../lib/normalize.js'
import { asyncHandler, httpError } from '../middleware/errors.js'

const router = Router()

// Membuat token sederhana (DEMO). Untuk produksi gunakan JWT yang ditandatangani.
function makeToken(user) {
  const payload = `${user.email}:${user.role}:${Date.now()}`
  return Buffer.from(payload).toString('base64url')
}

function formatLoginTime() {
  return new Date().toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// POST /api/auth/login  { email, password, role? }
router.post('/login', asyncHandler(async (req, res, next) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  if (!email || !password) {
    return next(httpError(400, 'Email dan password wajib diisi.'))
  }

  const user = await store.getUserByEmail(email)
  if (!user || (user.password && user.password !== password)) {
    return next(httpError(401, 'Email atau password salah.'))
  }
  if (user.status && user.status.toLowerCase() === 'nonaktif') {
    return next(httpError(403, 'Akun nonaktif. Hubungi admin.'))
  }

  const time = formatLoginTime()
  await store.touchLastLogin(user.id, time)

  res.json({ token: makeToken(user), user: publicUser({ ...user, lastLogin: time }) })
}))

export default router
