import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NotificationBell from '../ui/NotificationBell'

const navItems = [
  { to: '/admin/dashboard',    label: 'Dashboard' },
  { to: '/admin/students',     label: 'Students' },
  { to: '/admin/teachers',     label: 'Teachers' },
  { to: '/admin/assignments',  label: 'Assignments' },
  { to: '/admin/leaderboard',  label: 'Leaderboard' },
  { to: '/admin/reports',      label: 'Reports' },
  { to: '/admin/awards',       label: 'Awards' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() { await signOut(); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="h-14 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center px-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="font-semibold text-gray-900 text-sm">BIC Champions</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">Admin</span>
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
        <aside className="hidden md:flex flex-col w-52 bg-white border-r border-gray-200 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="py-4 px-3 space-y-0.5">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-slate-200 text-slate-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >{item.label}</NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden"><Outlet /></main>
      </div>
    </div>
  )
}
