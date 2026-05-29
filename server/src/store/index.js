// Pemilih store berdasarkan env DB_DRIVER.
//   DB_DRIVER=postgres  -> PostgreSQL (node-pg)
//   selain itu          -> file JSON (default, tanpa perlu DB terpasang)
//
// Kedua implementasi punya antarmuka (nama fungsi) yang sama, sehingga routes
// tidak perlu tahu sumber datanya.

import * as jsonStore from './jsonStore.js'
import * as pgStore from './pgStore.js'

const driver = (process.env.DB_DRIVER || 'json').toLowerCase()
const usePostgres = driver === 'postgres' || driver === 'pg'

export const DB_DRIVER = usePostgres ? 'postgres' : 'json'

const store = usePostgres ? pgStore : jsonStore

export default store
