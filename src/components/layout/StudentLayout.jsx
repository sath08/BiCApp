import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStudentContext } from '../../contexts/StudentContext'
import NotificationBell from '../ui/NotificationBell'
import { useState } from 'react'

const navItems = [
  { to: '/student/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/student/reading-log', icon: '◉', label: 'Reading Log' },
  { to: '/student/writing', icon: '◎', label: 'Writing' },
  { to: '/student/leaderboard', icon: '△', label: 'Leaderboard' },
  { to: '/student/badges', icon: '◈', label: 'Badges' },
  { to: '/student/profile', icon: '○', label: 'Profile' },
]

export default function StudentLayout() {
  const { student, logoutStudent } = useStudentContext()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() { logoutStudent(); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center px-4">
        <div className="flex items-center gap-3 flex-1">
          <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" onClick={() => setMobileOpen(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-semibold text-gray-900 text-sm">BIC Champions</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-xs font-medium">Student</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden sm:block text-sm text-gray-500 mr-2">{student?.firstName} {student?.lastName}</span>
          <NotificationBell />
          <button onClick={handleLogout} className="ml-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium">
            Log out
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 bg-white border-r border-gray-200 sticky top-14 h-[calc(100vh-3.5rem)]">
          <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                <span className="text-[11px] w-4 text-center opacity-60">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50">
              <span className="text-base">🔥</span>
              <div>
                <p className="text-sm font-bold text-orange-600">{student?.readingStreak || 5} days</p>
                <p className="text-xs text-gray-500">reading streak</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-60 bg-white shadow-xl flex flex-col">
              <div className="h-14 flex items-center px-4 border-b border-gray-200">
                <span className="font-semibold text-gray-900">BIC Champions</span>
              </div>
              <nav className="flex-1 py-3 px-3 space-y-0.5">
                {navItems.map(item => (
                  <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span className="text-[11px] w-4 text-center opacity-60">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-6">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}
            >
              <span className="text-base">{['🏠','📖','✍️','🏆','🏅','👤'][navItems.findIndex(n=>n.to===item.to)]}</span>
              {item.label.split(' ')[0]}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
