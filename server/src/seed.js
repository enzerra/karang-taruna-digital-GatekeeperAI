// Data awal (seed) untuk db.json.
// Disalin dari src/mocks/portalData.js pada frontend agar bentuk data konsisten.

export const seedData = {
  news: [
    { id: 1, category: 'KEGIATAN', catColor: '#059669', title: 'Kerja Bakti Lingkungan: Hijaukan Desa Kita', desc: 'Aksi nyata pemuda dalam menjaga kebersihan dan kelestarian lingkungan desa melalui penanaman pohon dan pembersihan saluran air bersama warga.', date: '15 Mar 2024', img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80', status: 'Published' },
    { id: 2, category: 'EKONOMI', catColor: '#2563eb', title: 'Pelatihan Kewirausahaan Muda Digital', desc: 'Membekali generasi muda dengan keahlian pemasaran digital untuk memajukan UMKM lokal dan membuka lapangan kerja baru di desa.', date: '12 Mar 2024', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', status: 'Published' },
    { id: 3, category: 'OLAHRAGA', catColor: '#ea580c', title: 'Turnamen Persahabatan Antar Dusun', desc: 'Mempererat tali silaturahmi antar pemuda desa melalui kompetisi sepak bola tahunan yang penuh semangat dan sportivitas tinggi.', date: '10 Mar 2024', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', status: 'Published' },
    { id: 4, category: 'PENDIDIKAN', catColor: '#7c3aed', title: 'Beasiswa Karang Taruna untuk Siswa Berprestasi', desc: 'Program beasiswa menyasar siswa SMA/SMK dari keluarga prasejahtera dengan capaian akademik unggul di lingkungan desa.', date: '8 Mar 2024', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80', status: 'Published' },
  ],

  programs: [
    { id: 1, img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', title: 'Karang Taruna Mengajar', category: 'Pendidikan', badge: 'AKTIF', desc: 'Program bimbingan belajar gratis untuk anak-anak sekolah dasar di lingkungan desa.', period: 'Mei - Juli 2024' },
    { id: 2, img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', title: 'Turnamen Olahraga', category: 'Olahraga', badge: 'MENDATANG', desc: 'Kompetisi rutin berbagai cabang olahraga untuk memfasilitasi bakat atlet muda desa.', period: 'Juni 2024' },
    { id: 3, img: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800&q=80', title: 'Pemberdayaan UMKM', category: 'Ekonomi', badge: 'AKTIF', desc: 'Pendampingan manajemen dan legalitas bagi pengusaha muda dalam mengembangkan produk lokal.', period: 'Apr - Sep 2024' },
    { id: 4, img: 'https://images.unsplash.com/photo-1469571486292-b53601010b89?w=800&q=80', title: 'Bakti Sosial Rutin', category: 'Sosial', badge: 'AKTIF', desc: 'Penyaluran bantuan dan santunan bagi warga lanjut usia serta keluarga kurang mampu di desa.', period: 'Setiap Bulan' },
    { id: 5, img: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&q=80', title: 'Festival Seni Budaya', category: 'Budaya', badge: 'MENDATANG', desc: 'Perayaan kreativitas melalui pertunjukan musik, tari, dan pameran kerajinan tradisional.', period: 'Agustus 2024' },
    { id: 6, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', title: 'Youth Leadership', category: 'Kepemudaan', badge: 'SELESAI', desc: 'Pelatihan kepemimpinan dan organisasi untuk mencetak kader pemimpin masa depan desa.', period: 'Feb 2024' },
  ],

  users: [
    { id: 1, name: 'Admin Utama', email: 'admin@karangtaruna.id', role: 'admin', status: 'Aktif', lastLogin: '1 Mei 2024, 09:40', password: 'admin123' },
    { id: 2, name: 'Arif Hidayat', email: 'bendahara@karangtaruna.id', role: 'bendahara', status: 'Aktif', lastLogin: '1 Mei 2024, 08:15', password: 'bendahara123' },
    { id: 3, name: 'Nadia Putri', email: 'anggota@karangtaruna.id', role: 'anggota', status: 'Aktif', lastLogin: '30 Apr 2024, 20:10', password: 'anggota123' },
  ],

  transactions: [
    { id: 1, date: '2024-04-30', type: 'Pemasukan', desc: 'Iuran anggota bulanan', category: 'Kas bulanan', status: 'Lunas', amount: 3250000 },
    { id: 2, date: '2024-04-29', type: 'Pengeluaran', desc: 'Operasional sekretariat', category: 'Peralatan', status: 'Lunas', amount: -850000 },
    { id: 3, date: '2024-04-27', type: 'Pengeluaran', desc: 'Dukungan kegiatan sosial', category: 'Event', status: 'Lunas', amount: -1200000 },
    { id: 4, date: '2024-04-25', type: 'Pemasukan', desc: 'Donasi mitra UMKM', category: 'Donasi', status: 'Lunas', amount: 2000000 },
    { id: 5, date: '2024-04-20', type: 'Pemasukan', desc: 'Hasil festival UMKM', category: 'Donasi', status: 'Lunas', amount: 5500000 },
    { id: 6, date: '2024-04-18', type: 'Pengeluaran', desc: 'Perlengkapan kegiatan', category: 'Peralatan', status: 'Lunas', amount: -750000 },
  ],

  categories: {
    pemasukan: ['Kas bulanan', 'Wifi', 'Donasi'],
    pengeluaran: ['Konsumsi', 'Peralatan', 'Event'],
  },

  structure: {
    ketua: { name: 'Rizki Pratama', role: 'Ketua', desc: 'Memimpin arah strategis organisasi dan sinergi lintas pemangku kepentingan.' },
    wakil: { name: 'Dian Safitri', role: 'Wakil Ketua', desc: 'Mendampingi ketua dan mengkoordinasikan kegiatan antar divisi.' },
    sekretaris: { name: 'Nadia Putri', role: 'Sekretaris', desc: 'Mengelola administrasi, dokumentasi kegiatan, dan komunikasi organisasi.' },
    bendahara: { name: 'Arif Hidayat', role: 'Bendahara', desc: 'Bertanggung jawab atas pencatatan, pengelolaan, dan laporan keuangan.' },
    anggota: [
      { name: 'Salsa Maharani', role: 'Koordinator Sosial', divisi: 'Divisi Sosial' },
      { name: 'Yusuf Maulana', role: 'Koordinator Lingkungan', divisi: 'Divisi Lingkungan' },
      { name: 'Anita Wulandari', role: 'Koordinator Pendidikan', divisi: 'Divisi Pendidikan' },
      { name: 'Budi Santoso', role: 'Koordinator Olahraga', divisi: 'Divisi Olahraga' },
      { name: 'Rina Marlina', role: 'Koordinator Seni', divisi: 'Divisi Seni & Budaya' },
      { name: 'Hendra Gunawan', role: 'Koordinator Ekonomi', divisi: 'Divisi Ekonomi' },
    ],
  },
}
