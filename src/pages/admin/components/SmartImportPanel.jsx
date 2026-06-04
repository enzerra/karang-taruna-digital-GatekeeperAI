import { useState } from 'react'
import { uploadForCleansing } from '../../../services/admin/cleansingService.js'
import { bulkImportWarga } from '../../../services/admin/wargaService.js'

export default function SmartImportPanel({ onImportSuccess }) {
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) return
    try {
      setIsProcessing(true)
      setError('')
      const data = await uploadForCleansing(file)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadCSV = () => {
    if (!result || !result.full_data) return
    const keys = Object.keys(result.full_data[0])
    const csvContent = [
      keys.join(','),
      ...result.full_data.map(row => keys.map(k => `"${row[k]}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'data_warga_bersih.csv')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  const handleConfirmImport = async () => {
    try {
      setIsImporting(true)
      await bulkImportWarga(result.full_data)
      setShowConfirm(false)
      setResult(null)
      setFile(null)
      if (onImportSuccess) onImportSuccess()
    } catch (err) {
      setError('Gagal import ke database: ' + err.message)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center border-dashed border-2">
        <div className="text-center mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4 flex text-sm text-gray-600 justify-center">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <span>Upload CSV / Excel</span>
              <input type="file" className="sr-only" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />
            </label>
            <p className="pl-1">data mentah warga</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">{file ? `File terpilih: ${file.name}` : 'Maksimal 10MB'}</p>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || isProcessing}
          className="mt-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 border-0 cursor-pointer"
        >
          {isProcessing ? 'AI Sedang Membersihkan...' : '✨ Mulai Pembersihan'}
        </button>
      </div>

      {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-600 font-medium">Total Data Awal</p>
              <p className="text-2xl font-bold text-blue-900">{result.laporan_eda?.total_data_awal}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-600 font-medium">Total Data Bersih</p>
              <p className="text-2xl font-bold text-emerald-900">{result.laporan_eda?.total_data_bersih}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <p className="text-sm text-orange-600 font-medium">Duplikat Dihapus</p>
              <p className="text-2xl font-bold text-orange-900">{result.laporan_eda?.jumlah_duplikat_dihapus}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Preview Sebelum (Mentah)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {Object.keys(result.data_preview_raw[0] || {}).map((key) => (
                      <th key={key} className="px-4 py-2 font-medium">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.data_preview_raw.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => <td key={i} className="px-4 py-2 text-gray-600">{val === "" ? <span className="text-red-400 italic">kosong</span> : val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Preview Sesudah (Bersih)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-indigo-50 text-indigo-700">
                  <tr>
                    {Object.keys(result.data_preview_clean[0] || {}).map((key) => (
                      <th key={key} className="px-4 py-2 font-medium">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.data_preview_clean.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => <td key={i} className="px-4 py-2 text-gray-800">{val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={handleDownloadCSV} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer bg-white">
              Download CSV Bersih
            </button>
            <button onClick={() => setShowConfirm(true)} className="px-5 py-2.5 rounded-lg bg-[#0f4a8a] text-white font-medium hover:bg-[#0c3e76] transition-colors cursor-pointer border-0">
              💾 Import ke Database
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Import</h3>
            <p className="text-gray-600 mb-4">Data yang akan diimpor: <strong className="text-gray-900">{result.full_data?.length} warga baru</strong>. Lanjutkan?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent cursor-pointer">Batal</button>
              <button onClick={handleConfirmImport} disabled={isImporting} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 cursor-pointer border-0 disabled:opacity-50">
                {isImporting ? 'Menyimpan...' : 'Ya, Import Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
