<script setup>
const props = defineProps({
  icon: { type: String, default: '📋' },
  title: { type: String, default: '暂无任务' },
  hint: { type: String, default: '拖拽任务到此列' },
  actionText: { type: String, default: '' },
  actionIcon: { type: String, default: '' },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">{{ icon }}</div>
    <div class="empty-state__title">{{ title }}</div>
    <div class="empty-state__hint">{{ hint }}</div>
    <button v-if="actionText" class="empty-state__action" @click="emit('action')">
      <span v-if="actionIcon">{{ actionIcon }}</span>
      {{ actionText }}
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  color: var(--color-text-muted);
}

.empty-state__icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
  animation: bounce 2s ease-in-out infinite;
}

.empty-state__title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.empty-state__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.empty-state__action {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.empty-state__action:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}
</style>