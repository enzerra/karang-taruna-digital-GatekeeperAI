export function formatRupiah(n) {
  const num = Number(n) || 0
  return 'Rp ' + Math.abs(num).toLocaleString('id-ID')
}

export function parseMonthKey(dateStr) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(yyyyMm) {
  const [y, m] = String(yyyyMm || '').split('-').map((v) => Number(v))
  if (!y || !m) return '-'
  const date = new Date(y, m - 1, 1)
  return date.toLocaleDateString('id-ID', { month: 'short' })
}
