export default function BendaharaKategori({
  cats,
  newCatIn,
  setNewCatIn,
  newCatOut,
  setNewCatOut,
  addCat,
  delCat,
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#102f57] mb-4">Kategori Pemasukan</h2>
        <div className="flex gap-2 mb-4">
          <input value={newCatIn} onChange={(e) => setNewCatIn(e.target.value)} placeholder="Tambah kategori..." className="flex-1 h-10 px-3 rounded-xl border border-[#d9dee8] bg-white text-sm" />
          <button onClick={() => addCat('pemasukan')} className="h-10 px-4 rounded-xl bg-[#0f4a8a] text-white font-semibold border-0 cursor-pointer">Tambah</button>
        </div>
        <div className="space-y-2">
          {cats.pemasukan.map((name) => (
            <div key={name} className="flex items-center justify-between border border-[#e2e7f0] rounded-xl px-4 py-3">
              <span className="text-sm text-[#111827] font-medium">{name}</span>
              <button onClick={() => delCat('pemasukan', name)} className="text-sm text-[#6e8098] hover:text-red-600 bg-transparent border-0 cursor-pointer">Hapus</button>
            </div>
          ))}
          {cats.pemasukan.length === 0 && <p className="text-sm text-[#64748b]">Belum ada kategori.</p>}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#102f57] mb-4">Kategori Pengeluaran</h2>
        <div className="flex gap-2 mb-4">
          <input value={newCatOut} onChange={(e) => setNewCatOut(e.target.value)} placeholder="Tambah kategori..." className="flex-1 h-10 px-3 rounded-xl border border-[#d9dee8] bg-white text-sm" />
          <button onClick={() => addCat('pengeluaran')} className="h-10 px-4 rounded-xl bg-[#0f4a8a] text-white font-semibold border-0 cursor-pointer">Tambah</button>
        </div>
        <div className="space-y-2">
          {cats.pengeluaran.map((name) => (
            <div key={name} className="flex items-center justify-between border border-[#e2e7f0] rounded-xl px-4 py-3">
              <span className="text-sm text-[#111827] font-medium">{name}</span>
              <button onClick={() => delCat('pengeluaran', name)} className="text-sm text-[#6e8098] hover:text-red-600 bg-transparent border-0 cursor-pointer">Hapus</button>
            </div>
          ))}
          {cats.pengeluaran.length === 0 && <p className="text-sm text-[#64748b]">Belum ada kategori.</p>}
        </div>
      </section>
    </div>
  )
}
