// Pemilih store berdasarkan env DB_DRIVER.
//   DB_DRIVER=postgres  -> PostgreSQL (node-pg)
//   selain itu          -> file JSON (default, tanpa perlu DB terpasang)
//
// Kedua implementasi punya antarmuka (nama fungsi) yang sama, sehingga routes
// tidak perlu tahu sumber datanya.

import * as jsonStore from './jsonStore.js'
import * as pgStore from './pgStore.js'
import * as supabaseStore from './supabaseStore.js'

const driver = (process.env.DB_DRIVER || 'json').toLowerCase()

export const DB_DRIVER = driver

let store
if (driver === 'supabase') {
  store = supabaseStore
} else if (driver === 'postgres' || driver === 'pg') {
  store = pgStore
} else {
  store = jsonStore
}

export default store
