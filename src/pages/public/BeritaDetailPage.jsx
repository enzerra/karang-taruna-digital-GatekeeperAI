import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { listNews } from '../../services/news/newsService'

export default function BeritaDetailPage({ navigate, item }) {
  const [article, setArticle] = useState(item ?? null)
  const [related, setRelated] = useState([])

  useEffect(() => {
    const load = async () => {
      const allNews = await listNews()
      const selected = item
        ? allNews.find((newsItem) => newsItem.id === Number(item.id)) ?? item
        : allNews[0] ?? null
      setArticle(selected)
      setRelated(allNews.filter((newsItem) => newsItem.id !== selected?.id).slice(0, 2))
    }
    load()
  }, [item])

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar navigate={navigate} activePage="berita" />
        <div className="pt-24 pb-20 px-6">
          <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Berita belum tersedia</h1>
            <button onClick={() => navigate('berita')} className="mt-4 bg-[#1a3a6b] text-white font-semibold px-6 py-2.5 rounded-xl border-0 cursor-pointer">
              Kembali ke Berita
            </button>
          </div>
        </div>
        <Footer navigate={navigate} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar navigate={navigate} activePage="berita" />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <button onClick={() => navigate('home')} className="hover:text-[#1a3a6b] bg-transparent border-0 cursor-pointer text-gray-400">Home</button>
            <span>/</span>
            <button onClick={() => navigate('berita')} className="hover:text-[#1a3a6b] bg-transparent border-0 cursor-pointer text-gray-400">Berita</button>
            <span>/</span>
            <span className="text-gray-600 font-medium">Detail</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Artikel */}
            <div className="md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: article.catColor }}>{article.category}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3 leading-tight">{article.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                <span>📅 {article.date}</span>
                <span>✍️ Admin Desa</span>
                <span>👁️ 1.2k views</span>
              </div>
              <div className="rounded-2xl overflow-hidden mb-6 shadow-md">
                <img src={article.img} alt={article.title} className="w-full h-72 object-cover" />
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">{article.desc}</p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Karang Taruna terus memperkuat kapasitas pemuda desa melalui program berbasis kebutuhan lokal. Setiap kegiatan dirancang partisipatif, melibatkan masyarakat, dan terdokumentasi secara transparan untuk memastikan akuntabilitas.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Selain dampak sosial, program juga mendorong penguatan ekonomi lokal. Kolaborasi dengan pelaku UMKM, sekolah, dan pemerintah desa menjadi kunci keberlanjutan kegiatan jangka panjang yang berdampak nyata bagi masyarakat.
                </p>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => navigate('berita')} className="bg-[#1a3a6b] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#152f58] transition-all border-0 cursor-pointer">
                  ← Kembali
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Berita Terkait</h4>
              <div className="flex flex-col gap-4">
                {related.map(n => (
                  <div key={n.id} onClick={() => navigate('berita-detail', n)}
                    className="flex gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                    <img src={n.img} alt={n.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase" style={{ color: n.catColor }}>{n.category}</span>
                      <p className="text-sm font-semibold text-gray-800 leading-snug mt-0.5 group-hover:text-[#1a3a6b] transition-colors">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}
