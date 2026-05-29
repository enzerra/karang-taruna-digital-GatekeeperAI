import { Router } from 'express'
import store from '../store/index.js'
import { sanitizeTransaction } from '../lib/normalize.js'
import { asyncHandler, httpError } from '../middleware/errors.js'

const router = Router()

/* ----------------------------- Transaksi ----------------------------- */

router.get('/transactions', asyncHandler(async (req, res) => {
  res.json(await store.listTransactions())
}))

router.post('/transactions', asyncHandler(async (req, res, next) => {
  const data = sanitizeTransaction(req.body)
  if (!data.desc || !data.category) {
    return next(httpError(400, 'Deskripsi dan kategori transaksi wajib diisi.'))
  }
  res.status(201).json(await store.createTransaction(data))
}))

router.put('/transactions/:id', asyncHandler(async (req, res, next) => {
  const list = await store.listTransactions()
  const existing = list.find((t) => t.id === Number(req.params.id))
  if (!existing) return next(httpError(404, 'Transaksi tidak ditemukan.'))
  const data = sanitizeTransaction({ ...existing, ...req.body })
  res.json(await store.updateTransaction(req.params.id, data))
}))

router.delete('/transactions/:id', asyncHandler(async (req, res, next) => {
  const ok = await store.deleteTransaction(req.params.id)
  if (!ok) return next(httpError(404, 'Transaksi tidak ditemukan.'))
  res.status(204).end()
}))

/* ----------------------------- Kategori ------------------------------ */

function resolveCategoryKey(type) {
  return type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
}

router.get('/categories', asyncHandler(async (req, res) => {
  res.json(await store.getCategories())
}))

router.post('/categories', asyncHandler(async (req, res, next) => {
  const key = resolveCategoryKey(req.body.type)
  const name = String(req.body.name || '').trim()
  if (!name) return next(httpError(400, 'Nama kategori wajib diisi.'))
  res.status(201).json(await store.addCategory(key, name))
}))

// Hapus kategori. Nama bisa dikirim lewat body atau query (?type=&name=).
router.delete('/categories', asyncHandler(async (req, res, next) => {
  const key = resolveCategoryKey(req.body.type || req.query.type)
  const name = String(req.body.name || req.query.name || '').trim()
  if (!name) return next(httpError(400, 'Nama kategori wajib diisi.'))
  res.json(await store.removeCategory(key, name))
}))

export default router
