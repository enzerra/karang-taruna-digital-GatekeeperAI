import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { STRUCTURE } from '../../data/portalData'

const LEADER_COLORS = {
  Ketua: { bg: '#1a3a6b', light: '#eff6ff' },
  'Wakil Ketua': { bg: '#065f46', light: '#d1fae5' },
  Sekretaris: { bg: '#7c3aed', light: '#f5f3ff' },
  Bendahara: { bg: '#b45309', light: '#fef3c7' },
}

function LeaderCard({ member }) {
  const colors = LEADER_COLORS[member.role] || { bg: '#1a3a6b', light: '#eff6ff' }
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg"
        style={{ background: colors.bg }}>
        {member.name.charAt(0)}
      </div>
      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: colors.light, color: colors.bg }}>
        {member.role}
      </span>
      <h3 className="font-bold text-gray-900 mt-3 mb-1">{member.name}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
    </div>
  )
}

export default function StrukturPage({ navigate }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar navigate={navigate} activePage="struktur" />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Struktur Organisasi</h1>
            <div className="w-12 h-1 bg-[#1a3a6b] rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Susunan kepengurusan Karang Taruna Desa periode 2024.</p>
          </div>

          {/* Ketua - center */}
          <div className="max-w-xs mx-auto mb-6">
            <LeaderCard member={STRUCTURE.ketua} />
          </div>

          {/* Wakil */}
          <div className="max-w-xs mx-auto mb-6">
            <LeaderCard member={STRUCTURE.wakil} />
          </div>

          {/* Sekretaris & Bendahara */}
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto mb-10">
            <LeaderCard member={STRUCTURE.sekretaris} />
            <LeaderCard member={STRUCTURE.bendahara} />
          </div>

          {/* Anggota */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-5 text-center">Anggota Inti</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {STRUCTURE.anggota.map(m => (
                <div key={m.name} className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#1a3a6b] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.role}</div>
                    <div className="text-[10px] text-blue-600 font-semibold mt-0.5">{m.divisi}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}
