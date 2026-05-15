import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { NEWS_CATEGORIES } from '../../data/newsStore'
import { listNews } from '../../data/newsService'

const CATS = ['Semua', ...NEWS_CATEGORIES]

export default function BeritaPage({ navigate }) {
  const [news, setNews] = useState([])
  const [cat, setCat] = useState('Semua')

  useEffect(() => {
    const load = async () => {
      const data = await listNews()
      setNews(data)
    }
    load()

    const syncNews = async () => {
      const data = await listNews()
      setNews(data)
    }
    window.addEventListener('storage', syncNews)
    return () => window.removeEventListener('storage', syncNews)
  }, [])

  const filtered = useMemo(() => (
    cat === 'Semua' ? news : news.filter((item) => item.category === cat)
  ), [cat, news])

  return (
    <div className="min-h-screen bg-white">
      <Navbar navigate={navigate} activePage="berita" />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Berita Karang Taruna</h1>
            <div className="w-12 h-1 bg-[#1a3a6b] rounded-full mb-4"></div>
            <p className="text-gray-500">Publikasi kegiatan terbaru, pembinaan pemuda, dan aksi sosial desa.</p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${cat === c ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a3a6b] hover:text-[#1a3a6b]'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map(item => (
              <article key={item.id} onClick={() => navigate('berita-detail', item)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer">
                <div className="overflow-hidden h-48">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: item.catColor }}>{item.category}</span>
                  <h3 className="text-gray-900 font-bold text-base mt-2 mb-2 leading-snug">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">📅 {item.date}</span>
                    <span className="text-xs font-semibold text-[#1a3a6b]">Baca →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p>Tidak ada berita untuk kategori ini.</p>
            </div>
          )}
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}
