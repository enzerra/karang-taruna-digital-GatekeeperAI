import { useState } from 'react'

export default function Footer({ navigate }) {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: '#1a3a6b' }}>KT</span>
            <h3 className="text-white font-bold text-lg">Karang Taruna</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">Organisasi pemuda desa yang berfokus pada pemberdayaan, sosial, dan inovasi kemasyarakatan.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Navigasi</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {[['Home','home'],['Berita','berita'],['Program','program'],['Struktur','struktur']].map(([label, page]) => (
              <li key={page}>
                <button onClick={() => navigate(page)} className="hover:text-white transition-colors bg-transparent border-0 text-gray-400 cursor-pointer text-sm">{label}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Kontak</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2"><span>📍</span><span>Jl. Pemuda No. 12, Balai Desa Lt. 2, Jawa Tengah</span></li>
            <li className="flex items-center gap-2"><span>✉️</span><span>kontak@karangtarunadesa.id</span></li>
            <li className="flex items-center gap-2"><span>📞</span><span>+62 812-3456-7890</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Langganan Berita</h4>
          <p className="text-gray-400 text-xs mb-4">Dapatkan update program terbaru langsung ke email Anda.</p>
          <div className="flex gap-2">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Anda"
              className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg outline-none border border-gray-700 focus:border-blue-500 transition-colors placeholder-gray-500 min-w-0" />
            <button className="text-white p-2 rounded-lg border-0 cursor-pointer transition-colors" style={{ background: '#1a3a6b' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-6 text-center">
        <p className="text-gray-500 text-xs">© 2024 Karang Taruna Desa. Membangun Bersama Pemuda.</p>
      </div>
    </footer>
  )
}
