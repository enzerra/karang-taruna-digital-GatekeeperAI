export const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tx-all', label: 'Semua Transaksi', group: 'Transaksi' },
  { id: 'tx-in', label: 'Pemasukan', group: 'Transaksi' },
  { id: 'tx-out', label: 'Pengeluaran', group: 'Transaksi' },
  { id: 'kategori', label: 'Kategori' },
  { id: 'laporan', label: 'Laporan' },
  { id: 'analisis', label: 'Analisis' },
  { id: 'pengaturan', label: 'Pengaturan' },
]

export const EMPTY_TX = {
  date: '',
  type: 'Pemasukan',
  desc: '',
  category: '',
  status: 'Lunas',
  amount: '',
}
