import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getStatusStyle } from '../../data/programStore'
import { findProgramById, listPrograms } from '../../data/programService'

export default function ProgramDetailPage({ navigate, item }) {
  const [program, setProgram] = useState(null)
  const [related, setRelated] = useState([])

  useEffect(() => {
    const load = async () => {
      const selected = await findProgramById(item?.id)
      const all = await listPrograms()
      const fallback = selected ?? all[0] ?? null
      setProgram(fallback)
      setRelated(all.filter((entry) => entry.id !== fallback?.id).slice(0, 3))
    }
    load()
  }, [item?.id])

  if (!program) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar navigate={navigate} activePage="program" />
        <div className="pt-28 pb-20 px-6">
          <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Program tidak ditemukan</h1>
            <button onClick={() => navigate('program')} className="px-5 py-2.5 rounded-xl bg-[#1a3a6b] text-white font-semibold border-0 cursor-pointer">
              Kembali ke Program
            </button>
          </div>
        </div>
        <Footer navigate={navigate} />
      </div>
    )
  }

  const status = getStatusStyle(program.badge)

  return (
    <div className="min-h-screen bg-white">
      <Navbar navigate={navigate} activePage="program" />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-7">
            <button onClick={() => navigate('home')} className="hover:text-[#1a3a6b] bg-transparent border-0 cursor-pointer text-gray-400">Home</button>
            <span>/</span>
            <button onClick={() => navigate('program')} className="hover:text-[#1a3a6b] bg-transparent border-0 cursor-pointer text-gray-400">Program</button>
            <span>/</span>
            <span className="text-gray-600 font-medium">Detail</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0b2c63]">{program.category}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: status.bg, color: status.text }}>
                  {program.badge === 'MENDATANG' ? 'Mendatang' : program.badge.charAt(0) + program.badge.slice(1).toLowerCase()}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{program.title}</h1>
              <p className="text-sm text-gray-500 mb-6">Periode: {program.period}</p>

              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md mb-6">
                <img src={program.img} alt={program.title} className="w-full h-80 object-cover" />
              </div>

              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>{program.desc}</p>
                <p>
                  Program ini dirancang untuk meningkatkan partisipasi pemuda desa, memperkuat kolaborasi lintas komunitas, serta
                  memastikan dampak sosial yang terukur bagi warga.
                </p>
                <p>
                  Implementasi dilakukan bersama pengurus Karang Taruna, tokoh masyarakat, dan mitra lokal dengan pendekatan
                  keberlanjutan agar manfaatnya dapat dirasakan dalam jangka panjang.
                </p>
              </div>

              <button
                onClick={() => navigate('program')}
                className="mt-7 px-5 py-2.5 rounded-xl bg-[#1a3a6b] hover:bg-[#152f58] transition-colors text-white font-semibold border-0 cursor-pointer"
              >
                Kembali ke Daftar Program
              </button>
            </div>

            <aside>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Program Lainnya</h3>
              <div className="space-y-3">
                {related.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => navigate('program-detail', { id: entry.id })}
                    className="w-full text-left bg-white border border-gray-200 rounded-xl p-3 hover:border-[#1a3a6b]/30 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <img src={entry.img} alt={entry.title} className="w-20 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{entry.category}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-1 leading-snug">{entry.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{entry.period}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}
