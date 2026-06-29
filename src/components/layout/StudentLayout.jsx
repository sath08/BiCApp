import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useStudentContext } from '../../contexts/StudentContext'
import { useLang } from '../../contexts/LanguageContext'
import NotificationBell from '../ui/NotificationBell'
import HeaderControls from '../ui/HeaderControls'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const NAV_KEYS = [
  { to: '/student/dashboard',   labelKey: 'dashboard',   icon: '⊞', emoji: '🏠' },
  { to: '/student/reading-log', labelKey: 'readingLog',  icon: '◉', emoji: '📖' },
  { to: '/student/writing',     labelKey: 'writing',     icon: '◎', emoji: '✍️' },
  { to: '/student/leaderboard', labelKey: 'leaderboard', icon: '△', emoji: '🏆' },
  { to: '/student/badges',      labelKey: 'badges',      icon: '◈', emoji: '🏅' },
  { to: '/student/profile',     labelKey: 'profile',     icon: '○', emoji: '👤' },
]

export default function StudentLayout() {
  const { student, logoutStudent } = useStudentContext()
  const { t } = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() { logoutStudent(); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
      {/* Skip to main (WCAG 2.4.1) */}
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg text-sm font-medium">
        Skip to main content
      </a>

      {/* Header */}
      <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 flex items-center px-4" role="banner">
        <div className="flex items-center gap-3 flex-1">
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">BIC Champions</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
            {t('student')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 mr-1">{student?.firstName}</span>
          <NotificationBell />
          <HeaderControls />
          <button
            onClick={handleLogout}
            aria-label={t('logOut')}
            className="ml-1 px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
          >
            {t('logOut')}
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex flex-col w-52 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 sticky top-14 h-[calc(100vh-3.5rem)]"
          role="navigation"
          aria-label="Student navigation"
        >
          <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
            {NAV_KEYS.map(item => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`
                }
              >
                <span className="text-[11px] w-4 text-center opacity-60" aria-hidden="true">{item.icon}</span>
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/40">
              <span className="text-base" aria-hidden="true">🔥</span>
              <div>
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{student?.readingStreak || 5} {t('days')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('readingStreak')}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav"
              className="fixed inset-0 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} aria-hidden="true" />
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-60 bg-white dark:bg-gray-900 shadow-xl flex flex-col"
                initial={{ x: -240 }}
                animate={{ x: 0 }}
                exit={{ x: -240 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                role="navigation"
                aria-label="Mobile navigation"
              >
                <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">BIC Champions</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation"
                    className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                  >×</button>
                </div>
                <nav className="flex-1 py-3 px-3 space-y-0.5">
                  {NAV_KEYS.map(item => (
                    <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`
                      }
                    >
                      <span className="text-base" aria-hidden="true">{item.emoji}</span>
                      {t(item.labelKey)}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main id="main-content" className="flex-1 overflow-x-hidden" tabIndex={-1}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="p-4 md:p-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-30" aria-label="Mobile bottom navigation">
        <div className="grid grid-cols-6">
          {NAV_KEYS.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'
                }`
              }
            >
              <span className="text-base" aria-hidden="true">{item.emoji}</span>
              {t(item.labelKey).split(' ')[0]}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
