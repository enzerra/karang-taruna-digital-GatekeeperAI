import { useState } from 'react'
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import BeritaPage from './pages/public/BeritaPage'
import ProgramPage from './pages/public/ProgramPage'
import ProgramDetailPage from './pages/public/ProgramDetailPage'
import StrukturPage from './pages/public/StrukturPage'
import BeritaDetailPage from './pages/public/BeritaDetailPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBerita from './pages/admin/AdminBerita'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProgram from './pages/admin/AdminProgram'
import BendaharaDashboard from './pages/bendahara/BendaharaDashboard'

export default function App() {
  const [page, setPage] = useState('home')
  const [param, setParam] = useState(null)

  function navigate(p, data = null) {
    setPage(p)
    setParam(data)
    window.scrollTo(0, 0)
  }

  const views = {
    home: <HomePage navigate={navigate} />,
    login: <LoginPage navigate={navigate} />,
    berita: <BeritaPage navigate={navigate} />,
    'berita-detail': <BeritaDetailPage navigate={navigate} item={param} />,
    program: <ProgramPage navigate={navigate} />,
    'program-detail': <ProgramDetailPage navigate={navigate} item={param} />,
    struktur: <StrukturPage navigate={navigate} />,
    'admin-dashboard': <AdminDashboard navigate={navigate} />,
    'admin-berita': <AdminBerita navigate={navigate} />,
    'admin-users': <AdminUsers navigate={navigate} />,
    'admin-program': <AdminProgram navigate={navigate} />,
    'bendahara': <BendaharaDashboard navigate={navigate} />,
  }

  return (
    <>
      {views[page] ?? <HomePage navigate={navigate} />}
    </>
  )
}
