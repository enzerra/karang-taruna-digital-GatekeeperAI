export default function BendaharaPrediksi() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Karang Taruna AI Analytics</h2>
      <p className="text-gray-500 max-w-lg mb-8 leading-relaxed">
        Modul Prediksi Saldo dan Analitik Lanjutan menggunakan Machine Learning (LSTM) dipisahkan ke dalam ekosistem tersendiri untuk performa maksimal.
      </p>
      
      <a 
        href="https://app-karang-taruna-fphq23tv8m2jalrscqvrzc.streamlit.app/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 no-underline"
      >
        <span>Buka Dashboard AI Layar Penuh</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      <div className="mt-8 pt-8 border-t border-gray-100 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Server Streamlit Aktif & Sinkron
        </div>
      </div>
    </div>
  )
}
