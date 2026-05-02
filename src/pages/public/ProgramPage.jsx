import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { PROGRAMS } from '../../data/portalData'

export default function ProgramPage({ navigate }) {
  const [filter, setFilter] = useState('Semua')
  const filtered = filter === 'Semua' ? PROGRAMS : PROGRAMS.filter(p => p.badge === filter)

  const counts = {
    total: PROGRAMS.length,
    aktif: PROGRAMS.filter(p => p.badge === 'AKTIF').length,
    mendatang: PROGRAMS.filter(p => p.badge === 'MENDATANG').length,
    selesai: PROGRAMS.filter(p => p.badge === 'SELESAI').length,
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar navigate={navigate} activePage="program" />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Program Kerja</h1>
            <div className="w-12 h-1 bg-[#1a3a6b] rounded-full mb-4"></div>
            <p className="text-gray-500">Daftar program prioritas Karang Taruna untuk pemberdayaan masyarakat desa.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Program', val: counts.total, color: '#1a3a6b', bg: '#eff6ff' },
              { label: 'Aktif', val: counts.aktif, color: '#065f46', bg: '#d1fae5' },
              { label: 'Mendatang', val: counts.mendatang, color: '#92400e', bg: '#fef3c7' },
              { label: 'Selesai', val: counts.selesai, color: '#475569', bg: '#f1f5f9' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: s.bg }}>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs font-semibold text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['Semua', 'AKTIF', 'MENDATANG', 'SELESAI'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${filter === f ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a3a6b]'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {filtered.map(prog => (
              <div key={prog.id} style={{ background: prog.bg }} className="rounded-2xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ background: prog.iconBg }}>
                    <img src={prog.img} alt={prog.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: prog.badgeBg, color: prog.badgeColor }}>{prog.badge}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{prog.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{prog.desc}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>📅</span>
                  <span>{prog.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}
