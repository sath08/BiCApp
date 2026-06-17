import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NotificationBell from '../ui/NotificationBell'

const navItems = [
  { to: '/teacher/dashboard', label: 'Dashboard' },
  { to: '/teacher/students', label: 'My Students' },
  { to: '/teacher/reviews', label: 'Reviews' },
]

export default function TeacherLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() { await signOut(); navigate('/') }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      <header className="h-14 bg-white border-b border-gray-100 sticky top-0 z-30 flex items-center px-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="font-semibold text-gray-900 text-sm">BIC Champions</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">Teacher</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden sm:block text-sm text-gray-500 mr-2">{user?.full_name}</span>
          <NotificationBell />
          <button onClick={handleLogout} className="ml-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium">
            Log out
          </button>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <aside className="hidden md:flex flex-col w-52 bg-white border-r border-gray-100 sticky top-14 h-[calc(100vh-3.5rem)]">
          <nav className="py-4 px-3 space-y-0.5">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >{item.label}</NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden"><Outlet /></main>
      </div>
    </div>
  )
}
