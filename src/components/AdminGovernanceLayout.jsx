function SidebarIcon({ name }) {
  const stroke = '#334155'
  const paths = {
    dashboard: <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />,
    berita: <path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5" />,
    program: <path d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />,
    keuangan: <path d="M4 7h16v10H4zM4 10h16M8 14h2" />,
    'master-data': <path d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm0 5v2m14-2v2M5 14v2m14-2v2M9 4v16m6-16v16" />,
    users: <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm13 10v-2a4 4 0 00-3-3.87" />,
    pengaturan: <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8 4l-2.1.7a7.7 7.7 0 01-.4 1l1.2 1.9-1.4 1.4-1.9-1.2a7.7 7.7 0 01-1 .4L14 20h-4l-.7-2.1a7.7 7.7 0 01-1-.4l-1.9 1.2-1.4-1.4 1.2-1.9a7.7 7.7 0 01-.4-1L4 12l2.1-.7a7.7 7.7 0 01.4-1L5.3 8.4 6.7 7l1.9 1.2a7.7 7.7 0 011-.4L10 5h4l.7 2.1a7.7 7.7 0 011 .4L17.3 6.3 18.7 7l-1.2 1.9c.16.32.29.66.4 1L20 12z" />,
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', page: 'admin-dashboard' },
  { id: 'berita', label: 'Berita', page: 'admin-berita' },
  { id: 'program', label: 'Program Kerja', page: 'admin-program' },
  { id: 'keuangan', label: 'Keuangan', page: 'bendahara' },
  { id: 'master-data', label: 'Master Data', page: 'admin-master-data' },
  { id: 'users', label: 'User/Role', page: 'admin-users' },
]

export default function AdminGovernanceLayout({
  navigate,
  activeItem = 'dashboard',
  title = 'Dashboard Admin',
  searchValue = '',
  onSearchChange,
  profileName = 'Admin Utama',
  profileRole = 'Super Admin',
  children,
}) {
  return (
    <div className="min-h-screen bg-[#eff1f6] flex">
      <aside className="w-[280px] bg-white border-r border-[#d9dee8] flex flex-col">
        <div className="px-5 py-8 border-b border-[#e8edf5]">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#0f4a8a] flex items-center justify-center text-white font-black">KT</div>
            <div>
              <h2 className="text-3xl font-bold text-[#0b3567] leading-none">Karang Taruna</h2>
              <p className="text-xs tracking-[.18em] text-[#8ea2bf] font-semibold mt-1">ADMIN GOVERNANCE</p>
            </div>
          </div>
        </div>

        <nav className="px-4 py-5 flex-1 space-y-1.5">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = item.id === activeItem
            return (
              <button
                key={item.id}
                onClick={() => item.page && navigate(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                  isActive
                    ? 'bg-[#d8e4f5] border-[#c5d7ef] text-[#0c3e79] font-semibold'
                    : 'bg-transparent border-transparent text-[#2f4563] hover:bg-[#edf2fa]'
                } ${item.page ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <SidebarIcon name={item.id} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="px-5 py-5 border-t border-[#e8edf5]">
          <button onClick={() => navigate('login')} className="text-[#334e70] font-medium text-sm hover:text-[#0f4a8a] bg-transparent border-0 cursor-pointer">
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[86px] bg-white border-b border-[#d9dee8] px-8 flex items-center justify-between gap-5">
          <h1 className="text-3xl font-semibold text-[#0f294f]">{title}</h1>

          <div className="flex-1 max-w-[620px]">
            <input
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Cari data, berita, atau anggota..."
              className="w-full h-12 rounded-xl bg-[#eef2f7] border border-[#e0e6f0] px-4 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#b3c9e9]"
            />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <button className="w-9 h-9 rounded-full border border-[#d9dee8] bg-white text-[#355275]">?</button>
            <div className="w-px h-9 bg-[#e3e8f1]" />
            <div className="text-right">
              <p className="font-semibold text-[#1f314a]">{profileName}</p>
              <p className="text-xs text-[#7d8ea6]">{profileRole}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#5f8bc6] to-[#254f89]" />
          </div>
        </header>

        <main className="p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
