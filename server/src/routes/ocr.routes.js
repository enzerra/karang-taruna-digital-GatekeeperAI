import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { uploadKwitansi } from '../controllers/ocr.controller.js'
import { asyncHandler } from '../middleware/errors.js'

const router = Router()

// Configure multer to use memory storage
const storage = multer.memoryStorage()

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Hanya file gambar yang diizinkan'))
    }
  }
})

router.post('/kwitansi', upload.single('file'), asyncHandler(uploadKwitansi))

export default router
