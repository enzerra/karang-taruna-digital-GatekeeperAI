import { Router } from 'express'
import store from '../store/index.js'
import { publicUser, sanitizeUser } from '../lib/normalize.js'
import { asyncHandler, httpError } from '../middleware/errors.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const users = await store.listUsers()
  res.json(users.map(publicUser))
}))

router.get('/:id', asyncHandler(async (req, res, next) => {
  const item = await store.getUser(req.params.id)
  if (!item) return next(httpError(404, 'Pengguna tidak ditemukan.'))
  res.json(publicUser(item))
}))

router.post('/', asyncHandler(async (req, res, next) => {
  const data = sanitizeUser(req.body)
  if (!data.name || !data.email) return next(httpError(400, 'Nama dan email wajib diisi.'))
  if (await store.getUserByEmail(data.email)) {
    return next(httpError(409, 'Email sudah terdaftar.'))
  }
  const item = await store.createUser(data, req.body.password)
  res.status(201).json(publicUser(item))
}))

router.put('/:id', asyncHandler(async (req, res, next) => {
  const existing = await store.getUser(req.params.id)
  if (!existing) return next(httpError(404, 'Pengguna tidak ditemukan.'))
  const data = sanitizeUser({ ...existing, ...req.body })
  const item = await store.updateUser(req.params.id, data, req.body.password)
  res.json(publicUser(item))
}))

router.delete('/:id', asyncHandler(async (req, res, next) => {
  const ok = await store.deleteUser(req.params.id)
  if (!ok) return next(httpError(404, 'Pengguna tidak ditemukan.'))
  res.status(204).end()
}))

export default router
