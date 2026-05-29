import 'dotenv/config'
import { createApp } from './app.js'
import store, { DB_DRIVER } from './store/index.js'

const PORT = process.env.PORT || 4000

// Inisialisasi store aktif:
//  - json     -> memastikan db.json siap (di-seed bila belum ada)
//  - postgres -> verifikasi koneksi ke database
try {
  await store.init()
} catch (err) {
  console.error(`[startup] ${err.message}`)
  process.exit(1)
}

const app = createApp()

app.listen(PORT, () => {
  console.log(`API Karang Taruna (driver: ${DB_DRIVER}) berjalan di http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})
