import FinanceChart from './components/FinanceChart'
import InsightCard from './components/InsightCard'
import { formatRupiah } from './bendaharaUtils'

export default function BendaharaOverview({ derived, dashboardInsight, setActive }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Total pemasukan', value: formatRupiah(derived.totalIn), bg: '#dcfce7', color: '#166534' },
          { label: 'Total pengeluaran', value: formatRupiah(derived.totalOut), bg: '#fef3c7', color: '#92400e' },
          { label: 'Saldo saat ini', value: formatRupiah(derived.saldo), bg: '#dbeafe', color: '#1e3a8a' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
            <div className="w-12 h-12 rounded-xl mb-4" style={{ background: card.bg }} />
            <p className="text-sm text-[#4a5f7e] mb-1">{card.label}</p>
            <p className="text-3xl font-bold leading-tight" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#102f57] mb-4">Grafik Keuangan (Bulanan)</h2>
          <FinanceChart chart={derived.chart} withLegend />
        </div>

        <div className="space-y-4">
          <InsightCard title="Insight singkat (AI/ML)" body={dashboardInsight} />
          <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-semibold text-[#102f57]">Transaksi terbaru</h2>
              <button onClick={() => setActive('tx-all')} className="text-sm font-semibold text-[#0f4a8a] bg-transparent border-0 cursor-pointer">Lihat</button>
            </div>
            <div className="space-y-3">
              {derived.latest.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">{item.desc}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{item.category} &bull; {item.date}</p>
                  </div>
                  <p className={`text-sm font-bold ${item.amount > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {item.amount > 0 ? '+' : '-'} {formatRupiah(item.amount)}
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
