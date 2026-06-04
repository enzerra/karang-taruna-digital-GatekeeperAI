// Penyimpanan data sederhana berbasis file JSON.
// Seluruh data dimuat ke memori saat startup, lalu ditulis ulang ke file
// setiap kali ada perubahan. Saat database asli siap, cukup ganti modul ini.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedData } from '../seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', '..', 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

let db = null

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function persist() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8')
}

// Memuat db.json ke memori. Jika belum ada, dibuat dari seed.
export function loadDb() {
  if (db) return db

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
    } catch {
      // File rusak -> bangun ulang dari seed.
      db = clone(seedData)
      persist()
    }
  } else {
    db = clone(seedData)
    persist()
  }

  return db
}

// Mengembalikan koleksi tertentu (referensi langsung ke memori).
export function getCollection(name) {
  const data = loadDb()
  if (data[name] === undefined) {
    // ensure collections always exist to avoid reducer/undefined errors
    data[name] = []
    persist()
  }
  return data[name]
}

// Mengganti isi sebuah koleksi lalu menyimpan ke file.
export function setCollection(name, value) {
  const data = loadDb()
  data[name] = value
  persist()
  return data[name]
}

// Menyimpan seluruh state saat ini ke file (dipakai setelah mutasi in-place).
export function saveDb() {
  persist()
  return db
}

// Membangun ulang database dari seed (berguna untuk reset/testing).
export function resetDb() {
  db = clone(seedData)
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  persist()
  return db
}

// ID numerik berikutnya untuk sebuah koleksi array.
export function nextId(collection) {
  return collection.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}
