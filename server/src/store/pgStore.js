// Implementasi store berbasis PostgreSQL (node-pg).
// Dipakai saat DB_DRIVER=postgres.
//
// Kolom DB memakai snake_case, namun di-alias pada SELECT agar bentuk JSON
// yang dikirim ke frontend identik dengan mode json (mis. cat_color -> "catColor",
// descr -> "desc"). Dengan begitu UI tidak perlu diubah.

import { query } from '../lib/pool.js'
import { sanitizeTransaction } from '../lib/normalize.js'

export async function init() {
  // Verifikasi koneksi lebih awal supaya error jaringan/kredensial jelas saat start.
  try {
    await query('SELECT 1')
  } catch (err) {
    const host = process.env.DATABASE_URL || process.env.PGHOST || 'localhost'
    throw new Error(`Gagal terhubung ke PostgreSQL (${host}): ${err.message}`)
  }
}

/* ------------------------------- Berita ------------------------------ */
const NEWS_COLS = 'id, title, category, cat_color AS "catColor", descr AS "desc", date, img, status'

export async function listNews() {
  const { rows } = await query(`SELECT ${NEWS_COLS} FROM news ORDER BY id DESC`)
  return rows
}
export async function getNews(id) {
  const { rows } = await query(`SELECT ${NEWS_COLS} FROM news WHERE id = $1`, [Number(id)])
  return rows[0] ?? null
}
export async function createNews(d) {
  const { rows } = await query(
    `INSERT INTO news (title, category, cat_color, descr, date, img, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ${NEWS_COLS}`,
    [d.title, d.category, d.catColor, d.desc, d.date, d.img, d.status],
  )
  return rows[0]
}
export async function updateNews(id, d) {
  const { rows } = await query(
    `UPDATE news SET title=$1, category=$2, cat_color=$3, descr=$4, date=$5, img=$6, status=$7
     WHERE id=$8 RETURNING ${NEWS_COLS}`,
    [d.title, d.category, d.catColor, d.desc, d.date, d.img, d.status, Number(id)],
  )
  return rows[0] ?? null
}
export async function deleteNews(id) {
  const { rowCount } = await query('DELETE FROM news WHERE id = $1', [Number(id)])
  return rowCount > 0
}

/* ------------------------------ Program ------------------------------ */
const PROGRAM_COLS = 'id, title, category, badge, period, descr AS "desc", img'

export async function listPrograms() {
  const { rows } = await query(`SELECT ${PROGRAM_COLS} FROM programs ORDER BY id DESC`)
  return rows
}
export async function getProgram(id) {
  const { rows } = await query(`SELECT ${PROGRAM_COLS} FROM programs WHERE id = $1`, [Number(id)])
  return rows[0] ?? null
}
export async function createProgram(d) {
  const { rows } = await query(
    `INSERT INTO programs (title, category, badge, period, descr, img)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${PROGRAM_COLS}`,
    [d.title, d.category, d.badge, d.period, d.desc, d.img],
  )
  return rows[0]
}
export async function updateProgram(id, d) {
  const { rows } = await query(
    `UPDATE programs SET title=$1, category=$2, badge=$3, period=$4, descr=$5, img=$6
     WHERE id=$7 RETURNING ${PROGRAM_COLS}`,
    [d.title, d.category, d.badge, d.period, d.desc, d.img, Number(id)],
  )
  return rows[0] ?? null
}
export async function deleteProgram(id) {
  const { rowCount } = await query('DELETE FROM programs WHERE id = $1', [Number(id)])
  return rowCount > 0
}

/* ------------------------------ Pengguna ----------------------------- */
const USER_PUBLIC_COLS = 'id, name, email, role, status, last_login AS "lastLogin"'
const USER_AUTH_COLS = `${USER_PUBLIC_COLS}, password`

