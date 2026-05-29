# Karang Taruna API (Express.js)

RESTful API untuk portal **Digitalisasi Karang Taruna**. Mendukung dua sumber
data yang dipilih lewat env `DB_DRIVER` — response API identik untuk keduanya:

| `DB_DRIVER` | Sumber data | Perlu DB terpasang? |
| ----------- | ----------- | ------------------- |
| `json` (default) | file `data/db.json` (di-seed dari `src/seed.js`) | tidak |
| `postgres`  | PostgreSQL via node-pg | ya |

> Beralih ke **PostgreSQL**? Ikuti panduan lengkap di
> [`docs/MIGRASI-POSTGRESQL.md`](docs/MIGRASI-POSTGRESQL.md).

## Menjalankan

```bash
cd server
npm install
cp .env.example .env   # atur PORT / CORS_ORIGIN / DB_DRIVER
npm run dev            # mode watch (auto-restart)
# atau
npm start
```

Server default: `http://localhost:4000`. Cek `GET /api/health` — field `driver`
menunjukkan sumber data yang aktif.

Reset data mode JSON: hapus file `data/db.json` lalu jalankan ulang server.

## Struktur

```
server/
  db/schema.sql           # skema + seed PostgreSQL (jalankan di pgAdmin4)
  docs/MIGRASI-POSTGRESQL.md
  src/
    index.js              # entry point (init store sesuai driver)
    app.js                # konfigurasi express + mount routes
    seed.js               # data awal (mode json)
    lib/
      db.js               # penyimpanan JSON (load/save, nextId)
      pool.js             # pool koneksi PostgreSQL (lazy)
      normalize.js        # sanitasi payload agar konsisten dengan UI
    store/
      index.js            # pemilih store berdasarkan DB_DRIVER
      jsonStore.js        # implementasi file JSON
      pgStore.js          # implementasi PostgreSQL
    middleware/errors.js  # 404, error handler, asyncHandler
    routes/               # auth, news, programs, users, finance, structure
  data/db.json            # dibuat saat runtime, mode json (gitignored)
```

## Endpoint

Base URL: `/api`

### Auth
| Method | Path          | Body                          | Keterangan |
| ------ | ------------- | ----------------------------- | ---------- |
| POST   | `/auth/login` | `{ email, password, role? }`  | Mengembalikan `{ token, user }` |

Akun seed (email / password):
- `admin@karangtaruna.id` / `admin123`
- `bendahara@karangtaruna.id` / `bendahara123`
- `anggota@karangtaruna.id` / `anggota123`

### Berita — `/news`
| Method | Path         | Keterangan        |
| ------ | ------------ | ----------------- |
| GET    | `/news`      | List semua berita |
| GET    | `/news/:id`  | Detail berita     |
| POST   | `/news`      | Tambah berita     |
| PUT    | `/news/:id`  | Ubah berita       |
| DELETE | `/news/:id`  | Hapus berita      |

Field: `id, title, category, catColor, desc, date, img, status`.

### Program — `/programs`
CRUD sama seperti berita. Field: `id, title, category, badge, period, desc, img`.

### Pengguna — `/users`
CRUD sama. Field (tanpa `password` di response): `id, name, email, role, status, lastLogin`.

### Keuangan — `/finance`
| Method | Path                      | Keterangan                          |
| ------ | ------------------------- | ----------------------------------- |
| GET    | `/finance/transactions`   | List transaksi                      |
| POST   | `/finance/transactions`   | Tambah transaksi                    |
| PUT    | `/finance/transactions/:id` | Ubah transaksi                    |
| DELETE | `/finance/transactions/:id` | Hapus transaksi                  |
| GET    | `/finance/categories`     | `{ pemasukan: [], pengeluaran: [] }`|
| POST   | `/finance/categories`     | Body `{ type, name }` → tambah      |
| DELETE | `/finance/categories`     | Body `{ type, name }` → hapus       |

Transaksi: `amount` disimpan **bertanda** (negatif untuk Pengeluaran).

### Struktur — `/structure`
| Method | Path         | Keterangan                |
| ------ | ------------ | ------------------------- |
| GET    | `/structure` | Struktur organisasi       |
| PUT    | `/structure` | Perbarui struktur (merge) |

## Catatan keamanan

Auth bersifat **demo**: token hanya base64, password disimpan apa adanya di JSON.
Untuk produksi, gunakan hashing (bcrypt) + JWT bertanda tangan dan jangan pernah
mengirim/menyimpan password polos.
