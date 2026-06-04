import ReactMarkdown from 'react-markdown'
import html2pdf from 'html2pdf.js'

export default function AIReportModal({ isOpen, onClose, reportMarkdown }) {
  if (!isOpen) return null

  const handleExportPdf = () => {
    const element = document.getElementById('ai-report-content')
    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5],
      filename:     'Laporan_Audit_AI_Karang_Taruna.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, windowWidth: 800, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    }
    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Laporan Audit AI</h2>
              <p className="text-xs text-gray-500 font-medium">Konsultan Keuangan Karang Taruna</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50/50">
          <div 
            id="ai-report-content" 
            className="bg-white px-10 py-12 mx-auto max-w-4xl text-gray-800"
            style={{ 
              fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
          >
            {/* Kop Laporan Profesional (Hanya tercetak di PDF) */}
            <div className="border-b-4 border-indigo-600 pb-6 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-indigo-900 tracking-tight mb-2">LAPORAN AUDIT AI</h1>
                <h2 className="text-lg font-bold text-gray-500 uppercase tracking-widest">Karang Taruna Desa</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-600">Diterbitkan pada:</p>
                <p className="text-sm text-indigo-600 font-bold">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-indigo-900 prose-h2:text-indigo-800 prose-h3:text-indigo-700 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-indigo-900">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-extrabold text-indigo-900 mt-8 mb-4 border-b border-gray-200 pb-2" {...props} />,
                  h2: ({node, ...props}) => (
                    <div className="flex items-center gap-2 mt-8 mb-4">
                      <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                      <h2 className="text-xl font-bold text-gray-900 m-0" {...props} />
                    </div>
                  ),
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold text-indigo-700 mt-6 mb-3 uppercase tracking-wide text-sm" {...props} />,
                  p: ({node, ...props}) => <p className="mb-5 leading-relaxed text-gray-700 text-justify" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-none pl-0 mb-6 space-y-3" {...props} />,
                  li: ({node, ...props}) => (
                    <li className="relative pl-6 text-gray-700" {...props}>
                      <span className="absolute left-0 top-2 w-2 h-2 bg-indigo-400 rounded-full"></span>
                      {props.children}
                    </li>
                  ),
                  strong: ({node, ...props}) => <strong className="font-extrabold text-gray-900 bg-indigo-50 px-1 py-0.5 rounded" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 pl-4 py-2 my-6 italic text-gray-700 rounded-r-lg" {...props} />
                  )
                }}
              >
                {reportMarkdown}
              </ReactMarkdown>
            </div>
            
            {/* Footer Laporan */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
              <p>Dokumen ini dihasilkan secara otomatis oleh Konsultan AI Keuangan Karang Taruna.</p>
              <p className="mt-1 font-semibold text-gray-300">© {new Date().getFullYear()} Digitalisasi Karang Taruna</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={handleExportPdf}
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm cursor-pointer border-0"
          >
            Tutup Laporan
          </button>
        </div>
      </div>
    </div>
  )
}
