export const NEWS = [
  { id: 1, category: 'KEGIATAN', catColor: '#059669', title: 'Kerja Bakti Lingkungan: Hijaukan Desa Kita', desc: 'Aksi nyata pemuda dalam menjaga kebersihan dan kelestarian lingkungan desa melalui penanaman pohon dan pembersihan saluran air bersama warga.', date: '15 Mar 2024', img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80' },
  { id: 2, category: 'EKONOMI', catColor: '#2563eb', title: 'Pelatihan Kewirausahaan Muda Digital', desc: 'Membekali generasi muda dengan keahlian pemasaran digital untuk memajukan UMKM lokal dan membuka lapangan kerja baru di desa.', date: '12 Mar 2024', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80' },
  { id: 3, category: 'OLAHRAGA', catColor: '#ea580c', title: 'Turnamen Persahabatan Antar Dusun', desc: 'Mempererat tali silaturahmi antar pemuda desa melalui kompetisi sepak bola tahunan yang penuh semangat dan sportivitas tinggi.', date: '10 Mar 2024', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80' },
  { id: 4, category: 'PENDIDIKAN', catColor: '#7c3aed', title: 'Beasiswa Karang Taruna untuk Siswa Berprestasi', desc: 'Program beasiswa menyasar siswa SMA/SMK dari keluarga prasejahtera dengan capaian akademik unggul di lingkungan desa.', date: '8 Mar 2024', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80' },
]

export const PROGRAMS = [
  { id: 1, icon: 'education', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=160&q=80', title: 'Karang Taruna Mengajar', badge: 'AKTIF', badgeBg: '#d1fae5', badgeColor: '#065f46', desc: 'Program bimbingan belajar gratis untuk anak-anak sekolah dasar di lingkungan desa.', bg: '#eff6ff', iconBg: '#dbeafe', period: 'Mei - Juli 2024' },
  { id: 2, icon: 'sports', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=160&q=80', title: 'Turnamen Olahraga', badge: 'MENDATANG', badgeBg: '#fef3c7', badgeColor: '#92400e', desc: 'Kompetisi rutin berbagai cabang olahraga untuk memfasilitasi bakat atlet muda desa.', bg: '#f0fdf4', iconBg: '#dcfce7', period: 'Juni 2024' },
  { id: 3, icon: 'umkm', img: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=160&q=80', title: 'Pemberdayaan UMKM', badge: 'AKTIF', badgeBg: '#d1fae5', badgeColor: '#065f46', desc: 'Pendampingan manajemen dan legalitas bagi pengusaha muda dalam mengembangkan produk lokal.', bg: '#fff7ed', iconBg: '#ffedd5', period: 'Apr - Sep 2024' },
  { id: 4, icon: 'social', img: 'https://images.unsplash.com/photo-1469571486292-b53601010b89?w=160&q=80', title: 'Bakti Sosial Rutin', badge: 'AKTIF', badgeBg: '#d1fae5', badgeColor: '#065f46', desc: 'Penyaluran bantuan dan santunan bagi warga lanjut usia serta keluarga kurang mampu di desa.', bg: '#fff1f2', iconBg: '#ffe4e6', period: 'Setiap Bulan' },
  { id: 5, icon: 'culture', img: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=160&q=80', title: 'Festival Seni Budaya', badge: 'MENDATANG', badgeBg: '#fef3c7', badgeColor: '#92400e', desc: 'Perayaan kreativitas melalui pertunjukan musik, tari, dan pameran kerajinan tradisional.', bg: '#faf5ff', iconBg: '#ede9fe', period: 'Agustus 2024' },
  { id: 6, icon: 'leadership', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=160&q=80', title: 'Youth Leadership', badge: 'SELESAI', badgeBg: '#f1f5f9', badgeColor: '#475569', desc: 'Pelatihan kepemimpinan dan organisasi untuk mencetak kader pemimpin masa depan desa.', bg: '#eef2ff', iconBg: '#e0e7ff', period: 'Feb 2024' },
]

export const STRUCTURE = {
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
}

export const ADMIN_NEWS = [
  { id: 1, title: 'Kerja Bakti Lingkungan', category: 'Kegiatan', author: 'Admin', date: '15/03/2024', status: 'Published' },
  { id: 2, title: 'Pelatihan Kewirausahaan Muda Digital', category: 'Ekonomi', author: 'Admin', date: '12/03/2024', status: 'Published' },
  { id: 3, title: 'Turnamen Persahabatan Antar Dusun', category: 'Olahraga', author: 'Admin', date: '10/03/2024', status: 'Published' },
  { id: 4, title: 'Rencana Festival Budaya Pemuda Desa', category: 'Kegiatan', author: 'Admin', date: '08/03/2024', status: 'Draft' },
]

export const USERS = [
  { id: 1, name: 'Admin Utama', email: 'admin@karangtaruna.id', role: 'admin', status: 'Aktif', lastLogin: '1 Mei 2024, 09:40' },
  { id: 2, name: 'Arif Hidayat', email: 'bendahara@karangtaruna.id', role: 'bendahara', status: 'Aktif', lastLogin: '1 Mei 2024, 08:15' },
  { id: 3, name: 'Nadia Putri', email: 'anggota@karangtaruna.id', role: 'anggota', status: 'Aktif', lastLogin: '30 Apr 2024, 20:10' },
]

export const TRANSACTIONS = [
  { id: 1, date: '30 Apr 2024', type: 'Pemasukan', desc: 'Iuran anggota bulanan', amount: 3250000 },
  { id: 2, date: '29 Apr 2024', type: 'Pengeluaran', desc: 'Operasional sekretariat', amount: -850000 },
  { id: 3, date: '27 Apr 2024', type: 'Pengeluaran', desc: 'Dukungan kegiatan sosial', amount: -1200000 },
  { id: 4, date: '25 Apr 2024', type: 'Pemasukan', desc: 'Donasi mitra UMKM', amount: 2000000 },
  { id: 5, date: '20 Apr 2024', type: 'Pemasukan', desc: 'Hasil festival UMKM', amount: 5500000 },
  { id: 6, date: '18 Apr 2024', type: 'Pengeluaran', desc: 'Perlengkapan kegiatan', amount: -750000 },
]

export const CASH_TREND = [
  { month: 'Nov', income: 82, expense: 51 },
  { month: 'Des', income: 95, expense: 62 },
  { month: 'Jan', income: 78, expense: 49 },
  { month: 'Feb', income: 102, expense: 58 },
  { month: 'Mar', income: 115, expense: 61 },
  { month: 'Apr', income: 107, expense: 58 },
  { month: 'Mei', income: 121, expense: 64 },
]
