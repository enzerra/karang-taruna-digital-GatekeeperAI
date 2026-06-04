-- =====================================================================
--  Skema & data awal PostgreSQL untuk Digitalisasi Karang Taruna
--  Jalankan terhadap database "karang_taruna" (buat dulu lewat pgAdmin4).
--  Aman dijalankan berulang: tabel di-drop lalu dibuat ulang + di-seed.
-- =====================================================================

BEGIN;

DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS import_records CASCADE;
DROP TABLE IF EXISTS import_batches CASCADE;
DROP TABLE IF EXISTS finance_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS org_structure CASCADE;

-- --------------------------------------------------------------------- Berita
CREATE TABLE news (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'KEGIATAN',
  cat_color  TEXT NOT NULL DEFAULT '#1f2937',
  descr      TEXT NOT NULL DEFAULT '',
  date       TEXT NOT NULL DEFAULT '-',
  img        TEXT NOT NULL DEFAULT '',
  status     TEXT NOT NULL DEFAULT 'Published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------------------- Program
CREATE TABLE programs (
  id        SERIAL PRIMARY KEY,
  title     TEXT NOT NULL,
  category  TEXT NOT NULL DEFAULT 'Sosial',
  badge     TEXT NOT NULL DEFAULT 'AKTIF',
  period    TEXT NOT NULL DEFAULT '',
  descr     TEXT NOT NULL DEFAULT '',
  img       TEXT NOT NULL DEFAULT ''
);

-- ------------------------------------------------------------------- Pengguna
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  role       TEXT NOT NULL DEFAULT 'anggota',
  status     TEXT NOT NULL DEFAULT 'Aktif',
  last_login TEXT NOT NULL DEFAULT '-',
  -- CATATAN: untuk produksi simpan HASH (bcrypt), bukan password polos.
  password   TEXT
);

-- ------------------------------------------------------------- Kategori kas
CREATE TABLE finance_categories (
  id    SERIAL PRIMARY KEY,
  type  TEXT NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
  name  TEXT NOT NULL,
  UNIQUE (type, name)
);

