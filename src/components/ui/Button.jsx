import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-gradient-to-r from-purple-700 to-purple-500 text-white hover:from-purple-800 hover:to-purple-600 shadow-lg shadow-purple-200',
  secondary: 'bg-gradient-to-r from-orange-700 to-orange-600 text-white hover:from-orange-800 hover:to-orange-700 shadow-lg shadow-orange-200',
  teal: 'bg-gradient-to-r from-teal-700 to-teal-600 text-white hover:from-teal-800 hover:to-teal-700 shadow-lg shadow-teal-200',
  outline: 'border-2 border-purple-600 text-purple-700 hover:bg-purple-50 bg-white',
  ghost: 'text-purple-700 hover:bg-purple-50',
  danger: 'bg-gradient-to-r from-red-700 to-red-600 text-white hover:from-red-800 hover:to-red-700 shadow-lg shadow-red-200',
  yellow: 'bg-gradient-to-r from-yellow-800 to-yellow-700 text-white hover:from-yellow-900 hover:to-yellow-800 shadow-lg shadow-yellow-200',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        font-semibold transition-all duration-200 flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
