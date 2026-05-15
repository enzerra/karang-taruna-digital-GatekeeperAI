import { useState } from 'react'

const LINKS = [
  { label: 'Home', page: 'home' },
  { label: 'Berita', page: 'berita' },
  { label: 'Program', page: 'program' },
  { label: 'Struktur', page: 'struktur' },
]

export default function Navbar({ navigate, activePage }) {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <button onClick={() => navigate('home')} className="flex items-center gap-2 font-bold text-gray-900 text-xl tracking-tight border-0 bg-transparent cursor-pointer">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: '#1a3a6b' }}>KT</span>
          Karang Taruna
        </button>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <button key={l.page} onClick={() => navigate(l.page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors ${activePage === l.page ? 'font-semibold' : 'text-gray-600 bg-transparent hover:bg-gray-50'}`}
              style={activePage === l.page ? { background: '#eff6ff', color: '#1a3a6b' } : {}}>
              {l.label}
            </button>
          ))}
        </div>

        <button onClick={() => navigate('login')}
          className="hidden md:block text-white text-sm font-semibold px-5 py-2 rounded-lg border-0 cursor-pointer transition-colors"
          style={{ background: '#1a3a6b' }}
          onMouseOver={e => e.currentTarget.style.background = '#152f58'}
          onMouseOut={e => e.currentTarget.style.background = '#1a3a6b'}>
          Login
        </button>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 border-0 bg-transparent cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-2">
          {LINKS.map(l => (
            <button key={l.page} onClick={() => { navigate(l.page); setOpen(false) }}
              className="text-gray-700 text-sm font-medium py-2 text-left border-0 bg-transparent cursor-pointer">
              {l.label}
            </button>
          ))}
          <button onClick={() => navigate('login')}
            className="mt-2 text-white text-sm font-semibold px-5 py-2 rounded-lg border-0 cursor-pointer"
            style={{ background: '#1a3a6b' }}>
            Login
          </button>
        </div>
      )}
    </nav>
  )
}
