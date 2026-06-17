import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStudentContext } from '../../contexts/StudentContext'
import NotificationBell from '../ui/NotificationBell'
import { useState } from 'react'

const navItems = [
  { to: '/student/dashboard', emoji: '🏠', label: 'Home' },
  { to: '/student/reading-log', emoji: '📖', label: 'Reading' },
  { to: '/student/writing', emoji: '✍️', label: 'Writing' },
  { to: '/student/leaderboard', emoji: '🏆', label: 'Rankings' },
  { to: '/student/badges', emoji: '🏅', label: 'Badges' },
  { to: '/student/profile', emoji: '👤', label: 'Profile' },
]

export default function StudentLayout() {
  const { student, logoutStudent } = useStudentContext()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logoutStudent()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg-lavender flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-purple-50" onClick={() => setMobileOpen(!mobileOpen)}>
              <span className="text-xl">☰</span>
            </button>
            <span className="text-xl">📚</span>
            <span className="font-extrabold text-purple-800 hidden sm:block">BIC Champions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl">
              👋 {student?.firstName}
            </span>
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-purple-100 min-h-[calc(100vh-64px)] sticky top-16 h-[calc(100vh-64px)]">
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-md shadow-purple-200'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }`
                }
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 border-t border-purple-50">
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xl font-extrabold text-orange-500">{student?.readingStreak || 5}</div>
              <div className="text-xs text-gray-500">day streak</div>
            </div>
          </div>
        </aside>

        {/* Mobile Nav Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">📚</span>
                <span className="font-extrabold text-purple-800">BIC Champions</span>
              </div>
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm mb-1 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white'
                        : 'text-gray-600 hover:bg-purple-50'
                    }`
                  }
                >
                  <span className="text-lg">{item.emoji}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 z-30 shadow-lg">
        <div className="flex">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 text-[10px] font-semibold transition-all ${
                  isActive ? 'text-purple-700' : 'text-gray-400'
                }`
              }
            >
              <span className="text-xl">{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
