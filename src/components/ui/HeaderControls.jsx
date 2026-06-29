import { useTheme } from '../../contexts/ThemeContext'
import { useLang } from '../../contexts/LanguageContext'
import { motion } from 'framer-motion'

export default function HeaderControls() {
  const { theme, toggle } = useTheme()
  const { lang, setLanguage } = useLang()

  return (
    <div className="flex items-center gap-1">
      {/* Language toggle */}
      <button
        onClick={() => setLanguage(lang === 'en' ? 'es' : 'en')}
        aria-label={lang === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
        className="px-2 py-1.5 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {lang === 'en' ? 'ES' : 'EN'}
      </button>

      {/* Dark mode toggle */}
      <button
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={theme === 'dark'}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <motion.span
          key={theme}
          initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-base"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </motion.span>
      </button>
    </div>
  )
}
