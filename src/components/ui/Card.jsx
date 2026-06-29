import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, onClick, animate = false }) {
  const base = `bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md cursor-pointer' : ''} ${className}`

  if (animate || onClick) {
    return (
      <motion.div
        onClick={onClick}
        className={base}
        whileHover={hover ? { y: -1 } : undefined}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={base}>{children}</div>
}
