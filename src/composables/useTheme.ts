import { ref } from 'vue'
import { applyTheme } from '../utils/cssVariables'
import { themes, themeOrder } from '../config/themes'

const currentTheme = ref('light')
const previewTheme = ref(null)

function loadTheme() {
  try {
    const saved = localStorage.getItem('task-kanban-theme')
    if (saved && themes[saved]) {
      currentTheme.value = saved
    }
  } catch (e) {
    // ignore
  }
  applyTheme(currentTheme.value)
}

function setTheme(themeName) {
  if (!themes[themeName]) return
  currentTheme.value = themeName
  previewTheme.value = null
  applyTheme(themeName)
  try {
    localStorage.setItem('task-kanban-theme', themeName)
  } catch (e) {
    // ignore
  }
}

function previewThemeFn(themeName) {
  if (!themes[themeName]) return
  previewTheme.value = themeName
  applyTheme(themeName)
}

function cancelPreview() {
  previewTheme.value = null
  applyTheme(currentTheme.value)
}

function cycleTheme() {
  const idx = themeOrder.indexOf(currentTheme.value)
  const next = themeOrder[(idx + 1) % themeOrder.length]
  setTheme(next)
}

loadTheme()

export function useTheme() {
  return {
    currentTheme,
    previewTheme,
    setTheme,
    previewTheme: previewThemeFn,
    cancelPreview,
    cycleTheme,
  }
}