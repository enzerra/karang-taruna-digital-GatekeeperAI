// Implementasi store berbasis PostgreSQL (node-pg).
// Dipakai saat DB_DRIVER=postgres.
//
// Kolom DB memakai snake_case, namun di-alias pada SELECT agar bentuk JSON
// yang dikirim ke frontend identik dengan mode json (mis. cat_color -> "catColor",
// descr -> "desc"). Dengan begitu UI tidak perlu diubah.

import { query } from '../lib/pool.js'

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
  return rows.map(mapTx)
}
export async function createTransaction(d) {
  const { rows } = await query(
    `INSERT INTO transactions (date, type, descr, category, status, amount)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${TX_COLS}`,
    [d.date, d.type, d.desc, d.category, d.status, d.amount],
  )
  return mapTx(rows[0])
}
export async function updateTransaction(id, d) {
  const { rows } = await query(
    `UPDATE transactions SET date=$1, type=$2, descr=$3, category=$4, status=$5, amount=$6
     WHERE id=$7 RETURNING ${TX_COLS}`,
    [d.date, d.type, d.desc, d.category, d.status, d.amount, Number(id)],
  )
  return mapTx(rows[0] ?? null)
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
