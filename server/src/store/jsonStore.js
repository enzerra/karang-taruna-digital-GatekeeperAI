// Implementasi store berbasis file JSON (db.json).
// Dipakai saat DB_DRIVER != postgres. Semua fungsi async agar antarmukanya
// sama persis dengan pgStore.

import { getCollection, loadDb, nextId, saveDb, setCollection } from '../lib/db.js'
import { sanitizeTransaction } from '../lib/normalize.js'

export async function init() {
  loadDb()
}

/* ------------------------------- Berita ------------------------------ */
export async function listNews() {
  return [...getCollection('news')]
}
export async function getNews(id) {
  return getCollection('news').find((n) => n.id === Number(id)) ?? null
}
export async function createNews(data) {
  const news = getCollection('news')
  const item = { id: nextId(news), ...data }
  news.unshift(item)
  saveDb()
  return item
}
export async function updateNews(id, data) {
  const news = getCollection('news')
  const i = news.findIndex((n) => n.id === Number(id))
  if (i === -1) return null
  news[i] = { ...news[i], ...data, id: Number(id) }
  saveDb()
  return news[i]
}
export async function deleteNews(id) {
  const news = getCollection('news')
  const i = news.findIndex((n) => n.id === Number(id))
  if (i === -1) return false
  news.splice(i, 1)
  saveDb()
  return true
}

/* ------------------------------ Program ------------------------------ */
export async function listPrograms() {
  return [...getCollection('programs')]
}
export async function getProgram(id) {
  return getCollection('programs').find((p) => p.id === Number(id)) ?? null
}
export async function createProgram(data) {
  const programs = getCollection('programs')
  const item = { id: nextId(programs), ...data }
  programs.unshift(item)
  saveDb()
  return item
}
export async function updateProgram(id, data) {
  const programs = getCollection('programs')
  const i = programs.findIndex((p) => p.id === Number(id))
  if (i === -1) return null
  programs[i] = { ...programs[i], ...data, id: Number(id) }
  saveDb()
  return programs[i]
}
export async function deleteProgram(id) {
  const programs = getCollection('programs')
  const i = programs.findIndex((p) => p.id === Number(id))
  if (i === -1) return false
  programs.splice(i, 1)
  saveDb()
  return true
}

/* ------------------------------ Pengguna ----------------------------- */
export async function listUsers() {
  return [...getCollection('users')]
}
export async function getUser(id) {
  return getCollection('users').find((u) => u.id === Number(id)) ?? null
}
export async function getUserByEmail(email) {
  const target = String(email || '').trim().toLowerCase()
  return getCollection('users').find((u) => u.email === target) ?? null
}
export async function createUser(data, password) {
  const users = getCollection('users')
  const item = { id: nextId(users), ...data }
  if (password) item.password = String(password)
  users.unshift(item)
  saveDb()
  return item
}
export async function updateUser(id, data, password) {
  const users = getCollection('users')
  const i = users.findIndex((u) => u.id === Number(id))
  if (i === -1) return null
  const merged = { ...users[i], ...data, id: Number(id) }
  if (password) merged.password = String(password)
  users[i] = merged
  saveDb()
  return users[i]
}
export async function deleteUser(id) {
  const users = getCollection('users')
  const i = users.findIndex((u) => u.id === Number(id))
  if (i === -1) return false
  users.splice(i, 1)
  saveDb()
  return true
}
export async function touchLastLogin(id, time) {
  const user = await getUser(id)
  if (!user) return
  user.lastLogin = time
  saveDb()
}

/* ------------------------------ Keuangan ----------------------------- */
export async function listTransactions() {
  return getCollection('transactions').map((item) => ({ ...item, ...sanitizeTransaction(item), id: Number(item.id) }))
}
export async function createTransaction(data) {
  const tx = getCollection('transactions')
  const item = { id: nextId(tx), ...sanitizeTransaction(data) }
  tx.unshift(item)
  saveDb()
  return item
}
export async function createTransactions(transactions) {
  const tx = getCollection('transactions')
  let maxId = nextId(tx) - 1
  const newItems = transactions.map(data => ({ id: ++maxId, ...sanitizeTransaction(data) }))
  tx.unshift(...newItems)
  saveDb()
  return newItems
}
export async function updateTransaction(id, data) {
  const tx = getCollection('transactions')
  const i = tx.findIndex((t) => t.id === Number(id))
  if (i === -1) return null
  tx[i] = { ...tx[i], ...sanitizeTransaction(data), id: Number(id) }
  saveDb()
  return tx[i]
}
export async function deleteTransaction(id) {
  const tx = getCollection('transactions')
  const i = tx.findIndex((t) => t.id === Number(id))
  if (i === -1) return false
  tx.splice(i, 1)
  saveDb()
  return true
}