-- ------------------------------------------------------------- Import batch
CREATE TABLE import_batches (
  id             SERIAL PRIMARY KEY,
  source_type    TEXT NOT NULL DEFAULT 'excel',
  file_name      TEXT NOT NULL,
  original_name  TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'draft',
  total_rows     INTEGER NOT NULL DEFAULT 0,
  valid_rows     INTEGER NOT NULL DEFAULT 0,
  invalid_rows   INTEGER NOT NULL DEFAULT 0,
  preview_ready  BOOLEAN NOT NULL DEFAULT FALSE,
  confirmed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_import_batches_status ON import_batches (status);

-- ---------------------------------------------------------- Import records
CREATE TABLE import_records (
  id                SERIAL PRIMARY KEY,
  batch_id          INTEGER NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  row_index         INTEGER NOT NULL,
  raw_data          JSONB NOT NULL DEFAULT '{}'::jsonb,
  normalized_data   JSONB NOT NULL DEFAULT '{}'::jsonb,
  validation_errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  status            TEXT NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (batch_id, row_index)
);

CREATE INDEX idx_import_records_batch_id ON import_records (batch_id);
CREATE INDEX idx_import_records_status ON import_records (status);

-- ------------------------------------------------------------- Transaksi kas
CREATE TABLE transactions (
  id        SERIAL PRIMARY KEY,
  date      TEXT NOT NULL,
  type      TEXT NOT NULL DEFAULT 'Pemasukan',
  descr     TEXT NOT NULL DEFAULT '',
  category  TEXT NOT NULL DEFAULT '',
  status    TEXT NOT NULL DEFAULT 'Lunas',
  -- amount disimpan BERTANDA: negatif untuk pengeluaran.
  amount                  BIGINT NOT NULL DEFAULT 0,
  
  -- Audit Trail OCR
  source                  TEXT NOT NULL DEFAULT 'manual',
  receipt_image           TEXT,
  validation_confidence   TEXT,
  items                   JSONB,
  ocr_raw_result          JSONB
);

-- ------------------------------------------------------ Struktur organisasi
-- Disimpan sebagai satu baris JSONB agar mudah dipetakan ke bentuk UI.
CREATE TABLE org_structure (
  id   INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  CONSTRAINT org_structure_singleton CHECK (id = 1)
);

-- =====================================================================
--  SEED
-- =====================================================================

INSERT INTO news (title, category, cat_color, descr, date, img, status) VALUES
  ('Kerja Bakti Lingkungan: Hijaukan Desa Kita', 'KEGIATAN', '#059669', 'Aksi nyata pemuda dalam menjaga kebersihan dan kelestarian lingkungan desa melalui penanaman pohon dan pembersihan saluran air bersama warga.', '15 Mar 2024', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80', 'Published'),
  ('Pelatihan Kewirausahaan Muda Digital', 'EKONOMI', '#2563eb', 'Membekali generasi muda dengan keahlian pemasaran digital untuk memajukan UMKM lokal dan membuka lapangan kerja baru di desa.', '12 Mar 2024', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', 'Published'),
  ('Turnamen Persahabatan Antar Dusun', 'OLAHRAGA', '#ea580c', 'Mempererat tali silaturahmi antar pemuda desa melalui kompetisi sepak bola tahunan yang penuh semangat dan sportivitas tinggi.', '10 Mar 2024', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', 'Published'),
  ('Beasiswa Karang Taruna untuk Siswa Berprestasi', 'PENDIDIKAN', '#7c3aed', 'Program beasiswa menyasar siswa SMA/SMK dari keluarga prasejahtera dengan capaian akademik unggul di lingkungan desa.', '8 Mar 2024', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80', 'Published');

INSERT INTO programs (title, category, badge, period, descr, img) VALUES
  ('Karang Taruna Mengajar', 'Pendidikan', 'AKTIF', 'Mei - Juli 2024', 'Program bimbingan belajar gratis untuk anak-anak sekolah dasar di lingkungan desa.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'),
  ('Turnamen Olahraga', 'Olahraga', 'MENDATANG', 'Juni 2024', 'Kompetisi rutin berbagai cabang olahraga untuk memfasilitasi bakat atlet muda desa.', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80'),
  ('Pemberdayaan UMKM', 'Ekonomi', 'AKTIF', 'Apr - Sep 2024', 'Pendampingan manajemen dan legalitas bagi pengusaha muda dalam mengembangkan produk lokal.', 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800&q=80'),
  ('Bakti Sosial Rutin', 'Sosial', 'AKTIF', 'Setiap Bulan', 'Penyaluran bantuan dan santunan bagi warga lanjut usia serta keluarga kurang mampu di desa.', 'https://images.unsplash.com/photo-1469571486292-b53601010b89?w=800&q=80'),
  ('Festival Seni Budaya', 'Budaya', 'MENDATANG', 'Agustus 2024', 'Perayaan kreativitas melalui pertunjukan musik, tari, dan pameran kerajinan tradisional.', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&q=80'),
  ('Youth Leadership', 'Kepemudaan', 'SELESAI', 'Feb 2024', 'Pelatihan kepemimpinan dan organisasi untuk mencetak kader pemimpin masa depan desa.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80');

INSERT INTO users (name, email, role, status, last_login, password) VALUES
  ('Admin Utama', 'admin@karangtaruna.id', 'admin', 'Aktif', '1 Mei 2024, 09:40', 'admin123'),
  ('Arif Hidayat', 'bendahara@karangtaruna.id', 'bendahara', 'Aktif', '1 Mei 2024, 08:15', 'bendahara123'),
  ('Nadia Putri', 'anggota@karangtaruna.id', 'anggota', 'Aktif', '30 Apr 2024, 20:10', 'anggota123');

INSERT INTO finance_categories (type, name) VALUES
  ('pemasukan', 'Kas bulanan'),
  ('pemasukan', 'Wifi'),
  ('pemasukan', 'Donasi'),
  ('pengeluaran', 'Konsumsi'),
  ('pengeluaran', 'Peralatan'),
  ('pengeluaran', 'Event');

INSERT INTO transactions (date, type, descr, category, status, amount) VALUES
  ('2024-04-30', 'Pemasukan',   'Iuran anggota bulanan',     'Kas bulanan', 'Lunas',  3250000),
  ('2024-04-29', 'Pengeluaran', 'Operasional sekretariat',   'Peralatan',   'Lunas',  -850000),
  ('2024-04-27', 'Pengeluaran', 'Dukungan kegiatan sosial',  'Event',       'Lunas', -1200000),
  ('2024-04-25', 'Pemasukan',   'Donasi mitra UMKM',         'Donasi',      'Lunas',  2000000),
  ('2024-04-20', 'Pemasukan',   'Hasil festival UMKM',       'Donasi',      'Lunas',  5500000),
  ('2024-04-18', 'Pengeluaran', 'Perlengkapan kegiatan',     'Peralatan',   'Lunas',  -750000);

INSERT INTO org_structure (id, data) VALUES (1, '{
  "ketua":      { "name": "Rizki Pratama", "role": "Ketua",       "desc": "Memimpin arah strategis organisasi dan sinergi lintas pemangku kepentingan." },
  "wakil":      { "name": "Dian Safitri",  "role": "Wakil Ketua", "desc": "Mendampingi ketua dan mengkoordinasikan kegiatan antar divisi." },
  "sekretaris": { "name": "Nadia Putri",   "role": "Sekretaris",  "desc": "Mengelola administrasi, dokumentasi kegiatan, dan komunikasi organisasi." },
  "bendahara":  { "name": "Arif Hidayat",  "role": "Bendahara",   "desc": "Bertanggung jawab atas pencatatan, pengelolaan, dan laporan keuangan." },
  "anggota": [
    { "name": "Salsa Maharani",   "role": "Koordinator Sosial",      "divisi": "Divisi Sosial" },
    { "name": "Yusuf Maulana",    "role": "Koordinator Lingkungan",  "divisi": "Divisi Lingkungan" },
    { "name": "Anita Wulandari",  "role": "Koordinator Pendidikan",  "divisi": "Divisi Pendidikan" },
    { "name": "Budi Santoso",     "role": "Koordinator Olahraga",    "divisi": "Divisi Olahraga" },
    { "name": "Rina Marlina",     "role": "Koordinator Seni",        "divisi": "Divisi Seni & Budaya" },
    { "name": "Hendra Gunawan",   "role": "Koordinator Ekonomi",     "divisi": "Divisi Ekonomi" }
  ]
}');

COMMIT;
