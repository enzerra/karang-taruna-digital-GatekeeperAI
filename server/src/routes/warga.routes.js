import { Router } from 'express'
import { getWarga, bulkImportWarga } from '../controllers/warga.controller.js'
import { asyncHandler } from '../middleware/errors.js'

const router = Router()

router.get('/', asyncHandler(getWarga))
router.post('/bulk', asyncHandler(bulkImportWarga))

export default router
