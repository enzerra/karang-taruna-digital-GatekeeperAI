export default function BendaharaSidebar({ navigate, active, sidebarGroups, onChangeActive }) {
  return (
    <aside className="w-[260px] bg-[#fdfdfd] border-r border-gray-200 flex flex-col">
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0f4a8a] flex items-center justify-center text-white font-bold text-sm shadow-sm">KT</div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-none">Keuangan Desa</h2>
            <p className="text-[10px] tracking-widest text-gray-500 font-semibold mt-1">BENDAHARA</p>
          </div>
        </div>
      </div>

      <nav className="px-3 py-6 flex-1 space-y-6 overflow-y-auto">
        {sidebarGroups.map((group, idx) => (
          <div key={idx}>
            {group.title && <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">{group.title}</p>}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = active === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onChangeActive(item.id)}
                    className={`w-full px-3 py-2 rounded-md text-left transition-colors text-sm flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-50 text-[#0f4a8a] font-medium'
                        : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    } cursor-pointer border-0`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Alat Pintar</p>
        <button
          onClick={() => navigate('import-data')}
          className="w-full px-3 py-2 rounded-md border border-gray-200 text-left transition-colors bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 text-sm flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0f4a8a]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm3 2a1 1 0 000 2h8a1 1 0 100-2H6zm0 4a1 1 0 100 2h4a1 1 0 100-2H6zm0 4a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Impor Data Pintar
        </button>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button onClick={() => navigate('login')} className="w-full text-left text-gray-500 font-medium text-sm hover:text-gray-900 bg-transparent border-0 cursor-pointer flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  )
}
