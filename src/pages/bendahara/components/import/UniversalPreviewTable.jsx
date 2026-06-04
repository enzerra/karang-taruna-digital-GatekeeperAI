import { useState, useEffect } from 'react'

function normalizeIssues(row) {
  const issues = []
  if (!row.date) issues.push('Tanggal belum terdeteksi')
  if (!row.desc) issues.push('Deskripsi belum terdeteksi')
  if (!row.category) issues.push('Kategori belum terdeteksi')
  if (!row.amount || Number(row.amount) === 0) issues.push('Nominal belum terdeteksi')
  return issues
}

function EditableRow({ item, onChange }) {
  const { rowIndex } = item
  const [local, setLocal] = useState(() => ({
    include: item.include !== false,
    date: item.date || '',
    type: item.type || 'Pemasukan',
    desc: item.desc || '',
    category: item.category || '',
    status: item.status || 'Lunas',
    amount: Math.abs(Number(item.amount) || 0),
    issues: item.issues || [],
  }))

  useEffect(() => {
    setLocal({
      include: item.include !== false,
      date: item.date || '',
      type: item.type || 'Pemasukan',
      desc: item.desc || '',
      category: item.category || '',
      status: item.status || 'Lunas',
      amount: Math.abs(Number(item.amount) || 0),
      issues: item.issues || [],
    })
  }, [item])

  function update(partial) {
    const next = { ...local, ...partial }
    next.issues = normalizeIssues(next)
    setLocal(next)
    onChange({ rowIndex, raw: item.raw || {}, ...next })
  }

  return (
    <tr className="border-b border-[#edf1f7] align-top">
      <td className="px-5 py-4 text-gray-500">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={local.include} onChange={(e) => update({ include: e.target.checked })} />
          <span className="text-xs">{rowIndex}</span>
        </label>
      </td>
      <td className="px-5 py-4 text-gray-700">
        <input type="date" value={local.date || ''} onChange={(e) => update({ date: e.target.value })} className="text-sm border p-1 rounded" />
      </td>
      <td className="px-5 py-4 text-gray-700">
        <select value={local.type} onChange={(e) => update({ type: e.target.value })} className="text-sm border p-1 rounded">
          <option>Pemasukan</option>
          <option>Pengeluaran</option>
        </select>
      </td>
      <td className="px-5 py-4 font-medium text-gray-900">
        <input type="text" value={local.desc} onChange={(e) => update({ desc: e.target.value })} className="w-full text-sm border p-1 rounded" />
      </td>
      <td className="px-5 py-4 text-gray-700">
        <input type="text" value={local.category} onChange={(e) => update({ category: e.target.value })} className="text-sm border p-1 rounded" />
      </td>
      <td className="px-5 py-4 font-semibold text-gray-900">
        <input type="number" value={local.amount} onChange={(e) => update({ amount: Number(e.target.value) || 0 })} className="text-sm border p-1 rounded w-32" />
      </td>
      <td className="px-5 py-4 text-gray-700">
        <input type="text" value={local.status} onChange={(e) => update({ status: e.target.value })} className="text-sm border p-1 rounded" />
      </td>
      <td className="px-5 py-4">
        {local.issues && local.issues.length ? (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 w-max">
              Invalid
            </span>
            <span className="text-red-600 text-[10px]">{local.issues.join(', ')}</span>
          </div>
        ) : (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 w-max">
            Valid
          </span>
        )}
      </td>
    </tr>
  )
}

export default function UniversalPreviewTable({
  previewRows,
  allSelected,
  onBulkToggle,
  onSelectValid,
  onClearSession,
  onConfirmImport,
  setEditableRows,
  isLoading,
  sessionCount,
}) {
  if (!previewRows || previewRows.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl border border-[#e2e7f0] shadow-sm overflow-hidden mt-6">
      <div className="px-5 py-4 border-b border-[#e8edf5]">
        <h2 className="text-xl font-bold text-[#102f57]">Keranjang Sesi Import</h2>
        <p className="text-sm text-gray-500 mt-1">
          Data kumulatif dari {sessionCount} file/scan. Silakan edit atau hilangkan centang pada baris duplikat sebelum impor.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={onConfirmImport}
            disabled={isLoading}
            className="px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
          >
            {isLoading ? 'Memproses...' : 'Konfirmasi Import Semua Data'}
          </button>
          <button
            onClick={onClearSession}
            className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Kosongkan Sesi
          </button>
          <button
            onClick={onSelectValid}
            className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            Select Valid Rows
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f4f7fb] border-b border-[#e8edf5] text-[#5b6f8d]">
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={allSelected} onChange={onBulkToggle} className="cursor-pointer" />
                  <span>Row</span>
                </label>
              </th>
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">Tanggal</th>
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">Tipe</th>
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">Deskripsi</th>
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">Kategori</th>
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">Nominal</th>
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">Issues</th>
            </tr>
          </thead>
          <tbody>
            {previewRows.map((item) => (
              <EditableRow
                key={item.uniqueId}
                item={item}
                onChange={(next) => setEditableRows((s) => ({ ...s, [item.uniqueId]: next }))}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
