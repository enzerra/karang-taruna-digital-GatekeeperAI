import FinanceChart from './components/FinanceChart'
import InsightCard from './components/InsightCard'
import { formatRupiah } from './bendaharaUtils'

export default function BendaharaLaporan({ derived }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
      <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#102f57] mb-4">Grafik pemasukan vs pengeluaran</h2>
        <FinanceChart chart={derived.chart} />
        <p className="text-sm text-[#556987] mt-4">Gunakan filter transaksi untuk laporan per bulan/tahun (siap dikaitkan ke BE untuk query).</p>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
          <h3 className="text-2xl font-semibold text-[#102f57] mb-3">Export</h3>
          <button className="w-full h-10 rounded-xl border border-[#d9dee8] bg-white text-[#0f4a8a] font-semibold cursor-pointer">Export PDF</button>
          <button className="w-full h-10 rounded-xl border border-[#d9dee8] bg-white text-[#0f4a8a] font-semibold cursor-pointer mt-2">Export Excel</button>
          <p className="text-xs text-[#8b9cb5] mt-3">Placeholder export. Nanti tinggal sambungkan endpoint BE.</p>
        </div>
        <InsightCard title="Ringkasan" body={`Saldo saat ini ${formatRupiah(derived.saldo)}. Total pemasukan ${formatRupiah(derived.totalIn)} dan pengeluaran ${formatRupiah(derived.totalOut)}.`} />
      </div>
    </div>
  )
}
