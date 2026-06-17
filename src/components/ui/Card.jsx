import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, onClick }) {
  const Component = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { y: -4, boxShadow: '0 20px 40px rgba(107,33,168,0.15)' },
    transition: { duration: 0.2 },
  } : {}

  return (
    <Component
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-purple-50 p-5 ${hover ? 'cursor-pointer' : ''} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  )
}
