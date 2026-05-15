export default function BendaharaSidebar({ navigate, active, sidebarGroups, onChangeActive }) {
  return (
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
                    onClick={() => onChangeActive(item.id)}
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
  )
}
