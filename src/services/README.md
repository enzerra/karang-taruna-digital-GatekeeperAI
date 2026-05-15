# Services

Folder ini menjadi batas integrasi data aplikasi.

- `news`, `programs`, `users`, dan `finance` berisi fungsi CRUD yang dipakai halaman.
- `*Store.js` masih memakai `localStorage` dan data dari `src/mocks` sebagai fallback frontend.
- Saat backend siap, pertahankan nama fungsi service yang sudah dipakai UI, lalu ganti isi service dengan request ke API.
- `src/lib/apiClient.js` sudah disiapkan untuk memakai `VITE_API_BASE_URL`.
