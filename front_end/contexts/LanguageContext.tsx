'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import frTranslations from '@/locales/fr.json'
import enTranslations from '@/locales/en.json'
import arTranslations from '@/locales/ar.json'

type Language = 'fr' | 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translationsMap: Record<Language, typeof frTranslations> = {
  fr: frTranslations,
  en: enTranslations,
  ar: arTranslations,
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')
  const [translations, setTranslations] = useState<Record<string, any>>(frTranslations)

  useEffect(() => {
    // Load language from localStorage or default to 'fr'
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['fr', 'en', 'ar'].includes(savedLang)) {
      setLanguageState(savedLang)
      setTranslations(translationsMap[savedLang])
    }
  }, [])

  useEffect(() => {
    // Load translations
    setTranslations(translationsMap[language])
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    // Update HTML dir attribute
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }

  useEffect(() => {
    // Set initial dir and lang
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) return key
    }
    return typeof value === 'string' ? value : key
  }

  const dir = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