export async function listUsers() {
  const { rows } = await query(`SELECT ${USER_PUBLIC_COLS} FROM users ORDER BY id`)
  return rows
}
export async function getUser(id) {
  const { rows } = await query(`SELECT ${USER_PUBLIC_COLS} FROM users WHERE id = $1`, [Number(id)])
  return rows[0] ?? null
}
export async function getUserByEmail(email) {
  const { rows } = await query(`SELECT ${USER_AUTH_COLS} FROM users WHERE email = $1`, [
    String(email || '').trim().toLowerCase(),
  ])
  return rows[0] ?? null
}
export async function createUser(d, password) {
  const { rows } = await query(
    `INSERT INTO users (name, email, role, status, last_login, password)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${USER_PUBLIC_COLS}`,
    [d.name, d.email, d.role, d.status, d.lastLogin, password ? String(password) : null],
  )
  return rows[0]
}
export async function updateUser(id, d, password) {
  // COALESCE menjaga password lama bila tidak dikirim pada request update.
  const { rows } = await query(
    `UPDATE users SET name=$1, email=$2, role=$3, status=$4, last_login=$5,
       password = COALESCE($6, password)
     WHERE id=$7 RETURNING ${USER_PUBLIC_COLS}`,
    [d.name, d.email, d.role, d.status, d.lastLogin, password ? String(password) : null, Number(id)],
  )
  return rows[0] ?? null
}
export async function deleteUser(id) {
  const { rowCount } = await query('DELETE FROM users WHERE id = $1', [Number(id)])
  return rowCount > 0
}
export async function touchLastLogin(id, time) {
  await query('UPDATE users SET last_login = $1 WHERE id = $2', [time, Number(id)])
}

/* ------------------------------ Keuangan ----------------------------- */
const TX_COLS = 'id, date, type, descr AS "desc", category, status, amount'

// amount bertipe BIGINT -> node-pg mengembalikannya sebagai string. Ubah ke Number
// agar perhitungan di frontend (sum, perbandingan) tetap benar.
function mapTx(row) {
  return row ? { ...row, amount: Number(row.amount) } : row
}

export async function listTransactions() {
  const { rows } = await query(`SELECT ${TX_COLS} FROM transactions ORDER BY id DESC`)
  return rows.map((row) => ({ ...mapTx(row), ...sanitizeTransaction(row), id: Number(row.id) }))
}
export async function createTransaction(d) {
  const data = sanitizeTransaction(d)
  const { rows } = await query(
    `INSERT INTO transactions (date, type, descr, category, status, amount)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${TX_COLS}`,
    [data.date, data.type, data.desc, data.category, data.status, data.amount],
  )
  return { ...mapTx(rows[0]), ...sanitizeTransaction(rows[0]), id: Number(rows[0].id) }
}
export async function createTransactions(transactions) {
  if (!transactions || !transactions.length) return []
  // In pgStore, we will just use a loop wrapped in a single promise for simplicity
  // since pg is currently unused and we've shifted to supabase.
  const results = []
  for (const t of transactions) {
    results.push(await createTransaction(t))
  }
  return results
}
export async function updateTransaction(id, d) {
  const data = sanitizeTransaction(d)
  const { rows } = await query(
    `UPDATE transactions SET date=$1, type=$2, descr=$3, category=$4, status=$5, amount=$6
     WHERE id=$7 RETURNING ${TX_COLS}`,
    [data.date, data.type, data.desc, data.category, data.status, data.amount, Number(id)],
  )
  return rows[0] ? { ...mapTx(rows[0]), ...sanitizeTransaction(rows[0]), id: Number(rows[0].id) } : null
}
export async function deleteTransaction(id) {
  const { rowCount } = await query('DELETE FROM transactions WHERE id = $1', [Number(id)])
  return rowCount > 0
}

export async function getCategories() {
  const { rows } = await query('SELECT type, name FROM finance_categories ORDER BY id')
  const result = { pemasukan: [], pengeluaran: [] }
  for (const row of rows) {
    if (result[row.type]) result[row.type].push(row.name)
  }
  return result
}
export async function addCategory(type, name) {
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  await query(
    'INSERT INTO finance_categories (type, name) VALUES ($1, $2) ON CONFLICT (type, name) DO NOTHING',
    [key, name],
  )
  return getCategories()
}
export async function removeCategory(type, name) {
  const key = type === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'
  await query('DELETE FROM finance_categories WHERE type = $1 AND name = $2', [key, name])
  return getCategories()
}

/* --------------------------- Import Batch ---------------------------- */
const IMPORT_BATCH_COLS = `
  id,
  source_type AS "sourceType",
  file_name AS "fileName",
  original_name AS "originalName",
  status,
  total_rows AS "totalRows",
  valid_rows AS "validRows",
  invalid_rows AS "invalidRows",
  preview_ready AS "previewReady",
  confirmed_at AS "confirmedAt",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`

const IMPORT_RECORD_COLS = `
  id,
  batch_id AS "batchId",
  row_index AS "rowIndex",
  raw_data AS "rawData",
  normalized_data AS "normalizedData",
  validation_errors AS "validationErrors",
  status,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`

