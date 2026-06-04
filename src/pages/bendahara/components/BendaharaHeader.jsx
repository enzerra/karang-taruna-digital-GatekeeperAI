export default function BendaharaHeader({ active, search, setSearch }) {
  const title = active === 'dashboard' ? 'Dashboard Keuangan' :
    active === 'import-excel' ? 'Impor Excel Transaksi' :
    active === 'import-data' ? 'Impor Data Pintar' :
    active.startsWith('tx-') ? 'Manajemen Transaksi' :
    active === 'kategori' ? 'Manajemen Kategori' :
    active === 'laporan' ? 'Laporan Keuangan' :
    active === 'analisis' ? 'Analisis & Prediksi' : 'Pengaturan'

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-5 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500 font-medium">Karang Taruna</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold">{title}</span>
      </div>
      
      <div className="flex-1 max-w-[400px] relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari transaksi..."
          className="w-full h-8 rounded-md bg-gray-50 border border-gray-200 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-700 leading-tight">Bendahara</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
          BD
        </div>
      </div>
    </header>
  )
}
