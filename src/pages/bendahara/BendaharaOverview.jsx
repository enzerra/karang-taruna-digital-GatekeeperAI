import FinanceChart from './components/FinanceChart'
import InsightCard from './components/InsightCard'
import KpiCard from './components/KpiCard'
import { formatRupiah } from './bendaharaUtils'

export default function BendaharaOverview({ derived, dashboardInsight, setActive, navigate }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Aksi Cepat</h2>
            <p className="text-sm text-gray-500 mt-1">Mulai dari impor Excel sebelum masuk ke pengelolaan transaksi manual.</p>
          </div>
          <button onClick={() => navigate('import-data')} className="px-4 py-2 rounded-lg bg-[#0f4a8a] text-white font-medium text-sm hover:bg-[#0c3e76] transition-colors shadow-sm">
            Impor Data Pintar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KpiCard 
          title="Total Pemasukan" 
          value={formatRupiah(derived.totalIn)} 
          delta={derived.kpi?.income?.delta}
        />
        <KpiCard 
          title="Total Pengeluaran" 
          value={formatRupiah(derived.totalOut)} 
          delta={derived.kpi?.expense?.delta}
          deltaText="vs bulan lalu (trend pengeluaran)"
        />
        <KpiCard 
          title="Saldo Kas Saat Ini" 
          value={formatRupiah(derived.saldo)} 
          delta={derived.kpi?.saldo?.delta}
          deltaText="vs pertumbuhan bulan lalu"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grafik Keuangan (Bulanan)</h2>
          <FinanceChart chart={derived.chart} withLegend />
        </div>

        <div className="space-y-4">
          <InsightCard title="Insight singkat (AI/ML)" body={dashboardInsight} />
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Transaksi terbaru</h2>
              <button onClick={() => setActive('tx-all')} className="text-sm font-medium text-[#0f4a8a] hover:text-[#0c3e76] transition-colors cursor-pointer bg-transparent border-0">Lihat semua</button>
            </div>
            <div className="space-y-4">
              {derived.latest.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.desc}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.category} &bull; {item.date}</p>
                  </div>
                  <p className={`text-sm font-semibold ${item.amount > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {item.amount > 0 ? '+' : ''}{formatRupiah(item.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
