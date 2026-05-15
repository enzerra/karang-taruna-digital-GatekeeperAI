import { useEffect, useMemo, useState } from 'react'
import AdminGovernanceLayout from '../../components/AdminGovernanceLayout'
import { getRoleStyle, USER_ROLES, USER_STATUS } from '../../data/userStore'
import { createUser, listUsers, removeUser, updateUser } from '../../data/userService'

const EMPTY_FORM = {
  name: '',
  email: '',
  role: USER_ROLES[2],
  status: USER_STATUS[0],
  lastLogin: '',
}

function formatRoleLabel(role) {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function AdminUsers({ navigate }) {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Semua')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const data = await listUsers()
      setUsers(data)
      setIsLoading(false)
    }
    load()
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase()
    const bySearch = users.filter((item) => (
      item.name.toLowerCase().includes(keyword) ||
      item.email.toLowerCase().includes(keyword) ||
      item.role.toLowerCase().includes(keyword)
    ))

    if (roleFilter === 'Semua') return bySearch
    return bySearch.filter((item) => item.role === roleFilter)
  }, [users, search, roleFilter])

  const counts = useMemo(() => ({
    admin: users.filter((item) => item.role === 'admin').length,
    bendahara: users.filter((item) => item.role === 'bendahara').length,
    anggota: users.filter((item) => item.role === 'anggota').length,
  }), [users])

  async function reloadUsers() {
    const data = await listUsers()
    setUsers(data)
  }

  function openCreateModal() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrorMessage('')
    setInfoMessage('')
    setIsModalOpen(true)
  }

  function openEditModal(user) {
    setEditingId(user.id)
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin,
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

    if (!form.name.trim() || !form.email.trim()) {
      setErrorMessage('Nama dan email wajib diisi.')
      return
    }

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      status: form.status,
      lastLogin: form.lastLogin || '-',
    }

    try {
      setIsSaving(true)
      if (editingId) {
        await updateUser(editingId, payload)
        setInfoMessage('Pengguna berhasil diperbarui.')
      } else {
        await createUser(payload)
        setInfoMessage('Pengguna berhasil ditambahkan.')
      }
      await reloadUsers()
      closeModal()
    } catch {
      setErrorMessage('Terjadi kendala saat menyimpan data pengguna.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id) {
    const selected = users.find((item) => item.id === id)
    if (!selected) return

    const approved = window.confirm(`Hapus pengguna \"${selected.name}\"?`)
    if (!approved) return

    try {
      await removeUser(id)
      await reloadUsers()
      setInfoMessage('Pengguna berhasil dihapus.')
    } catch {
      setInfoMessage('Gagal menghapus pengguna.')
    }
  }

  return (
    <>
      <AdminGovernanceLayout
        navigate={navigate}
        activeItem="users"
        title="User & Role"
        searchValue={search}
        onSearchChange={setSearch}
        profileName="Admin Utama"
        profileRole="Super Admin"
      >
        {infoMessage && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{infoMessage}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {Object.entries(counts).map(([role, count]) => {
            const style = getRoleStyle(role)
            return (
              <div key={role} className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black" style={{ background: style.color }}>{style.icon}</div>
                <div>
                  <p className="text-sm text-[#4a5f7e] mb-1">{formatRoleLabel(role)}</p>
                  <p className="text-4xl font-bold leading-tight" style={{ color: style.color }}>{count}</p>
                </div>
              </div>
            )
          })}
        </div>

        <section className="bg-white rounded-2xl border border-[#e2e7f0] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[#e8edf5] flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-4xl font-semibold text-[#102f57]">Manajemen Pengguna</h2>
              <p className="text-sm text-[#6b7f9b] mt-1">{users.length} pengguna terdaftar</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="h-10 px-3 text-sm rounded-xl border border-[#d9dee8] bg-white text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#b3c9e9]"
              >
                <option value="Semua">Semua Role</option>
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>{formatRoleLabel(role)}</option>
                ))}
              </select>
              <button
                onClick={openCreateModal}
                className="h-10 bg-[#0f4a8a] text-white font-semibold px-4 rounded-xl border-0 cursor-pointer hover:bg-[#0c3e76]"
              >
                + Tambah User
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-[#64748b]">Memuat data pengguna...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f4f7fb] border-b border-[#e8edf5] text-[#5b6f8d]">
                    {['Pengguna', 'Email', 'Role', 'Status', 'Login Terakhir', 'Aksi'].map((heading) => (
                      <th key={heading} className="px-5 py-3 text-left text-xs tracking-wider uppercase">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const style = getRoleStyle(user.role)
                    return (
                      <tr key={user.id} className="border-b border-[#edf1f7]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
                              {user.name.charAt(0)}
                            </div>
                            <span className="text-[#111827] font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#556987] text-xs">{user.email}</td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ background: style.bg, color: style.color }}>
                            {style.icon} {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${user.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#556987] text-xs">{user.lastLogin}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <button onClick={() => openEditModal(user)} className="text-[#6e8098] hover:text-[#0f4a8a] bg-transparent border-0 cursor-pointer">Edit</button>
                            <button onClick={() => handleDelete(user.id)} className="text-[#6e8098] hover:text-red-600 bg-transparent border-0 cursor-pointer">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredUsers.length === 0 && (
            <div className="py-14 text-center text-sm text-[#64748b]">Tidak ada user yang cocok.</div>
          )}
        </section>
      </AdminGovernanceLayout>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-5">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit User' : 'Tambah User Baru'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer text-lg">x</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Nama Lengkap
                  <input
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Role
                  <select
                    value={form.role}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    {USER_ROLES.map((role) => (
                      <option key={role} value={role}>{formatRoleLabel(role)}</option>
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
                    {USER_STATUS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Login Terakhir
                  <input
                    value={form.lastLogin}
                    onChange={(event) => setForm((prev) => ({ ...prev, lastLogin: event.target.value }))}
                    placeholder="Contoh: 2 Mei 2026, 09:15"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
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
                  {isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
