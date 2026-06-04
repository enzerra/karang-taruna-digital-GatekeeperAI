import { useState, useMemo } from 'react'
import BendaharaHeader from './components/BendaharaHeader'
import ExcelImportPanel from './components/import/ExcelImportPanel'
import OCRBookkeepingPanel from './components/import/OCRBookkeepingPanel'
import UniversalPreviewTable from './components/import/UniversalPreviewTable'
import { commitImportBatch } from '../../services/imports/importService'

export default function ImportDataPage({ navigate }) {
  const [activeTab, setActiveTab] = useState('excel')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Universal Session State
  const [sessionRows, setSessionRows] = useState([])
  const [scannedFilesCount, setScannedFilesCount] = useState(0)
  const [editableRows, setEditableRows] = useState({})
  
  // Combine sessionRows with editableRows state
  const previewRows = useMemo(() => {
    return sessionRows.map((r) => {
      const ed = editableRows[r.uniqueId]
      return ed ? ed : { ...r, include: ed?.include ?? true }
    })
  }, [sessionRows, editableRows])

  const allSelected = previewRows.length > 0 && previewRows.every(r => r.include)

  function handleDataScanned(result, fileName) {
    const startIndex = sessionRows.length
    const newRows = (result.previewRows || []).map((r, idx) => {
      const uniqueId = `import-${scannedFilesCount}-${idx}`
      return {
        ...r,
        uniqueId,
        rowIndex: startIndex + idx + 1, // continuous row index
        sourceFile: fileName,
        sourceType: result.sourceType || 'mixed'
      }
    })

    setSessionRows(prev => [...prev, ...newRows])
    setScannedFilesCount(prev => prev + 1)
    
    // Initialize editable state for new rows
    const nextEditable = { ...editableRows }
    newRows.forEach(r => {
      nextEditable[r.uniqueId] = { ...r, include: true }
    })
    setEditableRows(nextEditable)
    setErrorMessage('') // Clear previous errors
  }

  function handleBulkToggle() {
    const nextInclude = !allSelected
    const nextEditable = { ...editableRows }
    previewRows.forEach((r) => {
      nextEditable[r.uniqueId] = { ...r, include: nextInclude }
    })
    setEditableRows(nextEditable)
  }

  function handleSelectValid() {
    const nextEditable = { ...editableRows }
    previewRows.forEach((r) => {
      const issues = r.issues || []
      nextEditable[r.uniqueId] = { ...r, include: issues.length === 0 }
    })
    setEditableRows(nextEditable)
  }

  function handleClearSession() {
    if (window.confirm('Yakin ingin mengosongkan semua data di sesi ini?')) {
      setSessionRows([])
      setScannedFilesCount(0)
      setEditableRows({})
      setErrorMessage('')
    }
  }

  async function handleConfirmImport() {
    try {
      setIsLoading(true)
      
      const rows = previewRows.filter((r) => r.include !== false).map((r) => ({
        rowIndex: r.rowIndex,
        date: r.date,
        type: r.type,
        desc: r.desc,
        category: r.category,
        status: r.status,
        amount: r.type === 'Pengeluaran' ? -Math.abs(Number(r.amount || 0)) : Math.abs(Number(r.amount || 0)),
        issues: r.issues || [],
      }))
      
      if (rows.length === 0) {
        throw new Error('Tidak ada baris data yang valid atau dipilih untuk di-import.')
      }
      
      await commitImportBatch({ 
        fileName: `Smart_Import_Session_${new Date().toISOString().slice(0,10)}`, 
        sourceType: 'mixed_session', 
        previewRows: rows 
      })
      
      window.dispatchEvent(new Event('karang-taruna:finance-updated'))
      navigate('bendahara')
    } catch (err) {
      setErrorMessage(err.message || 'Gagal melakukan import.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eff1f6] flex">
      <div className="flex-1 flex flex-col min-w-0">
        <BendaharaHeader active="import-data" search="" setSearch={() => {}} />

        <main className="p-8 overflow-auto">
          <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Impor Data Pintar</h1>
              <p className="text-sm text-gray-500 mt-1">Unggah file Excel atau gunakan AI untuk membaca buku kas fisik.</p>
            </div>
            <button
              onClick={() => navigate('bendahara')}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Kembali ke Bendahara
            </button>
          </div>

          <div className="mb-6 bg-white p-1 rounded-xl inline-flex border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab('excel')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'excel' ? 'bg-[#0f4a8a] text-white shadow' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Excel / CSV
            </button>
            <button
              onClick={() => setActiveTab('ocr')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'ocr' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              AI Gatekeeper (Gambar)
            </button>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          {activeTab === 'excel' && (
            <ExcelImportPanel 
              onDataScanned={handleDataScanned} 
              onError={setErrorMessage} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
            />
          )}

          {activeTab === 'ocr' && (
            <OCRBookkeepingPanel 
              onDataScanned={handleDataScanned} 
              onError={setErrorMessage} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
            />
          )}

          <UniversalPreviewTable 
            previewRows={previewRows}
            allSelected={allSelected}
            onBulkToggle={handleBulkToggle}
            onSelectValid={handleSelectValid}
            onClearSession={handleClearSession}
            onConfirmImport={handleConfirmImport}
            setEditableRows={setEditableRows}
            isLoading={isLoading}
            sessionCount={scannedFilesCount}
          />

        </main>
      </div>
    </div>
  )
}
