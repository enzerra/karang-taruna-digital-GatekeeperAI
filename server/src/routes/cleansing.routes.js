import { Router } from 'express'
import multer from 'multer'
import { uploadCleansingData } from '../controllers/cleansing.controller.js'
import { asyncHandler } from '../middleware/errors.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', upload.single('file'), asyncHandler(uploadCleansingData))

export default router
