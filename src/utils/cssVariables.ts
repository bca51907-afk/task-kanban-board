import { themes } from '../config/themes'

export function applyTheme(themeName) {
  const theme = themes[themeName]
  if (!theme) return
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme)) {
    if (key.startsWith('--')) {
      root.style.setProperty(key, value)
    }
  }
  root.setAttribute('data-theme', themeName)
}

export function getCssVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}