export async function getCategories() {
  return getCollection('categories')
}
export async function addCategory(type, name) {
  const categories = getCollection('categories')
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  categories[key] = Array.from(new Set([...(categories[key] || []), name]))
  saveDb()
  return categories
}
export async function removeCategory(type, name) {
  const categories = getCollection('categories')
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  categories[key] = (categories[key] || []).filter((item) => item !== name)
  saveDb()
  return categories
}

/* --------------------------- Import Batch ---------------------------- */
function normalizeImportBatch(item) {
  return {
    id: Number(item.id),
    sourceType: String(item.sourceType || 'excel'),
    fileName: String(item.fileName || '').trim(),
    originalName: String(item.originalName || '').trim(),
    status: String(item.status || 'draft'),
    totalRows: Number(item.totalRows) || 0,
    validRows: Number(item.validRows) || 0,
    invalidRows: Number(item.invalidRows) || 0,
    previewReady: Boolean(item.previewReady),
    confirmedAt: item.confirmedAt || null,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }
}

function normalizeImportRecord(item) {
  return {
    id: Number(item.id),
    batchId: Number(item.batchId),
    rowIndex: Number(item.rowIndex) || 0,
    rawData: item.rawData || {},
    normalizedData: item.normalizedData || {},
    validationErrors: Array.isArray(item.validationErrors) ? item.validationErrors : [],
    status: String(item.status || 'pending'),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }
}

export async function listImportBatches() {
  return [...getCollection('importBatches')].map(normalizeImportBatch)
}

export async function getImportBatch(id) {
  return getCollection('importBatches').find((batch) => batch.id === Number(id)) ?? null
}

export async function createImportBatch(data) {
  const batches = getCollection('importBatches')
  const now = new Date().toISOString()
  const item = normalizeImportBatch({
    id: nextId(batches),
    sourceType: data.sourceType,
    fileName: data.fileName,
    originalName: data.originalName,
    status: data.status,
    totalRows: data.totalRows,
    validRows: data.validRows,
    invalidRows: data.invalidRows,
    previewReady: data.previewReady,
    confirmedAt: data.confirmedAt,
    createdAt: now,
    updatedAt: now,
  })
  batches.unshift(item)
  saveDb()
  return item
}

export async function updateImportBatch(id, patch) {
  const batches = getCollection('importBatches')
  const index = batches.findIndex((batch) => batch.id === Number(id))
  if (index === -1) return null
  const merged = normalizeImportBatch({ ...batches[index], ...patch, id: Number(id), updatedAt: new Date().toISOString() })
  batches[index] = merged
  saveDb()
  return merged
}

export async function deleteImportBatch(id) {
  const batches = getCollection('importBatches')
  const index = batches.findIndex((batch) => batch.id === Number(id))
  if (index === -1) return false
  batches.splice(index, 1)
  const records = getCollection('importRecords').filter((record) => record.batchId !== Number(id))
  setCollection('importRecords', records)
  saveDb()
  return true
}

export async function listImportRecords(batchId) {
  return getCollection('importRecords')
    .filter((record) => record.batchId === Number(batchId))
    .map(normalizeImportRecord)
}

export async function createImportRecord(data) {
  const records = getCollection('importRecords')
  const now = new Date().toISOString()
  const item = normalizeImportRecord({
    id: nextId(records),
    batchId: data.batchId,
    rowIndex: data.rowIndex,
    rawData: data.rawData,
    normalizedData: data.normalizedData,
    validationErrors: data.validationErrors,
    status: data.status,
    createdAt: now,
    updatedAt: now,
  })
  records.push(item)
  saveDb()
  return item
}
export async function createImportRecords(recordsArray) {
  const records = getCollection('importRecords')
  const now = new Date().toISOString()
  let maxId = nextId(records) - 1
  const newItems = recordsArray.map(data => normalizeImportRecord({
    id: ++maxId,
    batchId: data.batchId,
    rowIndex: data.rowIndex,
    rawData: data.rawData,
    normalizedData: data.normalizedData,
    validationErrors: data.validationErrors,
    status: data.status,
    createdAt: now,
    updatedAt: now,
  }))
  records.push(...newItems)
  saveDb()
  return newItems
}

export async function updateImportRecord(id, patch) {
  const records = getCollection('importRecords')
  const index = records.findIndex((record) => record.id === Number(id))
  if (index === -1) return null
  const merged = normalizeImportRecord({ ...records[index], ...patch, id: Number(id), updatedAt: new Date().toISOString() })
  records[index] = merged
  saveDb()
  return merged
}

export async function deleteImportRecord(id) {
  const records = getCollection('importRecords')
  const index = records.findIndex((record) => record.id === Number(id))
  if (index === -1) return false
  records.splice(index, 1)
  saveDb()
  return true
}

/* ----------------------------- Struktur ------------------------------ */
export async function getStructure() {
  return getCollection('structure')
}
export async function updateStructure(patch) {
  const current = getCollection('structure')
  return setCollection('structure', { ...current, ...patch })
}
