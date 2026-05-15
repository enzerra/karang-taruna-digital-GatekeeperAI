export default function BendaharaHeader({ active, search, setSearch }) {
  return (
    <header className="h-[86px] bg-white border-b border-[#d9dee8] px-8 flex items-center justify-between gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-[#0f294f]">
          {active === 'dashboard' ? 'Dashboard Keuangan' :
            active.startsWith('tx-') ? 'Manajemen Transaksi' :
            active === 'kategori' ? 'Manajemen Kategori' :
            active === 'laporan' ? 'Laporan Keuangan' :
            active === 'analisis' ? 'Analisis & Prediksi' :
            'Pengaturan'}
        </h1>
        <p className="text-sm text-[#6b7f9b] mt-1">Karang Taruna Desa</p>
      </div>
      <div className="flex-1 max-w-[620px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari transaksi, kategori, atau keterangan..."
          className="w-full h-12 rounded-xl bg-[#eef2f7] border border-[#e0e6f0] px-4 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#b3c9e9]"
        />
      </div>
      <div className="text-right">
        <p className="font-semibold text-[#1f314a]">Bendahara</p>
        <p className="text-xs text-[#7d8ea6]">Keuangan</p>
      </div>
    </header>
  )
}
