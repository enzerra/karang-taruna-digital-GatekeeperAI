import fs from 'fs'
import path from 'path'
import { parseImportPreview } from '../services/importService.js'

const UPLOAD_DIR = path.resolve(process.cwd(), 'tmp', 'uploads')

function ensureUploadDir() {
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  } catch (err) {
    // ignore
  }
}

export async function startUpload(req, res, next) {
  try {
    ensureUploadDir()
    const { filename, totalSize } = req.body || {}
    if (!filename) return res.status(400).json({ message: 'filename wajib dikirim.' })

    const { randomUUID } = await import('crypto')
    const uploadId = randomUUID()
    const tmpPath = path.join(UPLOAD_DIR, `${uploadId}.tmp`)

    // preallocate file to totalSize if provided
    if (totalSize && Number(totalSize) > 0) {
      const size = Number(totalSize)
      const fd = fs.openSync(tmpPath, 'w')
      try {
        fs.ftruncateSync(fd, size)
      } finally {
        fs.closeSync(fd)
      }
    } else {
      // create empty file
      fs.closeSync(fs.openSync(tmpPath, 'w'))
    }

    return res.json({ uploadId, chunkSize: Number(process.env.CHUNK_SIZE_BYTES) || 5 * 1024 * 1024 })
  } catch (err) {
    next(err)
  }
}

export async function uploadChunk(req, res, next) {
  try {
    const file = req.file
    const { uploadId, index } = req.body || {}
    if (!uploadId || typeof index === 'undefined' || !file) {
      return res.status(400).json({ message: 'uploadId, index, dan chunk wajib dikirim.' })
    }

    ensureUploadDir()
    const tmpPath = path.join(UPLOAD_DIR, `${uploadId}.tmp`)
    const chunkIndex = Number(index)
    const chunkSize = Number(process.env.CHUNK_SIZE_BYTES) || 5 * 1024 * 1024
    const offset = chunkIndex * chunkSize

    // write buffer at offset
    const handle = await fs.promises.open(tmpPath, 'r+')
    try {
      await handle.write(file.buffer, 0, file.buffer.length, offset)
    } finally {
      await handle.close()
    }

    return res.json({ ok: true, uploadedBytes: file.buffer.length })
  } catch (err) {
    next(err)
  }
}

export async function finishUpload(req, res, next) {
  try {
    const { uploadId, originalName, totalSize } = req.body || {}
    if (!uploadId) return res.status(400).json({ message: 'uploadId wajib dikirim.' })

    ensureUploadDir()
    const tmpPath = path.join(UPLOAD_DIR, `${uploadId}.tmp`)
    if (!fs.existsSync(tmpPath)) return res.status(404).json({ message: 'Upload tidak ditemukan.' })

    const stat = fs.statSync(tmpPath)
    if (totalSize && Number(totalSize) !== stat.size) {
      return res.status(400).json({ message: 'Ukuran file tidak sesuai.' })
    }

    const buffer = await fs.promises.readFile(tmpPath)

    // parse preview
    const preview = parseImportPreview({ buffer, originalname: originalName || uploadId })

    // Optionally keep assembled file for later (not removing here)
    return res.json({ uploadId, message: 'Preview berhasil dibuat (chunked).', ...preview })
  } catch (err) {
    next(err)
  }
}
