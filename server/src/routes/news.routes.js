import { Router } from 'express'
import store from '../store/index.js'
import { sanitizeNews } from '../lib/normalize.js'
import { asyncHandler, httpError } from '../middleware/errors.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  res.json(await store.listNews())
}))

router.get('/:id', asyncHandler(async (req, res, next) => {
  const item = await store.getNews(req.params.id)
  if (!item) return next(httpError(404, 'Berita tidak ditemukan.'))
  res.json(item)
}))

router.post('/', asyncHandler(async (req, res, next) => {
  const data = sanitizeNews(req.body)
  if (!data.title) return next(httpError(400, 'Judul berita wajib diisi.'))
  res.status(201).json(await store.createNews(data))
}))

router.put('/:id', asyncHandler(async (req, res, next) => {
  const existing = await store.getNews(req.params.id)
  if (!existing) return next(httpError(404, 'Berita tidak ditemukan.'))
  const data = sanitizeNews({ ...existing, ...req.body })
  res.json(await store.updateNews(req.params.id, data))
}))

router.delete('/:id', asyncHandler(async (req, res, next) => {
  const ok = await store.deleteNews(req.params.id)
  if (!ok) return next(httpError(404, 'Berita tidak ditemukan.'))
  res.status(204).end()
}))

export default router
