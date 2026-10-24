import { createContext, useContext, useMemo, useState } from 'react'

type Locale = 'fr' | 'ar'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (fr: string, ar: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr')

  const value = useMemo<LocaleContextType>(
    () => ({
      locale,
      setLocale,
      t: (fr, ar) => (locale === 'ar' ? ar : fr),
    }),
    [locale]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
