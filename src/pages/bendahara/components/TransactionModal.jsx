import { useState } from 'react'
import { scanKwitansi } from '../../../services/finance/ocrService.js'

export default function TransactionModal({
  editingId,
  form,
  setForm,
  errorMessage,
  isSaving,
  closeModal,
  submitTx,
}) {
  const [mode, setMode] = useState('manual') // 'manual' or 'scan'
  const [file, setFile] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState('')

  const handleScan = async () => {
    if (!file) return
    try {
      setIsScanning(true)
      setScanError('')
      const result = await scanKwitansi(file)
      
      const { ocr_raw_result, receipt_image, validation_confidence } = result
      
      // Auto-fill the form
      setForm(prev => ({
        ...prev,
        type: 'Pengeluaran',
        amount: ocr_raw_result.total_bayar || '',
        category: ocr_raw_result.suggested_category || '',
        desc: `Belanja di ${ocr_raw_result.nama_toko || 'Toko'}${ocr_raw_result.alamat && ocr_raw_result.alamat !== 'Tidak tersedia' ? ` (${ocr_raw_result.alamat})` : ''}`,
        date: ocr_raw_result.tanggal || prev.date,
        // Audit Trail fields
        source: 'ocr',
        receipt_image,
        validation_confidence,
        items: ocr_raw_result.daftar_item,
        ocr_raw_result
      }))
      
      setMode('manual') // Switch back to manual mode to let user review/edit
    } catch (err) {
      setScanError(err.message)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer text-lg">x</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {!editingId && (
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                onClick={() => setMode('manual')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors border-0 cursor-pointer ${mode === 'manual' ? 'bg-white shadow text-gray-900' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
              >
                ✍️ Input Manual
              </button>
              <button
                onClick={() => setMode('scan')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors border-0 cursor-pointer ${mode === 'scan' ? 'bg-indigo-600 shadow text-white' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
              >
                🤖 Scan Kwitansi AI
              </button>
            </div>
          )}

          {mode === 'scan' ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl p-8 text-center">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full w-14 h-14 mx-auto flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-indigo-900 mb-1">Upload Foto Kwitansi</h4>
                <p className="text-sm text-indigo-600/80 mb-4">AI akan membaca total bayar, tanggal, dan nama toko secara otomatis.</p>
                <div className="flex justify-center gap-3 mb-4">
                  <label className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Buka Kamera
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => setFile(e.target.files[0])} />
                  </label>
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold text-sm transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Pilih Galeri
                    <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
                  </label>
                </div>
                {file && <div className="text-sm font-medium text-green-700 bg-green-50 p-2 rounded-lg border border-green-200 inline-block">✓ {file.name}</div>}
              </div>

              {scanError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{scanError}</p>}

              <button
                type="button"
                onClick={handleScan}
                disabled={!file || isScanning}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors border-0 cursor-pointer flex justify-center items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memvalidasi dengan AI Satpam...
                  </>
                ) : '🚀 Mulai Pindai Kwitansi'}
              </button>
            </div>
          ) : (
            <form id="tx-form" onSubmit={submitTx} className="space-y-4">
              {form.source === 'ocr' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="text-2xl">✨</div>
                  <div>
                    <h4 className="text-sm font-bold text-green-900">Form Terisi Otomatis oleh AI</h4>
                    <p className="text-xs text-green-700 mt-1">
                      Kwitansi Anda divalidasi dengan tingkat keyakinan <strong>{form.validation_confidence}</strong>.
                      Silakan periksa kembali angka nominalnya sebelum menyimpan.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Tanggal
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Jenis
                  <select
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                  </select>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Kategori {form.source === 'ocr' && <span className="text-xs text-indigo-600 font-normal ml-1">(Suggested)</span>}
                  <input
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Contoh: Konsumsi"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Nominal
                  <input
                    value={form.amount}
                    onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Contoh: 250000"
                  />
                </label>
              </div>

              <label className="text-sm font-medium text-gray-700 block">
                Keterangan
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </label>

              <label className="text-sm font-medium text-gray-700 block">
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                >
                  <option value="Lunas">Lunas</option>
                  <option value="Proses">Proses</option>
                </select>
              </label>

              {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}
            </form>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 shrink-0">
          <button
            type="button"
            onClick={closeModal}
            disabled={isSaving || isScanning}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          {mode === 'manual' && (
            <button
              type="submit"
              form="tx-form"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-[#1a3a6b] text-white font-semibold hover:bg-[#152f58] transition-colors cursor-pointer border-0"
            >
              {isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Transaksi'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
