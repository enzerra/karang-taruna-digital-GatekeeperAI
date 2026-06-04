import { useState } from 'react'
import AdminGovernanceLayout from '../../components/AdminGovernanceLayout'
import SmartImportPanel from './components/SmartImportPanel'
import WargaTablePanel from './components/WargaTablePanel'

export default function MasterDataPage({ navigate }) {
  const [activeTab, setActiveTab] = useState('import')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleImportSuccess = () => {
    setRefreshKey(prev => prev + 1)
    setActiveTab('warga')
  }

  return (
    <AdminGovernanceLayout
      navigate={navigate}
      activeItem="master-data"
      title="Master Data Center"
      profileName="Admin Utama"
      profileRole="Super Admin"
    >
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('import')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-0 cursor-pointer bg-transparent
              ${activeTab === 'import'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            📥 Smart Import
          </button>
          <button
            onClick={() => setActiveTab('warga')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-0 cursor-pointer bg-transparent
              ${activeTab === 'warga'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            👥 Data Warga
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'import' && <SmartImportPanel onImportSuccess={handleImportSuccess} />}
        {activeTab === 'warga' && <WargaTablePanel refreshKey={refreshKey} />}
      </div>
    </AdminGovernanceLayout>
  )
}
