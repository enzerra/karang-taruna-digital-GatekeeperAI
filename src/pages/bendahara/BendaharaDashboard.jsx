import { useEffect, useMemo, useState } from 'react'
import {
  addCategory,
  createTransaction,
  listCategories,
  listTransactions,
  removeCategory,
  removeTransaction,
  updateTransaction,
} from '../../data/financeService'

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tx-all', label: 'Semua Transaksi', group: 'Transaksi' },
  { id: 'tx-in', label: 'Pemasukan', group: 'Transaksi' },
  { id: 'tx-out', label: 'Pengeluaran', group: 'Transaksi' },
  { id: 'kategori', label: 'Kategori' },
  { id: 'laporan', label: 'Laporan' },
  { id: 'analisis', label: 'Analisis' },
  { id: 'pengaturan', label: 'Pengaturan' },
]

const EMPTY_TX = {
  date: '',
  type: 'Pemasukan',
  desc: '',
  category: '',
  status: 'Lunas',
  amount: '',
}

function formatRupiah(n) {
  const num = Number(n) || 0
  return 'Rp ' + Math.abs(num).toLocaleString('id-ID')
}

function parseMonthKey(dateStr) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(yyyyMm) {
  const [y, m] = String(yyyyMm || '').split('-').map((v) => Number(v))
  if (!y || !m) return '-'
  const date = new Date(y, m - 1, 1)
  return date.toLocaleDateString('id-ID', { month: 'short' })
}

function InsightCard({ title, body }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
      <p className="text-sm font-semibold text-[#0f294f]">{title}</p>
      <p className="text-sm text-[#556987] leading-relaxed mt-2">{body}</p>
    </div>
  )
}

