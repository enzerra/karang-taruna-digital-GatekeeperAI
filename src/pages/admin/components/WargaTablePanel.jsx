import { useEffect, useState } from 'react'
import { listWarga } from '../../../services/admin/wargaService.js'

export default function WargaTablePanel({ refreshKey }) {
  const [warga, setWarga] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await listWarga()
        setWarga(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [refreshKey])

  const filteredWarga = warga.filter((item) => {
    if (!search) return true
    const s = search.toLowerCase()
    return Object.values(item).some(val => String(val).toLowerCase().includes(s))
  })

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Database Warga</h2>
          <p className="text-sm text-gray-500">{warga.length} data tersimpan</p>
        </div>
        <input 
          type="text" 
          placeholder="Cari data..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                {warga.length > 0 && Object.keys(warga[0]).filter(k => k !== 'id' && k !== 'created_at').map(key => (
                  <th key={key} className="px-4 py-3 font-medium capitalize">{key.replace(/_/g, ' ')}</th>
                ))}
                <th className="px-4 py-3 font-medium">Ditambahkan Pada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWarga.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">#{item.id}</td>
                  {Object.keys(item).filter(k => k !== 'id' && k !== 'created_at').map(k => (
                    <td key={k} className="px-4 py-3 text-gray-800">{item[k]}</td>
                  ))}
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-'}
                  </td>
                </tr>
              ))}
              {filteredWarga.length === 0 && (
                <tr>
                  <td colSpan="100%" className="px-4 py-10 text-center text-gray-500">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
