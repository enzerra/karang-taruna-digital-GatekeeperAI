import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/Navbar'
import { getCategoryColor, getStatusStyle } from '../../services/programs/programStore'
import { listPrograms } from '../../services/programs/programService'

const FILTERS = ['Semua', 'AKTIF', 'SELESAI', 'MENDATANG']

export default function ProgramPage({ navigate }) {
  const [programs, setPrograms] = useState([])
  const [filter, setFilter] = useState('Semua')

  useEffect(() => {
    const load = async () => {
      const data = await listPrograms()
      setPrograms(data)
    }
    load()

    const syncPrograms = async () => {
      const data = await listPrograms()
      setPrograms(data)
    }
    window.addEventListener('storage', syncPrograms)
    return () => window.removeEventListener('storage', syncPrograms)
  }, [])

  const filteredPrograms = useMemo(() => {
    if (filter === 'Semua') return programs
    return programs.filter((item) => item.badge === filter)
  }, [filter, programs])

  const stats = useMemo(() => {
    const total = programs.length
    const aktif = programs.filter((item) => item.badge === 'AKTIF').length
    const selesai = programs.filter((item) => item.badge === 'SELESAI').length
    return { total, aktif, selesai }
  }, [programs])

  return (
    <div className="min-h-screen bg-[#f1f3f7]">
      <Navbar navigate={navigate} activePage="program" />

      <section className="pt-24 pb-12 px-6 bg-[#f8f8f9] border-b border-gray-200">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#0b2c63] leading-tight mb-5">Program Kerja Karang Taruna</h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
              Mewujudkan kepemudaan yang aktif, kreatif, dan solutif melalui berbagai inisiatif pemberdayaan masyarakat, bakti sosial, dan pengembangan potensi ekonomi lokal di desa kami.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-[#d8dce6]">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80"
              alt="Rapat program kerja"
              className="w-full h-[320px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { label: 'Total Program', value: stats.total, bg: '#e6eefb' },
              { label: 'Program Aktif', value: stats.aktif, bg: '#d9fbe8' },
              { label: 'Program Selesai', value: stats.selesai, bg: '#eceef2' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: item.bg }}>
                  <div className="w-6 h-6 rounded-lg bg-white border border-gray-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                  <p className="text-4xl font-bold text-[#0f172a] leading-none mt-1">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-4xl font-bold text-[#0f2857]">Daftar Program Kerja</h2>
            <div className="bg-[#dcdfe7] rounded-xl p-1.5 flex gap-1.5">
              {FILTERS.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold border-0 cursor-pointer transition-all ${
                    filter === item ? 'bg-white text-[#0b2c63] shadow-sm' : 'bg-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {item === 'Semua' ? 'Semua' : item.charAt(0) + item.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPrograms.map((program) => {
              const status = getStatusStyle(program.badge)
              return (
                <article key={program.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <img src={program.img} alt={program.title} className="w-full h-full object-cover" />
                    <span
                      className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: status.bg, color: status.text }}
                    >
                      {program.badge === 'MENDATANG' ? 'Mendatang' : program.badge.charAt(0) + program.badge.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: getCategoryColor(program.category) }}>
                      {program.category}
                    </p>
                    <h3
                      className="text-2xl font-bold text-[#0f2857] leading-snug mb-2 min-h-[64px]"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {program.title}
                    </h3>
                    <p
                      className="text-base text-gray-600 leading-relaxed min-h-[72px]"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {program.desc}
                    </p>

                    <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm bg-gray-400" />
                      {program.period}
                    </div>

                    <button
                      onClick={() => navigate('program-detail', { id: program.id })}
                      className="mt-auto pt-4 w-full py-2.5 rounded-xl font-semibold text-sm border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-colors bg-white cursor-pointer"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center text-gray-500 mt-6">
              Belum ada program pada filter ini.
            </div>
          )}
        </div>
      </section>

      <footer className="bg-[#f7f8fb] border-t border-gray-200 mt-10 px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-sm text-gray-600">
          <div>
            <h3 className="text-[#0b2c63] font-bold text-2xl mb-3">Karang Taruna Desa</h3>
            <p className="leading-relaxed">
              Jl. Pemuda No. 45, Desa Kemajuan, Kecamatan Harapan, Kabupaten Sejahtera, 12345.
            </p>
            <p className="mt-2">+62 812 3456 7890</p>
            <p>info@karangtarunadesa.id</p>
          </div>

          <div>
            <h4 className="text-[#0b2c63] font-semibold mb-3">Navigasi</h4>
            <div className="space-y-2">
              <button onClick={() => navigate('home')} className="block bg-transparent border-0 text-gray-600 hover:text-[#0b2c63] cursor-pointer p-0">
                Beranda
              </button>
              <button onClick={() => navigate('program')} className="block bg-transparent border-0 text-[#0b2c63] font-semibold cursor-pointer p-0">
                Program Kerja
              </button>
              <button onClick={() => navigate('berita')} className="block bg-transparent border-0 text-gray-600 hover:text-[#0b2c63] cursor-pointer p-0">
                Berita Desa
              </button>
              <button onClick={() => navigate('struktur')} className="block bg-transparent border-0 text-gray-600 hover:text-[#0b2c63] cursor-pointer p-0">
                Struktur Organisasi
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[#0b2c63] font-semibold mb-3">Ikuti Kami</h4>
            <p className="leading-relaxed">
              Karang Taruna Desa. Mewujudkan pemuda mandiri dan berdaya melalui program yang berkelanjutan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
