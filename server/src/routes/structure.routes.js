import { Router } from 'express'
import store from '../store/index.js'
import { asyncHandler } from '../middleware/errors.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  res.json(await store.getStructure())
}))

// Memperbarui struktur organisasi (gabungkan dengan data yang ada).
router.put('/', asyncHandler(async (req, res) => {
  res.json(await store.updateStructure(req.body))
}))

export default router
