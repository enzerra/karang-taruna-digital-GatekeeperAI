import { useState } from 'react'
import FinanceChart from './components/FinanceChart'
import InsightCard from './components/InsightCard'
import AIReportModal from './components/AIReportModal'
import { formatRupiah } from './bendaharaUtils'
import { generateAiReport } from '../../services/finance/financeService'

export default function BendaharaLaporan({ derived }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportResult, setReportResult] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleGenerateAI = async () => {
    try {
      setIsGenerating(true)
      setErrorMsg('')
      const payload = {
        saldo: derived.saldo,
        totalIn: derived.totalIn,
        totalOut: derived.totalOut,
        latestTransactions: derived.latest.map(tx => ({
          date: tx.date,
          desc: tx.desc,
          category: tx.category,
          amount: tx.amount
        }))
      }
      const response = await generateAiReport(payload)
      if (response.status === 'success') {
        setReportResult(response.report_markdown)
        setIsModalOpen(true)
      } else {
        throw new Error("Respons tidak valid dari server")
      }
    } catch (error) {
      setErrorMsg(error.message || "Gagal membuat laporan AI")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grafik pemasukan vs pengeluaran</h2>
          <FinanceChart chart={derived.chart} />
          <p className="text-sm text-gray-500 mt-4">Gunakan filter transaksi untuk laporan per bulan/tahun (siap dikaitkan ke BE untuk query).</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-5 shadow-sm">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Konsultan AI Keuangan</h3>
            <p className="text-sm text-indigo-700 mb-4 leading-relaxed">
              Dapatkan evaluasi instan tentang kesehatan kas Karang Taruna dan saran efisiensi berbasis AI.
            </p>
            {errorMsg && <p className="text-xs text-red-600 mb-3">{errorMsg}</p>}
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="w-full h-11 rounded-lg bg-indigo-600 text-white font-semibold cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-0"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyusun Laporan...
                  </>
                ) : (
                  <>
                    ✨ Generate Laporan AI
                  </>
                )}
              </button>
              
              {reportResult && !isGenerating && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full h-11 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-semibold cursor-pointer hover:bg-indigo-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Buka Laporan Terakhir
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Export Standar</h3>
            <button 
              onClick={() => window.print()}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Export PDF / Print
            </button>
            <button className="w-full h-10 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium cursor-pointer mt-2 hover:bg-gray-50 transition-colors">Export Excel</button>
          </div>
          
          <InsightCard title="Ringkasan" body={`Saldo saat ini ${formatRupiah(derived.saldo)}. Total pemasukan ${formatRupiah(derived.totalIn)} dan pengeluaran ${formatRupiah(derived.totalOut)}.`} />
        </div>
      </div>

      <AIReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        reportMarkdown={reportResult} 
      />
    </>
  )
}
