import { formatRupiah } from './bendaharaUtils'

export default function ManajemenManagemenTransaksi({
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  filterFrom,
  setFilterFrom,
  filterTo,
  setFilterTo,
  categoryOptions,
  filteredTx,
  openCreate,
  openEdit,
  deleteTx,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <label className="text-sm text-[#556987]">
              Jenis
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="mt-1 h-10 px-3 rounded-xl border border-[#d9dee8] bg-white text-sm w-44">
                <option value="Semua">Semua</option>
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </label>
            <label className="text-sm text-[#556987]">
              Kategori
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="mt-1 h-10 px-3 rounded-xl border border-[#d9dee8] bg-white text-sm w-56">
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-[#556987]">
              Dari
              <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="mt-1 h-10 px-3 rounded-xl border border-[#d9dee8] bg-white text-sm w-44" />
            </label>
            <label className="text-sm text-[#556987]">
              Sampai
              <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="mt-1 h-10 px-3 rounded-xl border border-[#d9dee8] bg-white text-sm w-44" />
            </label>
          </div>
          <button onClick={openCreate} className="h-10 bg-[#0f4a8a] text-white font-semibold px-4 rounded-xl border-0 cursor-pointer hover:bg-[#0c3e76]">
            + Tambah transaksi
          </button>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-[#e2e7f0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f4f7fb] border-b border-[#e8edf5] text-[#5b6f8d]">
                {['Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Status', 'Nominal', 'Aksi'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((item) => (
                <tr key={item.id} className="border-b border-[#edf1f7]">
                  <td className="px-5 py-4 text-[#556987]">{item.date}</td>
                  <td className="px-5 py-4 text-[#111827] font-medium">{item.type}</td>
                  <td className="px-5 py-4 text-[#556987]">{item.category}</td>
                  <td className="px-5 py-4 text-[#111827]">{item.desc}</td>
                  <td className="px-5 py-4 text-[#556987]">{item.status}</td>
                  <td className={`px-5 py-4 font-bold ${item.amount > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {item.amount > 0 ? '+' : '-'} {formatRupiah(item.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(item)} className="text-[#6e8098] hover:text-[#0f4a8a] bg-transparent border-0 cursor-pointer">Edit</button>
                      <button onClick={() => deleteTx(item.id)} className="text-[#6e8098] hover:text-red-600 bg-transparent border-0 cursor-pointer">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTx.length === 0 && (
          <div className="py-14 text-center text-sm text-[#64748b]">Tidak ada transaksi yang cocok.</div>
        )}
      </section>
    </div>
  )
}
