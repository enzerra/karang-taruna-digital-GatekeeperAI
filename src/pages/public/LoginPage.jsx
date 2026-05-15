import { useState } from 'react'

const roles = [
  {
    value: 'admin',
    label: 'Admin',
    desc: 'Kelola berita, program, dan pengguna',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l7 4v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V7l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    value: 'bendahara',
    label: 'Bendahara',
    desc: 'Pantau transaksi dan laporan kas',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7h16v12H4z" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <path d="M8 13h8" />
      </svg>
    ),
  },
]

export default function LoginPage({ navigate }) {
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const selectedRole = roles.find(item => item.value === role)

  function handleLogin(e) {
    e.preventDefault()
    if (role === 'admin') navigate('admin-dashboard')
    else navigate('bendahara')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8fb] text-gray-900">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_20%_20%,rgba(26,58,107,0.18),transparent_32%),linear-gradient(135deg,#ffffff_0%,#eef5ff_58%,#eefdf7_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.03fr_0.97fr]">
          <section className="relative hidden min-h-[680px] bg-[#102847] p-10 text-white lg:block">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80"
              alt="Kegiatan Karang Taruna"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(11,31,58,0.96),rgba(26,58,107,0.72)_48%,rgba(6,95,70,0.54))]" />
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:44px_44px]" />

            <div className="relative flex h-full flex-col justify-between">
              <button
                onClick={() => navigate('home')}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Beranda
              </button>

              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-50 backdrop-blur">
                  Portal Desa
                </div>
                <h1 className="max-w-md text-5xl font-black leading-[1.04] tracking-tight">
                  Ruang kerja rapi untuk gerak pemuda desa.
                </h1>
                <p className="mt-5 max-w-md text-base leading-7 text-blue-50/85">
                  Masuk untuk mengelola program, publikasi, anggota, serta keuangan Karang Taruna dalam satu tempat.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  ['250+', 'Anggota'],
                  ['12', 'Program'],
                  ['2', 'Role aktif'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/16 bg-white/10 p-4 backdrop-blur">
                    <div className="text-2xl font-black">{value}</div>
                    <div className="mt-1 text-xs font-medium text-blue-50/75">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex min-h-screen items-center p-5 sm:p-8 lg:min-h-[680px] lg:p-12">
            <div className="mx-auto w-full max-w-md">
              <button
                onClick={() => navigate('home')}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-[#1a3a6b]/30 hover:text-[#1a3a6b] lg:hidden"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali
              </button>

              <div className="mb-9 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a3a6b] text-sm font-black text-white shadow-lg shadow-blue-900/20">
                  KT
                </span>
                <div>
                  <p className="text-base font-black tracking-tight text-gray-950">Karang Taruna</p>
                  <p className="text-sm text-gray-500">Portal Manajemen Desa</p>
                </div>
              </div>

              <div className="mb-7">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#1a3a6b]">Login Portal</p>
                <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">Selamat datang kembali</h2>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Pilih akses sesuai tanggung jawab Anda, lalu masuk untuk melanjutkan pekerjaan.
                </p>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {roles.map(item => {
                  const active = role === item.value
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRole(item.value)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? 'border-[#1a3a6b] bg-[#f0f6ff] shadow-[0_12px_30px_rgba(26,58,107,0.12)]'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-[#1a3a6b] text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <span className="block text-sm font-black text-gray-950">{item.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500">{item.desc}</span>
                    </button>
                  )
                })}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Email</span>
                  <div className="relative">
                    <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 6h16v12H4z" />
                      <path d="M4 7l8 6 8-6" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@karangtaruna.id"
                      required
                      className="h-[52px] w-full rounded-2xl border border-gray-200 bg-white px-11 py-3 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1a3a6b] focus:ring-4 focus:ring-[#1a3a6b]/10"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Password</span>
                  <div className="relative">
                    <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      required
                      className="h-[52px] w-full rounded-2xl border border-gray-200 bg-white px-11 py-3 pr-14 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1a3a6b] focus:ring-4 focus:ring-[#1a3a6b]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showPass ? (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 3.2 10 8a12.8 12.8 0 0 1-2.5 4.2" />
                          <path d="M6.2 6.2A12.4 12.4 0 0 0 2 12c1.5 4.8 5 8 10 8 1.4 0 2.7-.3 3.9-.8" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between gap-3 pt-1 text-sm">
                  <label className="flex items-center gap-2 font-medium text-gray-600">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1a3a6b] focus:ring-[#1a3a6b]" />
                    Ingat saya
                  </label>
                  <a href="#" className="font-bold text-[#1a3a6b] hover:text-[#152f58]">Lupa password?</a>
                </div>

                <button
                  type="submit"
                  className="group mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1a3a6b] px-5 py-3 text-sm font-black text-white shadow-[0_16px_32px_rgba(26,58,107,0.22)] transition hover:-translate-y-0.5 hover:bg-[#152f58] focus:outline-none focus:ring-4 focus:ring-[#1a3a6b]/20"
                >
                  Masuk sebagai {selectedRole.label}
                  <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </button>
              </form>

              <div className="mt-7 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs leading-5 text-gray-500">
                Belum punya akun?{' '}
                <a href="#" className="font-black text-[#1a3a6b] hover:text-[#152f58]">Hubungi Admin</a>
              </div>

              <p className="mt-6 text-center text-xs text-gray-400">
                © 2026 Karang Taruna Desa. Semua hak dilindungi.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
