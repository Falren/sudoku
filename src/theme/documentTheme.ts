export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'sudoku-theme'

export function resolveInitialTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark') return raw
    return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyDocumentTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
}

export function setThemeOnDocument(theme: Theme): void {
  applyDocumentTheme(theme)
  localStorage.setItem(STORAGE_KEY, theme)
}
