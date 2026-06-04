import express from 'express'
import multer from 'multer'
import { startUpload, uploadChunk, finishUpload } from '../controllers/uploads.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: Number(process.env.CHUNK_SIZE_BYTES) || 5 * 1024 * 1024 } })

router.use(requireAuth)
router.use(requireRole(['admin', 'bendahara']))

router.post('/start', express.json(), startUpload)
router.post('/chunk', upload.single('chunk'), uploadChunk)
router.post('/finish', express.json(), finishUpload)

export default router
