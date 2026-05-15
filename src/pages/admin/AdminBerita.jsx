import { useEffect, useMemo, useState } from 'react'
import AdminGovernanceLayout from '../../components/AdminGovernanceLayout'
import { FALLBACK_IMAGE, NEWS_CATEGORIES, NEWS_STATUS } from '../../services/news/newsStore'
import { createNews, listNews, removeNews, updateNews } from '../../services/news/newsService'

const EMPTY_FORM = {
  title: '',
  category: NEWS_CATEGORIES[0],
  status: NEWS_STATUS[0],
  date: '',
  desc: '',
  img: '',
}

function toInputDate(displayDate) {
  if (!displayDate) return ''
  const parsed = new Date(displayDate)
  if (Number.isNaN(parsed.getTime())) return ''
  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AdminBerita({ navigate }) {
  const [news, setNews] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const data = await listNews()
      setNews(data)
      setIsLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase()
    const bySearch = news.filter((item) => (
      item.title.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword) ||
      item.desc.toLowerCase().includes(keyword)
    ))

    if (statusFilter === 'Semua') return bySearch
    return bySearch.filter((item) => item.status === statusFilter)
  }, [news, search, statusFilter])

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

  function openEditModal(item) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      category: item.category,
      status: item.status,
      date: toInputDate(item.date),
      desc: item.desc,
      img: item.img,
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

    if (!form.title.trim() || !form.date || !form.desc.trim()) {
      setErrorMessage('Judul, tanggal, dan deskripsi wajib diisi.')
      return
    }

    const payload = {
      title: form.title,
      category: form.category,
      status: form.status,
      date: form.date,
      desc: form.desc,
      img: form.img || FALLBACK_IMAGE,
    }

    try {
      setIsSaving(true)
      if (editingId) {
        await updateNews(editingId, payload)
        setInfoMessage('Berita berhasil diperbarui.')
      } else {
        await createNews(payload)
        setInfoMessage('Berita berhasil ditambahkan.')
      }
      await reloadNews()
      closeModal()
    } catch {
      setErrorMessage('Terjadi kendala saat menyimpan berita.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id) {
    const selected = news.find((item) => item.id === id)
    if (!selected) return

    const approved = window.confirm(`Hapus berita "${selected.title}"?`)
    if (!approved) return

    try {
      await removeNews(id)
      await reloadNews()
      setInfoMessage('Berita berhasil dihapus.')
    } catch {
      setInfoMessage('Gagal menghapus berita.')
    }
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
        activeItem="berita"
        title="Kelola Berita"
        searchValue={search}
        onSearchChange={setSearch}
        profileName="Admin Utama"
        profileRole="Super Admin"
      >
        {infoMessage && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{infoMessage}</p>}

        <section className="bg-white rounded-2xl border border-[#e2e7f0] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[#e8edf5] flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-4xl font-semibold text-[#102f57]">Manajemen Berita</h2>
              <p className="text-sm text-[#6b7f9b] mt-1">{news.length} artikel tersimpan</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 px-3 text-sm rounded-xl border border-[#d9dee8] bg-white text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#b3c9e9]"
              >
                <option value="Semua">Semua Status</option>
                {NEWS_STATUS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={openCreateModal}
                className="h-10 bg-[#0f4a8a] text-white font-semibold px-4 rounded-xl border-0 cursor-pointer hover:bg-[#0c3e76]"
              >
                + Tambah Berita
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-[#64748b]">Memuat data berita...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f4f7fb] border-b border-[#e8edf5] text-[#5b6f8d]">
                    <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Judul</th>
                    <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Kategori</th>
                    <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Tanggal</th>
                    <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Status</th>
                    <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Gambar</th>
                    <th className="px-5 py-3 text-left text-xs tracking-wider uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-b border-[#edf1f7]">
                      <td className="px-5 py-4 min-w-80">
                        <p className="text-[#111827] font-medium">{item.title}</p>
                        <p className="text-xs text-[#64748b] mt-1 line-clamp-2">{item.desc}</p>
                      </td>
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
                        <img src={item.img} alt={item.title} className="w-16 h-12 object-cover rounded-lg border border-[#e2e7f0]" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEditModal(item)} className="text-[#6e8098] hover:text-[#0f4a8a] bg-transparent border-0 cursor-pointer">Edit</button>
                          <button onClick={() => handleDelete(item.id)} className="text-[#6e8098] hover:text-red-600 bg-transparent border-0 cursor-pointer">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="py-14 text-center text-sm text-[#64748b]">Tidak ada berita yang cocok.</div>
          )}
        </section>
      </AdminGovernanceLayout>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-5">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer text-lg">x</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Judul Berita
                  <input
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Tanggal
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                    {NEWS_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Status
                  <select
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    {NEWS_STATUS.map((status) => (
                      <option key={status} value={status}>{status}</option>
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
                <img src={form.img || FALLBACK_IMAGE} alt="Preview berita" className="w-full h-44 object-cover" />
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
                  {isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
