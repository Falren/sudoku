import { useCallback, useEffect, useState } from 'react'

import type { Theme } from '@/theme/documentTheme'
import { resolveInitialTheme, setThemeOnDocument } from '@/theme/documentTheme'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => resolveInitialTheme())

  useEffect(() => {
    setThemeOnDocument(theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, setTheme, toggleTheme }
}
