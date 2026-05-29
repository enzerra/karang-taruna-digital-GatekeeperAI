# Migrasi ke PostgreSQL (satu device)

Panduan menjalankan **frontend + backend + PostgreSQL di satu device yang sama**
(device ThinkPad yang sudah punya PostgreSQL & pgAdmin4). Tidak ada koneksi antar
jaringan — semua lewat `localhost`.

Backend mendukung dua sumber data lewat env `DB_DRIVER`:

| `DB_DRIVER` | Sumber data | Perlu PostgreSQL? |
| ----------- | ----------- | ----------------- |
| `json` (default) | `server/data/db.json` | tidak |
| `postgres`  | PostgreSQL (node-pg) | ya |

Mengganti driver **tidak** mengubah response API, jadi frontend tidak perlu disentuh.

---

## Bagian A — Siapkan database (pakai pgAdmin4)

### A1. Buat database

1. Buka **pgAdmin4**.
2. Klik kanan **Databases → Create → Database…**
3. Nama: `karang_taruna` → **Save**.

### A2. Jalankan schema + seed

1. Pilih database `karang_taruna`.
2. Buka **Query Tool** (menu Tools → Query Tool, atau ikon ⚡).
3. Buka file [`server/db/schema.sql`](../db/schema.sql) (Open File 📂) atau copy-paste isinya.
4. Tekan **▶ Execute** (F5).

   Script ini membuat semua tabel dan mengisi data awal. Aman dijalankan ulang
   (tabel di-drop dulu) — tapi ingat itu **menghapus data lama**.

5. Verifikasi: jalankan `SELECT * FROM news;` — harus muncul 4 baris.

> Karena semua di satu device, **tidak perlu** mengubah `postgresql.conf`,
> `pg_hba.conf`, atau firewall. Koneksi `localhost` sudah diizinkan secara default.

---

## Bagian B — Jalankan aplikasi

### B1. Backend — buat file `.env`

Di folder `server/`, salin `.env.example` menjadi `.env`:

```powershell
cd server
Copy-Item .env.example .env
```

Edit `.env` — cukup aktifkan driver postgres dan isi password Anda:

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173

DB_DRIVER=postgres
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=admin123        
PGDATABASE=karang_taruna
```

> Jika password berisi karakter spesial (`@`, `:`, `/`), bentuk variabel terpisah
> di atas lebih aman daripada `DATABASE_URL` (tidak perlu URL-encode).

Lalu jalankan:

```powershell
npm install      # sekali saja, memasang paket "pg"
npm run dev
```

Log sukses:

```
API Karang Taruna (driver: postgres) berjalan di http://localhost:4000
```

Bila koneksi gagal, server berhenti dengan pesan jelas, contoh:
`[startup] Gagal terhubung ke PostgreSQL (localhost): ...`.

### B2. Frontend

Di folder root project, file `.env.local` sudah berisi
`VITE_API_BASE_URL=http://localhost:4000`, jadi tinggal:

```powershell
npm install
npm run dev
```

Buka `http://localhost:5173`. Semua halaman otomatis memakai data dari PostgreSQL.

### B3. Uji cepat

```powershell
# driver harus "postgres"
curl http://localhost:4000/api/health
curl http://localhost:4000/api/news
```

---

## Pemecahan masalah

| Gejala | Kemungkinan penyebab & solusi |
| ------ | ----------------------------- |
| `ECONNREFUSED localhost:5432` | Service PostgreSQL belum jalan. Buka **services.msc** → start `postgresql-x64-<versi>`. |
| `password authentication failed` | `PGPASSWORD` di `.env` salah. |
| `database "karang_taruna" does not exist` | Belum menjalankan langkah A1. |
| `role "postgres" does not exist` | `PGUSER` beda dengan user PostgreSQL Anda — sesuaikan. |
| Data muncul tapi `amount` jadi string | Sudah ditangani: `pgStore` meng-cast BIGINT → Number. |

## Kembali ke mode JSON

Set `DB_DRIVER=json` (atau hapus baris itu) di `.env`, lalu restart. Berguna untuk
mengembangkan tanpa menyalakan PostgreSQL.

## Catatan keamanan (sebelum produksi)

- Kolom `password` saat ini **polos**. Ganti dengan hash **bcrypt** dan
  sesuaikan pengecekan di [`auth.routes.js`](../src/routes/auth.routes.js).
- Token login masih base64 (demo) — ganti **JWT** bertanda tangan.
- Jangan commit file `.env`. Sudah masuk `.gitignore`.
