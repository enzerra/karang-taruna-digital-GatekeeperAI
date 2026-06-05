# SIKARTA - Frontend (Antarmuka Pengguna)

Ini adalah repositori **Frontend** untuk proyek SIKARTA (Sistem Informasi Karang Taruna). Dibangun menggunakan teknologi antarmuka web modern yang sangat cepat dan responsif.

## 🚀 Teknologi yang Digunakan
- **Framework:** React.js
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## ⚙️ Persyaratan Sistem
- Node.js (Minimal v18+)
- npm atau yarn

## 🛠️ Cara Menjalankan di Komputer Lokal

1. **Install Dependensi**
   Buka terminal di dalam folder ini dan jalankan:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment**
   Buat salinan dari file `.env.example` dan ubah namanya menjadi `.env.local` atau `.env`.
   Pastikan URL mengarah ke server backend Anda:
   ```env
   VITE_API_BASE_URL=http://localhost:4000
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara lokal, biasanya di `http://localhost:5173`.

## 📦 Build untuk Produksi
Untuk melakukan kompilasi file yang siap di-*deploy*:
```bash
npm run build
```
Folder `dist` akan terbuat dan siap untuk dipublikasikan ke layanan hosting statis (Vercel, Netlify, dll).
