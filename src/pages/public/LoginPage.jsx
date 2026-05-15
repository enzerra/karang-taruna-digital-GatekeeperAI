import { useState } from 'react'

export default function LoginPage({ navigate }) {
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  function handleLogin(e) {
    e.preventDefault()
    if (role === 'admin') navigate('admin-dashboard')
    else navigate('bendahara')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a3a6b] mb-8 bg-transparent border-0 cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Beranda
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black" style={{ background: '#1a3a6b' }}>KT</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">Karang Taruna</p>
              <p className="text-xs text-gray-400">Portal Manajemen Desa</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Masuk ke Akun</h1>
          <p className="text-gray-500 text-sm mb-6">Pilih peran dan masukkan kredensial Anda</p>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            {[
              { value: 'admin', label: '👑 Admin' },
              { value: 'bendahara', label: '💰 Bendahara' },
            ].map(r => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className="flex-1 py-2 text-sm font-semibold rounded-lg border-0 cursor-pointer transition-all"
                style={{
                  background: role === r.value ? '#1a3a6b' : 'transparent',
                  color: role === r.value ? 'white' : '#64748b',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@karangtaruna.id"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#1a3a6b] focus:ring-2 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#1a3a6b] focus:ring-2 focus:ring-blue-50 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Ingat saya
              </label>
              <a href="#" className="text-[#1a3a6b] font-medium hover:underline">Lupa password?</a>
            </div>

            <button
              type="submit"
              className="w-full text-white font-semibold py-3 rounded-xl border-0 cursor-pointer transition-all mt-2 text-sm"
              style={{ background: '#1a3a6b' }}
              onMouseOver={e => e.currentTarget.style.background = '#152f58'}
              onMouseOut={e => e.currentTarget.style.background = '#1a3a6b'}
            >
              Masuk sebagai {role === 'admin' ? 'Admin' : 'Bendahara'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Belum punya akun?{' '}
            <a href="#" className="text-[#1a3a6b] font-semibold hover:underline">Hubungi Admin</a>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 Karang Taruna Desa. Semua hak dilindungi.
        </p>
      </div>
    </div>
  )
}
