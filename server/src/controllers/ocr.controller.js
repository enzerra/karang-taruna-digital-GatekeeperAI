import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import FormData from 'form-data'
import fetch from 'node-fetch'
import { httpError } from '../middleware/errors.js'
import { DB_DRIVER } from '../store/index.js'
import { supabase } from '../store/supabaseStore.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// FastAPI Gatekeeper URL
const GATEKEEPER_URL = process.env.GATEKEEPER_URL || 'http://127.0.0.1:8000'

export async function uploadKwitansi(req, res, next) {
  if (!req.file) {
    return next(httpError(400, 'Tidak ada file gambar yang diunggah.'))
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const ext = path.extname(req.file.originalname) || '.jpg'
  const receiptFileName = 'receipt_' + uniqueSuffix + ext

  try {
    // Forward buffer to FastAPI
    const formData = new FormData()
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    })

    const response = await fetch(`${GATEKEEPER_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gatekeeper error: ${response.status} - ${errorText}`)
    }

    const aiResult = await response.json()

    // If the image is not a receipt (classified as Bukan_Bukti by Gatekeeper)
    if (aiResult.klasifikasi === 'Bukan_Bukti') {
      return res.status(400).json({
        message: 'Gambar ditolak oleh AI Satpam. Bukan kwitansi/struk valid.',
        detail: aiResult
      })
    }

    // Success! Save the file based on driver
    let finalUrl = receiptFileName
    if (DB_DRIVER === 'supabase') {
      const { error } = await supabase.storage
        .from('receipts')
        .upload(receiptFileName, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        throw new Error(`Gagal upload ke Supabase Storage: ${error.message}`)
      }
      
      const { data } = supabase.storage.from('receipts').getPublicUrl(receiptFileName)
      finalUrl = data.publicUrl
    } else {
      const savePath = path.join(process.cwd(), 'public', 'receipts', receiptFileName)
      fs.writeFileSync(savePath, req.file.buffer)
    }

    // Return the AI extraction data AND the filename/URL so frontend can display/save it
    return res.status(200).json({
      message: 'Berhasil mengekstrak kwitansi',
      receipt_image: finalUrl,
      validation_confidence: aiResult.confidence,
      ocr_raw_result: aiResult.data_ekstraksi
    })

  } catch (error) {
    console.error('Error forwarding to Gatekeeper:', error)
    return next(httpError(500, `Gagal memproses AI OCR: ${error.message}`))
  }
}
