import { NavLink, Route, Routes } from 'react-router-dom'
import Calendar from './pages/Calendar'
import Upload from './pages/Upload'

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
  }`

function App() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-4 py-3 flex gap-2">
        <NavLink to="/" end className={navLinkClass}>
          Upload
        </NavLink>
        <NavLink to="/calendar" className={navLinkClass}>
          Calendar
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  )
}

export default App
