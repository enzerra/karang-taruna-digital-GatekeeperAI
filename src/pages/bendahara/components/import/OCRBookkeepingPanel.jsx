import { useState } from 'react'
import { scanBukuKasFile } from '../../../../services/imports/importService'

export default function OCRBookkeepingPanel({ onDataScanned, onError, setIsLoading, isLoading }) {
  const [file, setFile] = useState(null)

  async function handleUpload(event) {
    event.preventDefault()

    if (!file) {
      onError('Pilih foto buku kas (.jpg, .jpeg, .png) terlebih dahulu.')
      return
    }

    try {
      setIsLoading(true)
      const result = await scanBukuKasFile(file)
      // Pass the result to parent to append to session
      onDataScanned(result, file.name)
      setFile(null) // clear form
    } catch (error) {
      onError(error.message || 'Gagal memproses file foto.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6 mb-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">AI Gatekeeper (OCR)</h2>
          <p className="text-sm text-gray-600">Teknologi OCR Cerdas dengan Model MobileNetV2 dan Gemini untuk membaca tulisan tangan.</p>
        </div>
      </div>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="block text-sm font-semibold text-gray-700">
          Foto Buku Kas (JPG/PNG)
          <div className="flex flex-wrap gap-3 mt-3 mb-2">
            <label className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Buka Kamera
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => setFile(e.target.files[0])} />
            </label>
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Pilih Galeri
              <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
            </label>
          </div>
          {file && <div className="text-sm font-medium text-green-700 bg-green-50 p-2 rounded-lg border border-green-200 inline-block mt-2">✓ {file.name}</div>}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="submit"
            disabled={isLoading || !file}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
          >
            {isLoading ? 'AI Sedang Membaca...' : 'Scan & Tambahkan ke Sesi'}
          </button>
        </div>
      </form>
    </section>
  )
}
