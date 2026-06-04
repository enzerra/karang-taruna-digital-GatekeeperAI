import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { httpError } from '../middleware/errors.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '../../data/db.json')

async function readDB() {
  const data = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
}

export async function getWarga(req, res, next) {
  try {
    const db = await readDB()
    res.json(db.warga || [])
  } catch (error) {
    next(error)
  }
}

export async function bulkImportWarga(req, res, next) {
  try {
    const { data } = req.body
    if (!Array.isArray(data)) {
      throw httpError(400, 'Format data tidak valid, harus berupa array')
    }

    const db = await readDB()
    const warga = db.warga || []
    
    // Generate IDs
    let maxId = warga.length > 0 ? Math.max(...warga.map(w => w.id)) : 0
    
    const newWarga = data.map(item => {
      maxId++
      return {
        id: maxId,
        ...item,
        created_at: new Date().toISOString()
      }
    })

    db.warga = [...warga, ...newWarga]
    await writeDB(db)

    res.json({
      status: 'success',
      message: `${newWarga.length} data warga berhasil diimpor`,
      imported: newWarga.length
    })
  } catch (error) {
    next(error)
  }
}
