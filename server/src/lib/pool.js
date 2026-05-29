// Pool koneksi PostgreSQL (node-pg).
// Dibuat lazy: koneksi pertama baru terjadi saat query pertama dipanggil,
// sehingga mode "json" tidak pernah menyentuh PostgreSQL.

import pg from 'pg'

const { Pool } = pg

let pool = null

export function getPool() {
  if (pool) return pool

  const connectionString = process.env.DATABASE_URL

  pool = connectionString
    ? new Pool({ connectionString })
    : new Pool({
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT || 5432),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '',
        database: process.env.PGDATABASE || 'karang_taruna',
      })

  return pool
}

export function query(text, params) {
  return getPool().query(text, params)
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
