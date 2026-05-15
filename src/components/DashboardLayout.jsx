const MENU_ICONS = {
  'admin-dashboard': '📊',
  'admin-berita': '📰',
  'admin-users': '👥',
  'bendahara': '💰',
  'home': '🌐',
}

export default function DashboardLayout({ navigate, activePage, menu, title, subtitle, toolbar, children, userName, userRole }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col" style={{ background: 'linear-gradient(180deg,#0f172a 0%,#1e293b 100%)' }}>
        <div className="p-5">
          <button onClick={() => navigate('home')} className="flex items-center gap-2.5 mb-1 bg-transparent border-0 cursor-pointer">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>KT</span>
            <span className="text-white font-extrabold text-sm">Karang Taruna</span>
          </button>
          <p className="text-slate-500 text-xs ml-11">Smart Management</p>
        </div>

        <nav className="px-3 flex-1">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-2 mt-2">Menu</p>
          {menu.map(item => (
            <button key={item.page} onClick={() => navigate(item.page)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold mb-1 border-0 cursor-pointer transition-all text-left ${activePage === item.page ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              style={activePage === item.page ? { background: '#2563eb', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' } : { background: 'transparent' }}>
              <span className="w-5 text-center">{MENU_ICONS[item.page] ?? '•'}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
              {(userName ?? 'A').charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">{userName ?? 'Admin'}</div>
              <div className="text-slate-500" style={{ fontSize: 10 }}>{userRole ?? 'Administrator'}</div>
            </div>
          </div>
          <button
            onClick={() => navigate('login')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all text-slate-400 hover:text-white"
            style={{ background: 'rgba(239,68,68,0.1)' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">{toolbar}</div>
        </div>
        {children}
      </main>
    </div>
  )
}
