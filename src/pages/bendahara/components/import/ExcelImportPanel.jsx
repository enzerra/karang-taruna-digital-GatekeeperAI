import { useState } from 'react'
import { previewImportFile } from '../../../../services/imports/importService'

export default function ExcelImportPanel({ onDataScanned, onError, setIsLoading, isLoading }) {
  const [file, setFile] = useState(null)

  async function handleUpload(event) {
    event.preventDefault()

    if (!file) {
      onError('Pilih file .xlsx atau .csv terlebih dahulu.')
      return
    }

    try {
      setIsLoading(true)
      const result = await previewImportFile(file)
      // Pass the result to parent to append to session
      onDataScanned(result, file.name)
      setFile(null) // clear form
    } catch (error) {
      onError(error.message || 'Gagal memproses file Excel.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-[#e2e7f0] shadow-sm p-6 mb-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-green-100 rounded-xl text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">Upload Excel / CSV</h2>
          <p className="text-sm text-gray-600">Impor data massal dari file spreadsheet dengan format standar.</p>
        </div>
      </div>
      <form onSubmit={handleUpload} className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          Pilih File Spreadsheet
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:rounded-xl file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-green-700"
          />
        </label>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="submit"
            disabled={isLoading || !file}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
          >
            {isLoading ? 'Memproses...' : 'Tambahkan ke Sesi Impor'}
          </button>
        </div>
      </form>
    </section>
  )
}
