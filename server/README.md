# SIKARTA - Backend API (Server & Database)

Ini adalah repositori **Backend API** untuk proyek SIKARTA. Server ini bertugas untuk memproses logika bisnis utama, mengatur keamanan, dan berkomunikasi dengan database.

## 🚀 Teknologi yang Digunakan
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Railway / Render

## ⚙️ Persyaratan Sistem
- Node.js (Minimal v20.0.0+)

## 🛠️ Cara Menjalankan di Komputer Lokal

1. **Masuk ke Folder Server**
   Pastikan Anda berada di direktori `server`.

2. **Install Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Buat salinan dari file `.env.example` dan ubah namanya menjadi `.env`.
   Isi konfigurasi Supabase Anda (Bisa didapat dari Dashboard Supabase -> Project Settings -> API):
   ```env
   PORT=4000
   DB_DRIVER=supabase
   SUPABASE_URL=https://<your-project-id>.supabase.co
   SUPABASE_SERVICE_KEY=your-supabase-service-role-key-here
   ```

4. **Jalankan Server**
   Untuk mode *development* (otomatis *restart* saat ada perubahan kode):
   ```bash
   npm run dev
   ```
   Untuk mode *production*:
   ```bash
   npm start
   ```
   Server akan berjalan di `http://localhost:4000`.

## 🗄️ Database Setup
Pastikan tabel `Anggota`, `Buku Kas`, dan `Kegiatan` sudah terbuat di Supabase sesuai dengan skema SQL proyek ini.
