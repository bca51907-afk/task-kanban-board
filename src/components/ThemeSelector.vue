<script setup>
import { useTheme } from '../composables/useTheme'
import { themes, themeOrder } from '../config/themes'

const { currentTheme, setTheme, previewTheme, cancelPreview } = useTheme()
</script>

<template>
  <div class="theme-selector">
    <button
      v-for="themeName in themeOrder"
      :key="themeName"
      class="theme-option"
      :class="{ active: currentTheme === themeName }"
      :title="themes[themeName].name"
      @mouseenter="previewTheme(themeName)"
      @mouseleave="cancelPreview"
      @click="setTheme(themeName)"
    >
      <span class="theme-option__dot" :style="{
        background: themeName === 'light' ? '#4361ee' : themeName === 'dark' ? '#4cc9f0' : '#e84393'
      }"></span>
      <span class="theme-option__name">{{ themes[themeName].name }}</span>
    </button>
  </div>
</template>

<style scoped>
.theme-selector {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.theme-option:hover {
  background: var(--color-border-light);
  color: var(--color-text);
}

.theme-option.active {
  background: var(--color-primary);
  color: white;
}

.theme-option__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>