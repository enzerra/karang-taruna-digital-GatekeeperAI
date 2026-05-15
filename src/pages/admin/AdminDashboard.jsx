import { useEffect, useMemo, useState } from 'react'
import AdminGovernanceLayout from '../../components/AdminGovernanceLayout'
import {
  FALLBACK_IMAGE,
  getStatusStyle,
  PROGRAM_CATEGORIES,
  PROGRAM_STATUS,
} from '../../services/programs/programStore'
import {
  createProgram,
  listPrograms,
  removeProgram,
  updateProgram,
} from '../../services/programs/programService'
import { listNews, removeNews } from '../../services/news/newsService'
import { TRANSACTIONS } from '../../mocks/portalData'

const EMPTY_FORM = {
  title: '',
  category: PROGRAM_CATEGORIES[0],
  badge: PROGRAM_STATUS[0],
  period: '',
  desc: '',
  img: '',
}

function toTitleCase(value) {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

export default function AdminDashboard({ navigate }) {
  const [programs, setPrograms] = useState([])
  const [news, setNews] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const [programData, newsData] = await Promise.all([listPrograms(), listNews()])
      setPrograms(programData)
      setNews(newsData)
      setIsLoading(false)
    }
    load()
  }, [])

  const filteredNews = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    if (!keyword) return news
    return news.filter((item) => (
      item.title.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    ))
  }, [news, search])

  const filteredPrograms = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    if (!keyword) return programs
    return programs.filter((item) => (
      item.title.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    ))
  }, [programs, search])

  const totalIn = TRANSACTIONS.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0)
  const totalOut = Math.abs(TRANSACTIONS.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0))
  const saldo = totalIn - totalOut

  const stats = [
    { label: 'Total Berita', value: news.length, accent: '#dbeafe', color: '#1e3a8a' },
    { label: 'Program Aktif', value: programs.filter((item) => item.badge === 'AKTIF').length, accent: '#dcfce7', color: '#166534' },
    { label: 'Pemasukan (Bulan Ini)', value: `Rp ${totalIn.toLocaleString('id-ID')}`, accent: '#dcfce7', color: '#065f46' },
    { label: 'Pengeluaran (Bulan Ini)', value: `Rp ${totalOut.toLocaleString('id-ID')}`, accent: '#fef3c7', color: '#92400e' },
  ]

  async function reloadPrograms() {
    const data = await listPrograms()
    setPrograms(data)
  }

  async function reloadNews() {
    const data = await listNews()
    setNews(data)
  }

  function openCreateModal() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrorMessage('')
    setInfoMessage('')
    setIsModalOpen(true)
  }

  function openEditModal(program) {
    setEditingId(program.id)
    setForm({
      title: program.title,
      category: program.category,
      badge: program.badge,
      period: program.period,
      desc: program.desc,
      img: program.img,
    })
    setErrorMessage('')
    setInfoMessage('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setErrorMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim() || !form.period.trim() || !form.desc.trim()) {
      setErrorMessage('Judul, periode, dan deskripsi wajib diisi.')
      return
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      badge: form.badge,
      period: form.period.trim(),
      desc: form.desc.trim(),
      img: form.img.trim() || FALLBACK_IMAGE,
    }

    try {
      setIsSaving(true)
      if (editingId) {
        await updateProgram(editingId, payload)
        setInfoMessage('Program berhasil diperbarui.')
      } else {
        await createProgram(payload)
        setInfoMessage('Program berhasil ditambahkan.')
      }
      await reloadPrograms()
      closeModal()
    } catch {
      setErrorMessage('Terjadi kendala saat menyimpan data program.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteProgram(id) {
    const selected = programs.find((item) => item.id === id)
    if (!selected) return
    const approved = window.confirm(`Hapus program "${selected.title}"?`)
    if (!approved) return

    await removeProgram(id)
    await reloadPrograms()
    setInfoMessage('Program berhasil dihapus.')
  }

  async function handleDeleteNews(id) {
    const selected = news.find((item) => item.id === id)
    if (!selected) return
    const approved = window.confirm(`Hapus berita "${selected.title}"?`)
    if (!approved) return

    await removeNews(id)
    await reloadNews()
    setInfoMessage('Berita berhasil dihapus.')
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, img: String(reader.result || '') }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <AdminGovernanceLayout
        navigate={navigate}
        activeItem="dashboard"
        title="Dashboard Admin"
        searchValue={search}
        onSearchChange={setSearch}
        profileName="Admin Utama"
        profileRole="Super Admin"
      >
        {infoMessage && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{infoMessage}</p>}
        {isLoading ? (
          <div className="py-20 text-center text-gray-500">Memuat dashboard admin...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
              {stats.map((item) => (
                <div key={item.label} className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
                  <div className="w-12 h-12 rounded-xl mb-4" style={{ background: item.accent }} />
                  <p className="text-sm text-[#4a5f7e] mb-1">{item.label}</p>
                  <p className="text-4xl font-bold leading-tight" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <div className="space-y-6">
                <section className="bg-white rounded-2xl border border-[#e2e7f0] overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-[#e8edf5] flex items-center justify-between">
                    <h2 className="text-4xl font-semibold text-[#102f57]">Manajemen Berita</h2>
                    <button onClick={() => navigate('admin-berita')} className="bg-[#0f4a8a] text-white font-semibold px-4 py-2 rounded-xl border-0 cursor-pointer hover:bg-[#0c3e76]">
                      + Tambah Berita
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#f4f7fb] border-b border-[#e8edf5] text-[#5b6f8d]">
                          <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Judul Berita</th>
                          <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Kategori</th>
                          <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Tanggal</th>
                          <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Status</th>
                          <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNews.slice(0, 4).map((item) => (
                          <tr key={item.id} className="border-b border-[#edf1f7]">
                            <td className="px-5 py-4 text-[#111827] font-medium">{item.title}</td>
                            <td className="px-5 py-4">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#e8eef8] text-[#174a86]">{item.category}</span>
                            </td>
                            <td className="px-5 py-4 text-[#556987]">{item.date}</td>
                            <td className="px-5 py-4">
                              <span className={`text-sm font-semibold ${item.status === 'Published' ? 'text-emerald-700' : 'text-slate-500'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <button onClick={() => navigate('admin-berita')} className="text-[#6e8098] hover:text-[#0f4a8a] bg-transparent border-0 cursor-pointer">Edit</button>
                                <button onClick={() => handleDeleteNews(item.id)} className="text-[#6e8098] hover:text-red-600 bg-transparent border-0 cursor-pointer">Hapus</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="bg-white rounded-2xl border border-[#e2e7f0] overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-[#e8edf5] flex items-center justify-between">
                    <h2 className="text-4xl font-semibold text-[#102f57]">Program Kerja</h2>
                    <button onClick={openCreateModal} className="text-[#0f4a8a] font-semibold bg-transparent border-0 cursor-pointer">Tambah Program</button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 p-5">
                    {filteredPrograms.slice(0, 4).map((item) => {
                      const statusStyle = getStatusStyle(item.badge)
                      return (
                        <div key={item.id} className="border border-[#e2e7f0] rounded-xl p-4 flex items-center gap-3">
                          <img src={item.img} alt={item.title} className="w-14 h-14 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#0f172a] truncate">{item.title}</p>
                            <p className="text-sm" style={{ color: statusStyle.text }}>Status: {toTitleCase(item.badge)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEditModal(item)} className="text-sm px-3 py-1.5 rounded-lg border border-[#cbd5e1] bg-white text-[#1e3a8a]">Kelola</button>
                            <button onClick={() => handleDeleteProgram(item.id)} className="text-sm px-3 py-1.5 rounded-lg border border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]">Hapus</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl bg-gradient-to-b from-[#15538f] to-[#124474] p-5 text-white shadow-sm">
                  <h3 className="text-3xl font-semibold mb-4">Aksi Cepat</h3>
                  <div className="space-y-3">
                    <button onClick={() => navigate('admin-berita')} className="w-full text-left px-4 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                      Tambah Berita Baru
                    </button>
                    <button onClick={openCreateModal} className="w-full text-left px-4 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                      Tambah Program Kerja
                    </button>
                    <button onClick={() => navigate('bendahara')} className="w-full text-left px-4 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                      Input Transaksi Keuangan
                    </button>
                  </div>
                </section>

                <section className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
                  <h3 className="text-3xl font-semibold text-[#102f57] mb-4">Ringkasan Keuangan</h3>
                  <div className="rounded-xl border border-dashed border-[#d0d8e6] p-4 mb-4">
                    <div className="h-28 flex items-end gap-3">
                      {[34, 22, 45, 30, 52, 26].map((value, index) => (
                        <div
                          key={index}
                          className={`w-9 rounded-t ${index % 2 === 0 ? 'bg-emerald-700' : 'bg-amber-700'}`}
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#7b8fae] mt-3">Visualisasi pemasukan vs pengeluaran</p>
                  </div>
                  <p className="text-sm text-[#64748b]">Saldo Akhir Kas</p>
                  <p className="text-3xl font-bold text-[#0f2f5a] mt-1">Rp {saldo.toLocaleString('id-ID')}</p>
                  <div className="mt-4 h-3 rounded-full bg-[#e5eaf3] overflow-hidden">
                    <div className="h-full w-[65%] bg-emerald-700" />
                  </div>
                  <p className="text-xs text-[#8b9cb5] mt-2">65% target pendanaan program tahunan tercapai</p>
                </section>
              </div>
            </div>
          </>
        )}
      </AdminGovernanceLayout>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-5">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Program' : 'Tambah Program Baru'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer text-lg">x</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Judul Program
                  <input
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Periode
                  <input
                    value={form.period}
                    onChange={(event) => setForm((prev) => ({ ...prev, period: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Contoh: Juni 2026"
                  />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Kategori
                  <select
                    value={form.category}
                    onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    {PROGRAM_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Status
                  <select
                    value={form.badge}
                    onChange={(event) => setForm((prev) => ({ ...prev, badge: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    {PROGRAM_STATUS.map((status) => (
                      <option key={status} value={status}>{toTitleCase(status)}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="text-sm font-medium text-gray-700 block">
                Deskripsi
                <textarea
                  value={form.desc}
                  onChange={(event) => setForm((prev) => ({ ...prev, desc: event.target.value }))}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </label>

              <label className="text-sm font-medium text-gray-700 block">
                URL Gambar
                <input
                  value={form.img}
                  onChange={(event) => setForm((prev) => ({ ...prev, img: event.target.value }))}
                  placeholder="https://..."
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <label className="text-sm font-medium text-gray-700 block">
                Upload Gambar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 w-full text-sm file:px-3 file:py-2 file:rounded-lg file:border file:border-gray-200 file:bg-gray-50 file:cursor-pointer"
                />
              </label>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <img src={form.img || FALLBACK_IMAGE} alt="Preview program" className="w-full h-44 object-cover" />
              </div>

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
                  {isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
