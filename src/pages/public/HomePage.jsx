import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { PROGRAMS } from '../../data/portalData'
import { listNews } from '../../data/newsService'

export default function HomePage({ navigate }) {
  const [news, setNews] = useState([])
  const BADGE_STYLE = {
    AKTIF: { bg: '#dcfce7', color: '#166534' },
    MENDATANG: { bg: '#fef3c7', color: '#92400e' },
    SELESAI: { bg: '#e5e7eb', color: '#374151' },
  }

  useEffect(() => {
    const load = async () => {
      const data = await listNews()
      setNews(data)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar navigate={navigate} activePage="home" />

      {/* HERO */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1a3a6b] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-[#1a3a6b] rounded-full inline-block"></span>
              Organisasi Pemuda Desa
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Membangun Masa Depan Desa Bersama{' '}
              <span className="text-[#1a3a6b]">Karang Taruna</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Wadah pengembangan kreativitas, kepedulian sosial, dan kepemimpinan generasi muda untuk kemajuan desa kita.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('program')}
                className="bg-[#1a3a6b] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#152f58] transition-all shadow-lg border-0 cursor-pointer">
                Lihat Program
              </button>
              <button onClick={() => navigate('struktur')}
                className="border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-[#1a3a6b] hover:text-[#1a3a6b] transition-all bg-transparent cursor-pointer">
                Tentang Kami
              </button>
            </div>
            <div className="flex gap-8 mt-10 pt-8 border-t border-gray-100">
              {[['250+','Anggota Aktif'],['12+','Program Aktif'],['5th','Tahun Berdiri']].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-gray-900">{val}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl blur-2xl opacity-60"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80" alt="hero" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">👥</div>
              <div>
                <div className="text-xl font-bold text-gray-900">250+</div>
                <div className="text-xs text-gray-500">Anggota Aktif</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-lg">📅</div>
              <div>
                <div className="text-xl font-bold text-gray-900">12+</div>
                <div className="text-xs text-gray-500">Program Aktif</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BERITA */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Berita Terbaru</h2>
              <div className="w-12 h-1 bg-[#1a3a6b] rounded-full mt-2"></div>
            </div>
            <button onClick={() => navigate('berita')} className="text-sm text-[#1a3a6b] font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer hover:gap-2 transition-all">
              Lihat Semua <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.slice(0, 3).map(item => (
              <article key={item.id} onClick={() => navigate('berita-detail', item)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer">
                <div className="overflow-hidden h-48">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: item.catColor }}>{item.category}</span>
                  <h3 className="text-gray-900 font-bold text-base mt-2 mb-2 leading-snug">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">📅 {item.date}</span>
                    <span className="text-xs font-semibold text-[#1a3a6b]">Selengkapnya →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Program Kerja Unggulan</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Inisiatif strategis kami untuk menciptakan dampak positif bagi seluruh warga desa.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PROGRAMS.slice(0, 6).map(prog => (
              <div key={prog.id} className="rounded-2xl p-5 bg-white border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100">
                    <img src={prog.img} alt={prog.title} className="w-full h-full object-cover" />
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={BADGE_STYLE[prog.badge] ?? { bg: '#e5e7eb', color: '#374151' }}
                  >
                    {prog.badge}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{prog.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{prog.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => navigate('program')} className="border-2 border-[#1a3a6b] text-[#1a3a6b] font-semibold px-8 py-3 rounded-xl hover:bg-[#1a3a6b] hover:text-white transition-all bg-transparent cursor-pointer">
              Lihat Semua Program
            </button>
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl blur-xl opacity-70"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80" alt="tentang" className="w-full h-80 object-cover" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">Tentang Karang Taruna</h2>
            <p className="text-gray-500 leading-relaxed mb-6 text-sm">
              Karang Taruna Desa adalah organisasi sosial kemasyarakatan sebagai wadah pembinaan dan pengembangan generasi muda yang tumbuh atas dasar kesadaran dan rasa tanggung jawab sosial dari, oleh, dan untuk masyarakat.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {['Kemandirian', 'Gotong Royong', 'Inovasi', 'Kepemimpinan'].map(val => (
                <div key={val} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {val}
                </div>
              ))}
            </div>
            <button onClick={() => navigate('struktur')} className="bg-[#1a3a6b] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#152f58] transition-all border-0 cursor-pointer">
              Lihat Struktur Organisasi
            </button>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  )
}
