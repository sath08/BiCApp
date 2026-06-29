import { createContext, useContext, useState } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('bic_lang') || 'en')

  function t(key) { return translations[lang]?.[key] ?? translations.en[key] ?? key }
  function setLanguage(l) { localStorage.setItem('bic_lang', l); setLang(l) }

  return <LanguageContext.Provider value={{ lang, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
