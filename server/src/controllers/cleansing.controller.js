import { httpError } from '../middleware/errors.js'

export async function uploadCleansingData(req, res, next) {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: 'File wajib diunggah.' })
    }

    const { Blob } = await import('buffer')
    const blob = new Blob([file.buffer], { type: file.mimetype })
    const form = new FormData()
    form.append('file', blob, file.originalname)

    const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000'
    const response = await fetch(`${FASTAPI_URL}/auto-eda`, {
      method: 'POST',
      body: form
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`AI Gatekeeper error (${response.status}): ${text}`)
    }

    const responseData = await response.json()
    return res.json(responseData)
  } catch (err) {
    console.error('FastAPI Cleansing Error:', err.message)
    return next(httpError(500, 'Gagal menghubungi AI Gatekeeper: ' + err.message))
  }
}
