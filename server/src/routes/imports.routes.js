import express, { Router } from 'express'
import multer from 'multer'
import { previewImport, commitImport, scanBukuKas } from '../controllers/import.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// Configurable maximums (bytes)
const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES) || 25 * 1024 * 1024 // 25 MB default
// Allow larger JSON payloads for commit by default (increase to 200mb)
const MAX_JSON_BODY = process.env.MAX_JSON_BODY || '200mb'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_UPLOAD_BYTES } })

// Gate the endpoints
router.use(requireAuth)
router.use(requireRole(['admin', 'bendahara']))

// Preview accepts file uploads (multer will enforce file size)
router.post('/preview', upload.single('file'), previewImport)

// Scan AI Buku Kas endpoint
router.post('/scan-buku-kas', upload.single('file'), scanBukuKas)

// Commit receives a JSON body; allow larger JSON payloads for big batches
router.post('/commit', express.json({ limit: MAX_JSON_BODY }), async (req, res, next) => {
	try {
		return commitImport(req, res, next)
	} catch (err) {
		return next(err)
	}
})

export default router