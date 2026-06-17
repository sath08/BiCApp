import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockNotifications } from '../../lib/mockData'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unread = notifications.filter(n => !n.is_read).length

  function markRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-purple-100 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 z-20 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-purple-50">
                <h3 className="font-bold text-purple-900">Notifications</h3>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-purple-600 hover:text-purple-800 font-semibold">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-gray-400 text-sm">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`p-4 cursor-pointer hover:bg-purple-50 transition-colors ${!n.is_read ? 'bg-purple-50/50' : ''}`}
                    >
                      <div className="flex gap-2">
                        {!n.is_read && <div className="mt-1.5 w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />}
                        <div className={!n.is_read ? '' : 'pl-4'}>
                          <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
