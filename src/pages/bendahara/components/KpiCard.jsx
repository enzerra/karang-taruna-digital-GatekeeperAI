export default function KpiCard({ title, value, delta, deltaText }) {
  const isPositive = delta >= 0
  const deltaColor = isPositive ? 'text-emerald-600' : 'text-red-600'
  const icon = isPositive ? '↑' : '↓'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
      {delta !== undefined && (
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {icon} {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-xs text-gray-400">{deltaText || 'vs bulan lalu'}</span>
        </div>
      )}
    </div>
  )
}
