import { parseImportPreview, parseScanPreview } from '../services/importService.js'
import store from '../store/index.js'
import fs from 'fs'
import path from 'path'

function nowIso() {
  return new Date().toISOString()
}

export async function previewImport(req, res, next) {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: 'File .xlsx atau .csv wajib diunggah.' })
    }

    const originalName = String(file.originalname || '').toLowerCase()
    if (!originalName.endsWith('.xlsx') && !originalName.endsWith('.csv')) {
      return res.status(400).json({ message: 'Hanya file .xlsx dan .csv yang didukung.' })
    }

    const preview = parseImportPreview(file)
    return res.json({
      message: 'Preview berhasil dibuat.',
      ...preview,
    })
  } catch (err) {
    return next(err)
  }
}

export async function commitImport(req, res, next) {
  try {
    console.log('commitImport called - body keys:', Object.keys(req.body || {}), 'uploadId:', req.body?.uploadId, 'previewRowsLen:', Array.isArray(req.body?.previewRows) ? req.body.previewRows.length : 0)
    const { fileName, sourceType, previewRows, uploadId, edits } = req.body || {}

    let rows = Array.isArray(previewRows) ? previewRows.slice() : undefined

    // If an uploadId was provided (or previewRows empty) assemble/parse the file on server to get previewRows
    if ((!Array.isArray(rows) || rows.length === 0) && uploadId) {
      const UPLOAD_DIR = path.resolve(process.cwd(), 'tmp', 'uploads')
      const tmpPath = path.join(UPLOAD_DIR, `${uploadId}.tmp`)
      if (!fs.existsSync(tmpPath)) return res.status(404).json({ message: 'Upload tidak ditemukan di server.' })
      const buffer = fs.readFileSync(tmpPath)
      const preview = parseImportPreview({ buffer, originalname: fileName || uploadId })
      rows = preview.previewRows || []
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'previewRows wajib dikirim untuk commit.' })
    }

    // Apply edits (if any) over parsed rows. Edits should contain rowIndex and fields to override.
    if (Array.isArray(edits) && edits.length) {
      const editMap = new Map(edits.map((e) => [Number(e.rowIndex), e]))
      rows = rows.map((r) => {
        const idx = Number(r.rowIndex)
        if (editMap.has(idx)) {
          return { ...r, ...editMap.get(idx) }
        }
        return r
      })
    }

    const totalRows = rows.length
    const validRows = rows.filter((r) => !(r.issues && r.issues.length)).length
    const invalidRows = totalRows - validRows

    // Create import batch (status confirmed)
    const batch = await store.createImportBatch({
      sourceType: sourceType || 'excel',
      fileName: fileName || 'uploaded',
      originalName: fileName || '',
      status: 'confirmed',
      totalRows,
      validRows,
      invalidRows,
      previewReady: true,
      confirmedAt: nowIso(),
    })

    let created = 0
    let skipped = 0

    const recordsToCreate = []
    for (const row of rows) {
      recordsToCreate.push({
        batchId: batch.id,
        rowIndex: row.rowIndex || 0,
        rawData: row.raw || {},
        normalizedData: {
          date: row.date,
          type: row.type,
          desc: row.desc,
          category: row.category,
          status: row.status,
          amount: row.amount,
        },
        validationErrors: row.issues || [],
        status: (row.issues && row.issues.length) ? 'error' : 'ok',
      })
    }

    if (store.createImportRecords) {
      const createdRecords = await store.createImportRecords(recordsToCreate)
      const txToCreate = []
      for (const rec of createdRecords) {
        if (!rec.validationErrors || rec.validationErrors.length === 0) {
          txToCreate.push(rec.normalizedData)
        } else {
          skipped += 1
        }
      }
      if (txToCreate.length) {
        await store.createTransactions(txToCreate)
      }
      created = txToCreate.length
    } else {
      for (const recData of recordsToCreate) {
        const rec = await store.createImportRecord(recData)
        if (!rec.validationErrors || rec.validationErrors.length === 0) {
          await store.createTransaction(rec.normalizedData)
          created += 1
        } else {
          skipped += 1
        }
      }
    }

    const updated = await store.updateImportBatch(batch.id, { status: 'confirmed', confirmedAt: nowIso() })

    return res.json({ message: 'Import dikonfirmasi.', batch: updated, created, skipped })
  } catch (err) {
    return next(err)
  }
}

export async function scanBukuKas(req, res, next) {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: 'File gambar wajib diunggah.' })
    }

    const { Blob } = await import('buffer');
    const blob = new Blob([file.buffer], { type: file.mimetype });
    const form = new FormData();
    form.append('file', blob, file.originalname);

    const GATEKEEPER_URL = process.env.GATEKEEPER_URL || 'http://127.0.0.1:8000';
    const response = await fetch(`${GATEKEEPER_URL}/scan-halaman`, {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AI Gatekeeper error (${response.status}): ${text}`);
    }

    const responseData = await response.json();
    if (!responseData || !responseData.data) {
      throw new Error('Format balasan dari AI tidak dikenali.');
    }

    const jsonArray = responseData.data;
    const preview = parseScanPreview(jsonArray, file.originalname);
    
    return res.json({
      message: responseData.message || 'Scan AI berhasil dibuat.',
      ...preview,
    });
  } catch (err) {
    console.error('FastAPI Proxy Error:', err.message);
    return res.status(500).json({ message: 'Gagal menghubungi AI Gatekeeper: ' + err.message });
  }
}