export default function BendaharaDashboard({ navigate }) {
  const [active, setActive] = useState('dashboard')
  const [tx, setTx] = useState([])
  const [cats, setCats] = useState({ pemasukan: [], pengeluaran: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('Semua')
  const [filterCategory, setFilterCategory] = useState('Semua')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_TX)
  const [infoMessage, setInfoMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [newCatIn, setNewCatIn] = useState('')
  const [newCatOut, setNewCatOut] = useState('')

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const [txData, catData] = await Promise.all([listTransactions(), listCategories()])
      setTx(txData)
      setCats(catData)
      setIsLoading(false)
    }
    load()
  }, [])

  const derived = useMemo(() => {
    const totalIn = tx.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0)
    const totalOut = Math.abs(tx.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0))
    const saldo = totalIn - totalOut

    const byMonth = {}
    tx.forEach((item) => {
      const key = parseMonthKey(item.date)
      if (!key) return
      if (!byMonth[key]) byMonth[key] = { income: 0, expense: 0 }
      if (item.amount > 0) byMonth[key].income += item.amount
      else byMonth[key].expense += Math.abs(item.amount)
    })
    const months = Object.keys(byMonth).sort().slice(-6)
    const chart = months.map((key) => ({ key, label: monthLabel(key), ...byMonth[key] }))

    const latest = [...tx].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 6)
    return { totalIn, totalOut, saldo, chart, latest }
  }, [tx])

  const filteredTx = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    const inDateRange = (item) => {
      const d = new Date(item.date)
      if (Number.isNaN(d.getTime())) return true
      if (filterFrom) {
        const from = new Date(filterFrom)
        if (!Number.isNaN(from.getTime()) && d < from) return false
      }
      if (filterTo) {
        const to = new Date(filterTo)
        if (!Number.isNaN(to.getTime()) && d > to) return false
      }
      return true
    }

    return tx
      .filter((item) => {
        if (active === 'tx-in') return item.amount > 0
        if (active === 'tx-out') return item.amount < 0
        return true
      })
      .filter((item) => {
        if (filterType === 'Semua') return true
        return item.type === filterType
      })
      .filter((item) => {
        if (filterCategory === 'Semua') return true
        return item.category === filterCategory
      })
      .filter(inDateRange)
      .filter((item) => {
        if (!keyword) return true
        return (
          item.desc.toLowerCase().includes(keyword) ||
          item.category.toLowerCase().includes(keyword) ||
          item.type.toLowerCase().includes(keyword)
        )
      })
  }, [tx, active, search, filterType, filterCategory, filterFrom, filterTo])

  function openCreate() {
    setEditingId(null)
    setForm({ ...EMPTY_TX, type: active === 'tx-out' ? 'Pengeluaran' : 'Pemasukan' })
    setErrorMessage('')
    setInfoMessage('')
    setIsModalOpen(true)
  }

  function openEdit(item) {
    setEditingId(item.id)
    setForm({
      date: item.date,
      type: item.type,
      desc: item.desc,
      category: item.category,
      status: item.status,
      amount: String(Math.abs(item.amount)),
    })
    setErrorMessage('')
    setInfoMessage('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setErrorMessage('')
  }

  async function reloadAll() {
    const [txData, catData] = await Promise.all([listTransactions(), listCategories()])
    setTx(txData)
    setCats(catData)
  }

  async function submitTx(event) {
    event.preventDefault()
    if (!form.date || !form.desc.trim() || !form.category.trim() || !String(form.amount).trim()) {
      setErrorMessage('Tanggal, deskripsi, kategori, dan nominal wajib diisi.')
      return
    }
    const payload = {
      date: form.date,
      type: form.type,
      desc: form.desc,
      category: form.category,
      status: form.status,
      amount: Number(form.amount),
    }
    try {
      setIsSaving(true)
      if (editingId) {
        await updateTransaction(editingId, payload)
        setInfoMessage('Transaksi berhasil diperbarui.')
      } else {
        await createTransaction(payload)
        setInfoMessage('Transaksi berhasil ditambahkan.')
      }
      await reloadAll()
      closeModal()
    } catch {
      setErrorMessage('Gagal menyimpan transaksi.')
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteTx(id) {
    const selected = tx.find((item) => item.id === id)
    if (!selected) return
    const ok = window.confirm(`Hapus transaksi \"${selected.desc}\"?`)
    if (!ok) return
    await removeTransaction(id)
    await reloadAll()
    setInfoMessage('Transaksi berhasil dihapus.')
  }

  async function addCat(type) {
    const value = type === 'pemasukan' ? newCatIn : newCatOut
    const next = await addCategory(type, value)
    setCats(next)
    if (type === 'pemasukan') setNewCatIn('')
    else setNewCatOut('')
  }

  async function delCat(type, name) {
    const ok = window.confirm(`Hapus kategori \"${name}\"?`)
    if (!ok) return
    const next = await removeCategory(type, name)
    setCats(next)
  }

  const sidebarGroups = useMemo(() => {
    const groups = []
    const trans = NAV.filter((item) => item.group === 'Transaksi')
    groups.push({ title: null, items: NAV.filter((item) => !item.group && item.id === 'dashboard') })
    groups.push({ title: 'Transaksi', items: trans })
    groups.push({ title: null, items: NAV.filter((item) => !item.group && item.id !== 'dashboard') })
    return groups
  }, [])

  const categoryOptions = useMemo(() => {
    const base = ['Semua']
    const list = filterType === 'Pengeluaran' ? cats.pengeluaran : filterType === 'Pemasukan' ? cats.pemasukan : [...cats.pemasukan, ...cats.pengeluaran]
    return base.concat(list)
  }, [cats, filterType])

  const dashboardInsight = useMemo(() => {
    const last = derived.chart[derived.chart.length - 1]
    const prev = derived.chart[derived.chart.length - 2]
    if (!last || !prev) return 'Data belum cukup untuk insight otomatis. Tambahkan transaksi rutin untuk melihat tren.'
    const delta = prev.expense ? ((last.expense - prev.expense) / prev.expense) * 100 : 0
    const direction = delta >= 0 ? 'meningkat' : 'menurun'
    return `Pengeluaran ${direction} ${Math.abs(delta).toFixed(0)}% pada periode terakhir. Cek kategori terbesar untuk efisiensi.`
  }, [derived.chart])

  return (
    <div className="min-h-screen bg-[#eff1f6] flex">
      <aside className="w-[280px] bg-white border-r border-[#d9dee8] flex flex-col">
        <div className="px-5 py-8 border-b border-[#e8edf5]">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#0f4a8a] flex items-center justify-center text-white font-black">KT</div>
            <div>
              <h2 className="text-2xl font-bold text-[#0b3567] leading-none">Keuangan</h2>
              <p className="text-xs tracking-[.18em] text-[#8ea2bf] font-semibold mt-1">BENDAHARA</p>
            </div>
          </div>
        </div>

        <nav className="px-4 py-5 flex-1 space-y-3">
          {sidebarGroups.map((group, idx) => (
            <div key={idx}>
              {group.title && <p className="text-xs font-bold text-[#8ea2bf] uppercase tracking-wider px-3 mb-2">{group.title}</p>}
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = active === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActive(item.id); setInfoMessage(''); setErrorMessage('') }}
                      className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                        isActive
                          ? 'bg-[#d8e4f5] border-[#c5d7ef] text-[#0c3e79] font-semibold'
                          : 'bg-transparent border-transparent text-[#2f4563] hover:bg-[#edf2fa]'
                      } cursor-pointer`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-5 py-5 border-t border-[#e8edf5]">
          <button onClick={() => navigate('login')} className="text-[#334e70] font-medium text-sm hover:text-[#0f4a8a] bg-transparent border-0 cursor-pointer">
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
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

        <main className="p-8 overflow-auto">
          {infoMessage && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{infoMessage}</p>}
          {errorMessage && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>}

          {isLoading ? (
            <div className="py-20 text-center text-gray-500">Memuat data keuangan...</div>
          ) : (
            <>
              {active === 'dashboard' && (
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
                      <div className="rounded-xl border border-dashed border-[#d0d8e6] p-4">
                        <div className="h-44 flex items-end gap-3">
                          {derived.chart.map((m) => {
                            const max = Math.max(...derived.chart.map((x) => x.income + x.expense), 1)
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
                        <p className="text-xs text-[#7b8fae] mt-4">Hijau: pemasukan, coklat: pengeluaran</p>
                      </div>
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
                                <p className="text-xs text-[#64748b] mt-0.5">{item.category} • {item.date}</p>
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
              )}

              {active.startsWith('tx-') && (
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
              )}

              {active === 'kategori' && (
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
              )}

              {active === 'laporan' && (
                <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
                  <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#102f57] mb-4">Grafik pemasukan vs pengeluaran</h2>
                    <div className="rounded-xl border border-dashed border-[#d0d8e6] p-4">
                      <div className="h-44 flex items-end gap-3">
                        {derived.chart.map((m) => {
                          const max = Math.max(...derived.chart.map((x) => x.income + x.expense), 1)
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
                    </div>
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
              )}

              {active === 'analisis' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <InsightCard
                    title="Prediksi saldo (placeholder)"
                    body="Prediksi saldo akan ditampilkan di sini. Saat backend/ML siap, endpoint prediksi bisa mengembalikan proyeksi saldo 1-3 bulan ke depan."
                  />
                  <InsightCard
                    title="Tren pengeluaran"
                    body={dashboardInsight}
                  />
                </div>
              )}

              {active === 'pengaturan' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#102f57] mb-4">Profil user</h2>
                    <p className="text-sm text-[#556987]">Nama: Bendahara</p>
                    <p className="text-sm text-[#556987] mt-1">Role: Keuangan</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#102f57] mb-4">Pengaturan sistem</h2>
                    <button onClick={() => navigate('login')} className="h-10 px-4 rounded-xl bg-[#0f4a8a] text-white font-semibold border-0 cursor-pointer hover:bg-[#0c3e76]">
                      Logout
                    </button>
                    <p className="text-xs text-[#8b9cb5] mt-3">Area ini bisa diisi setting tambahan saat integrasi BE.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-5">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer text-lg">x</button>
            </div>

            <form onSubmit={submitTx} className="p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Tanggal
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Jenis
                  <select
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                  </select>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Kategori
                  <input
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Contoh: Donasi"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Nominal
                  <input
                    value={form.amount}
                    onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Contoh: 250000"
                  />
                </label>
              </div>

              <label className="text-sm font-medium text-gray-700 block">
                Keterangan
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </label>

              <label className="text-sm font-medium text-gray-700 block">
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                >
                  <option value="Lunas">Lunas</option>
                  <option value="Proses">Proses</option>
                </select>
              </label>

              {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-[#1a3a6b] text-white font-semibold hover:bg-[#152f58] transition-colors"
                >
                  {isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

