export default function FinanceChart({ chart, withLegend = false }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d0d8e6] p-4">
      <div className="h-44 flex items-end gap-3">
        {chart.map((m) => {
          const max = Math.max(...chart.map((x) => x.income + x.expense), 1)
          const hIn = Math.round((m.income / max) * 100)
          const hOut = Math.round((m.expense / max) * 100)
          return (
            <div key={m.key} className="flex-1 min-w-0">
              <div className="flex items-end gap-2 h-36">
                <div className="flex-1 bg-emerald-700 rounded-t" style={{ height: `${hIn}%` }} />
                <div className="flex-1 bg-amber-700 rounded-t" style={{ height: `${hOut}%` }} />
              </div>
              <p className="text-xs text-[#7b8fae] mt-2 text-center">{m.label}</p>
            </div>
          )
        })}
      </div>
      {withLegend && <p className="text-xs text-[#7b8fae] mt-4">Hijau: pemasukan, coklat: pengeluaran</p>}
    </div>
  )
}
