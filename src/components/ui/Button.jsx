const variants = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
  secondary: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700',
  teal:      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
  outline:   'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100',
  ghost:     'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  danger:    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  yellow:    'bg-amber-400 text-amber-900 hover:bg-amber-500',
  dark:      'bg-gray-900 text-white hover:bg-gray-800',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-sm rounded-xl',
  xl: 'px-6 py-3 text-base rounded-xl',
}

export default function Button({
  children, variant = 'primary', size = 'md', className = '',
  loading = false, disabled = false, onClick, type = 'button', fullWidth = false,
}) {
  return (
    <button
      type={type} onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