export async function listImportBatches() {
  const { rows } = await query(`SELECT ${IMPORT_BATCH_COLS} FROM import_batches ORDER BY id DESC`)
  return rows
}

export async function getImportBatch(id) {
  const { rows } = await query(`SELECT ${IMPORT_BATCH_COLS} FROM import_batches WHERE id = $1`, [Number(id)])
  return rows[0] ?? null
}

export async function createImportBatch(d) {
  const { rows } = await query(
    `INSERT INTO import_batches (
      source_type, file_name, original_name, status,
      total_rows, valid_rows, invalid_rows, preview_ready, confirmed_at, created_at, updated_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, now(), now()) RETURNING ${IMPORT_BATCH_COLS}`,
    [
      d.sourceType || 'excel',
      d.fileName,
      d.originalName,
      d.status || 'draft',
      Number(d.totalRows) || 0,
      Number(d.validRows) || 0,
      Number(d.invalidRows) || 0,
      Boolean(d.previewReady),
      d.confirmedAt ?? null,
    ],
  )
  return rows[0]
}

export async function updateImportBatch(id, d) {
  const { rows } = await query(
    `UPDATE import_batches SET
      source_type=$1,
      file_name=$2,
      original_name=$3,
      status=$4,
      total_rows=$5,
      valid_rows=$6,
      invalid_rows=$7,
      preview_ready=$8,
      confirmed_at=$9,
      updated_at=now()
     WHERE id=$10 RETURNING ${IMPORT_BATCH_COLS}`,
    [
      d.sourceType || 'excel',
      d.fileName,
      d.originalName,
      d.status || 'draft',
      Number(d.totalRows) || 0,
      Number(d.validRows) || 0,
      Number(d.invalidRows) || 0,
      Boolean(d.previewReady),
      d.confirmedAt ?? null,
      Number(id),
    ],
  )
  return rows[0] ?? null
}

export async function deleteImportBatch(id) {
  const { rowCount } = await query('DELETE FROM import_batches WHERE id = $1', [Number(id)])
  return rowCount > 0
}

export async function listImportRecords(batchId) {
  const { rows } = await query(`SELECT ${IMPORT_RECORD_COLS} FROM import_records WHERE batch_id = $1 ORDER BY row_index`, [Number(batchId)])
  return rows
}

export async function getImportRecord(id) {
  const { rows } = await query(`SELECT ${IMPORT_RECORD_COLS} FROM import_records WHERE id = $1`, [Number(id)])
  return rows[0] ?? null
}

export async function createImportRecord(d) {
  const { rows } = await query(
    `INSERT INTO import_records (
      batch_id, row_index, raw_data, normalized_data, validation_errors, status, created_at, updated_at
     ) VALUES ($1,$2,$3,$4,$5,$6, now(), now()) RETURNING ${IMPORT_RECORD_COLS}`,
    [
      Number(d.batchId),
      Number(d.rowIndex) || 0,
      d.rawData ?? {},
      d.normalizedData ?? {},
      Array.isArray(d.validationErrors) ? d.validationErrors : [],
      d.status || 'pending',
    ],
  )
  return rows[0]
}
export async function createImportRecords(records) {
  if (!records || !records.length) return []
  const results = []
  for (const r of records) {
    results.push(await createImportRecord(r))
  }
  return results
}

export async function updateImportRecord(id, d) {
  const { rows } = await query(
    `UPDATE import_records SET
      batch_id=$1,
      row_index=$2,
      raw_data=$3,
      normalized_data=$4,
      validation_errors=$5,
      status=$6,
      updated_at=now()
     WHERE id=$7 RETURNING ${IMPORT_RECORD_COLS}`,
    [
      Number(d.batchId),
      Number(d.rowIndex) || 0,
      d.rawData ?? {},
      d.normalizedData ?? {},
      Array.isArray(d.validationErrors) ? d.validationErrors : [],
      d.status || 'pending',
      Number(id),
    ],
  )
  return rows[0] ?? null
}

export async function deleteImportRecord(id) {
  const { rowCount } = await query('DELETE FROM import_records WHERE id = $1', [Number(id)])
  return rowCount > 0
}

/* ----------------------------- Struktur ------------------------------ */
export async function getStructure() {
  const { rows } = await query('SELECT data FROM org_structure WHERE id = 1')
  return rows[0]?.data ?? {}
}
export async function updateStructure(patch) {
  const current = await getStructure()
  const next = { ...current, ...patch }
  await query(
    `INSERT INTO org_structure (id, data) VALUES (1, $1)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
    [JSON.stringify(next)],
  )
  return next
}
