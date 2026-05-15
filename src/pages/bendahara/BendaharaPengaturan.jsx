export default function BendaharaPengaturan({ navigate }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#102f57] mb-4">Profil user</h2>
        <p className="text-sm text-[#556987]">Nama: Bendahara</p>
        <p className="text-sm text-[#556987] mt-1">Role: Keuangan</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#e2e7f0] p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#102f57] mb-4">Pengaturan sistem</h2>
        <button onClick={() => navigate('login')} className="h-10 px-4 rounded-xl bg-[#0f4a8a] text-white font-semibold border-0 cursor-pointer hover:bg-[#0c3e76]">
          Logout
        </button>
        <p className="text-xs text-[#8b9cb5] mt-3">Area ini bisa diisi setting tambahan saat integrasi BE.</p>
      </div>
    </div>
  )
}
