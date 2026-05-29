import { Router } from 'express'
import store from '../store/index.js'
import { sanitizeProgram } from '../lib/normalize.js'
import { asyncHandler, httpError } from '../middleware/errors.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  res.json(await store.listPrograms())
}))

router.get('/:id', asyncHandler(async (req, res, next) => {
  const item = await store.getProgram(req.params.id)
  if (!item) return next(httpError(404, 'Program tidak ditemukan.'))
  res.json(item)
}))

router.post('/', asyncHandler(async (req, res, next) => {
  const data = sanitizeProgram(req.body)
  if (!data.title) return next(httpError(400, 'Judul program wajib diisi.'))
  res.status(201).json(await store.createProgram(data))
}))

router.put('/:id', asyncHandler(async (req, res, next) => {
  const existing = await store.getProgram(req.params.id)
  if (!existing) return next(httpError(404, 'Program tidak ditemukan.'))
  const data = sanitizeProgram({ ...existing, ...req.body })
  res.json(await store.updateProgram(req.params.id, data))
}))

router.delete('/:id', asyncHandler(async (req, res, next) => {
  const ok = await store.deleteProgram(req.params.id)
  if (!ok) return next(httpError(404, 'Program tidak ditemukan.'))
  res.status(204).end()
}))

export default router
