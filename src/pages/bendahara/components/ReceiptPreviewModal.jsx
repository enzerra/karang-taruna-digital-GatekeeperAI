import { API_BASE_URL } from '../../../config/api'

export default function ReceiptPreviewModal({ transaction, onClose }) {
  if (!transaction || !transaction.receipt_image) return null

  const items = transaction.items || []

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Image Viewer */}
        <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 overflow-hidden relative min-h-[300px]">
          <img 
            src={`${API_BASE_URL}/receipts/${transaction.receipt_image}`} 
            alt="Bukti Kwitansi" 
            className="max-w-full max-h-full object-contain drop-shadow-md rounded"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://via.placeholder.com/400x600?text=Gambar+Tidak+Ditemukan'
            }}
          />
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Bukti Fisik Asli
          </div>
        </div>

        {/* Right Side: Audit Trail Details */}
        <div className="w-full md:w-96 flex flex-col bg-white overflow-y-auto">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
            <h3 className="text-lg font-bold text-gray-900">Audit Trail (OCR)</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer border-0">x</button>
          </div>

          <div className="p-5 space-y-5">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Status Validasi</span>
                <span className="text-xs font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">{transaction.validation_confidence || 'N/A'}</span>
              </div>
              <p className="text-sm text-indigo-700">Discan menggunakan AI Satpam (MobileNetV2) & Gemini 2.5 Flash.</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2 border-b pb-1">Data Ekstraksi Mentah</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Toko:</span>
                  <span className="font-medium text-gray-900 text-right">{transaction.ocr_raw_result?.nama_toko || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanggal:</span>
                  <span className="font-medium text-gray-900 text-right">{transaction.ocr_raw_result?.tanggal || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Beli:</span>
                  <span className="font-bold text-gray-900 text-right">Rp {transaction.ocr_raw_result?.total_bayar?.toLocaleString('id-ID') || '-'}</span>
                </div>
              </div>
            </div>

            {items.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 border-b pb-1">Rincian Barang (Item)</h4>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                      <div className="font-medium text-gray-900 mb-1">{item.nama_barang}</div>
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>{item.qty} x Rp {item.harga_satuan?.toLocaleString('id-ID')}</span>
                        <span className="font-semibold text-gray-700">Rp {item.subtotal?.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
