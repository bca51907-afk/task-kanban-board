<script setup>
import { formatRelativeTime } from '../utils/timeFormat'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle-star', 'toggle-urgent', 'remove', 'dragstart', 'dragend'])

function onDragStart(e) {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.task.id)
  emit('dragstart', props.task.id)
}

function onDragEnd() {
  emit('dragend')
}
</script>

<template>
  <div
    class="task-card"
    :class="{ starred: task.starred, urgent: task.urgent }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="task-card__header">
      <span v-if="task.category" class="task-card__category">{{ task.category }}</span>
      <div class="task-card__actions">
        <button
          class="task-card__btn"
          :class="{ active: task.starred }"
          title="星标"
          @click="emit('toggle-star', task.id)"
        >
          ★
        </button>
        <button
          class="task-card__btn"
          :class="{ active: task.urgent }"
          title="紧急"
          @click="emit('toggle-urgent', task.id)"
        >
          ⚡
        </button>
        <button
          class="task-card__btn task-card__btn--delete"
          title="删除"
          @click="emit('remove', task.id)"
        >
          ✕
        </button>
      </div>
    </div>
    <div class="task-card__title">{{ task.title }}</div>
    <p v-if="task.description" class="task-card__desc">{{ task.description }}</p>
    <div class="task-card__footer">
      <span class="task-card__time">{{ formatRelativeTime(task.createdAt) }}</span>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
  cursor: grab;
}

.task-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.task-card:active {
  cursor: grabbing;
}

.task-card.starred {
  border-color: var(--color-star);
  background: linear-gradient(135deg, var(--color-bg-card), rgba(255, 215, 0, 0.05));
}

.task-card.urgent {
  border-color: var(--color-urgent);
  box-shadow: 0 0 0 1px var(--color-urgent), var(--shadow-sm);
}

.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.task-card__category {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
  font-weight: 500;
}

.task-card__actions {
  display: flex;
  gap: 4px;
}

.task-card__btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}

.task-card__btn:hover {
  background: var(--color-border-light);
  color: var(--color-text);
}

.task-card__btn.active {
  color: var(--color-star);
}

.task-card__btn--delete:hover {
  background: rgba(231, 76, 60, 0.1);
  color: var(--color-danger);
}

.task-card__title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  word-break: break-word;
}

.task-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  word-break: break-word;
}

.task-card__footer {
  display: flex;
  justify-content: flex-end;
}

.task-card__time {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>