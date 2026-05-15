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
import BendaharaKategori from './BendaharaKategori'
import BendaharaLaporan from './BendaharaLaporan'
import BendaharaOverview from './BendaharaOverview'
import BendaharaPemasukan from './BendaharaPemasukan'
import BendaharaPengaturan from './BendaharaPengaturan'
import BendaharaPengeluaran from './BendaharaPengeluaran'
import BendaharaPrediksi from './BendaharaPrediksi'
import ManajemenManagemenTransaksi from './ManajemenManagemenTransaksi'
import { EMPTY_TX, NAV } from './bendaharaConstants'
import { monthLabel, parseMonthKey } from './bendaharaUtils'
import BendaharaHeader from './components/BendaharaHeader'
import BendaharaSidebar from './components/BendaharaSidebar'
import TransactionModal from './components/TransactionModal'

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

  function changeActive(pageId) {
    setActive(pageId)
    setInfoMessage('')
    setErrorMessage('')
  }

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
    const ok = window.confirm(`Hapus transaksi "${selected.desc}"?`)
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
    const ok = window.confirm(`Hapus kategori "${name}"?`)
    if (!ok) return
    const next = await removeCategory(type, name)
    setCats(next)
  }

  const transactionProps = {
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
  }

  function renderContent() {
    if (active === 'dashboard') {
      return <BendaharaOverview derived={derived} dashboardInsight={dashboardInsight} setActive={setActive} />
    }
    if (active === 'tx-all') return <ManajemenManagemenTransaksi {...transactionProps} />
    if (active === 'tx-in') return <BendaharaPemasukan {...transactionProps} />
    if (active === 'tx-out') return <BendaharaPengeluaran {...transactionProps} />
    if (active === 'kategori') {
      return (
        <BendaharaKategori
          cats={cats}
          newCatIn={newCatIn}
          setNewCatIn={setNewCatIn}
          newCatOut={newCatOut}
          setNewCatOut={setNewCatOut}
          addCat={addCat}
          delCat={delCat}
        />
      )
    }
    if (active === 'laporan') return <BendaharaLaporan derived={derived} />
    if (active === 'analisis') return <BendaharaPrediksi dashboardInsight={dashboardInsight} />
    return <BendaharaPengaturan navigate={navigate} />
  }

  return (
    <div className="min-h-screen bg-[#eff1f6] flex">
      <BendaharaSidebar
        navigate={navigate}
        active={active}
        sidebarGroups={sidebarGroups}
        onChangeActive={changeActive}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <BendaharaHeader active={active} search={search} setSearch={setSearch} />

        <main className="p-8 overflow-auto">
          {infoMessage && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{infoMessage}</p>}
          {errorMessage && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>}

          {isLoading ? (
            <div className="py-20 text-center text-gray-500">Memuat data keuangan...</div>
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {isModalOpen && (
        <TransactionModal
          editingId={editingId}
          form={form}
          setForm={setForm}
          errorMessage={errorMessage}
          isSaving={isSaving}
          closeModal={closeModal}
          submitTx={submitTx}
        />
      )}
    </div>
  )
}
