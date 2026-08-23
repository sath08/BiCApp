import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NotificationBell from '../ui/NotificationBell'

const navItems = [
  { to: '/admin/dashboard', emoji: '📊', label: 'Dashboard' },
  { to: '/admin/students', emoji: '👨‍🎓', label: 'Students' },
  { to: '/admin/teachers', emoji: '👩‍🏫', label: 'Teachers' },
  { to: '/admin/assignments', emoji: '📋', label: 'Assignments' },
  { to: '/admin/leaderboard', emoji: '🏆', label: 'Leaderboard' },
  { to: '/admin/reports', emoji: '📈', label: 'Reports' },
  { to: '/admin/awards', emoji: '🥇', label: 'Awards' },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg-lavender flex flex-col">
      <header className="bg-white border-b border-purple-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Best in Class Education Center" className="h-9 w-auto" />
            <span className="font-extrabold text-purple-800">BIC Champions</span>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">ADMIN</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-700 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-purple-100 min-h-[calc(100vh-64px)] sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-md shadow-orange-200'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700'
                  }`
                }
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
