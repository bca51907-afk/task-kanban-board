<script setup>
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'
import EmptyState from './EmptyState.vue'

const props = defineProps({
  column: { type: Object, required: true },
  taskList: { type: Array, default: () => [] },
  isDragOver: { type: Boolean, default: false },
})

const emit = defineEmits([
  'move',
  'toggle-star',
  'toggle-urgent',
  'remove',
  'drag-over',
  'drag-leave',
  'drop',
  'add-task',
])

const columnTaskList = computed(() => props.taskList)

function onDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  emit('drag-over', props.column.id)
}

function onDragLeave() {
  emit('drag-leave', props.column.id)
}

function onDrop(e) {
  e.preventDefault()
  const taskId = e.dataTransfer.getData('text/plain')
  emit('drop', { taskId, columnId: props.column.id })
}
</script>

<template>
  <div
    class="kanban-column"
    :class="{ 'kanban-column--drag-over': isDragOver }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="kanban-column__header">
      <span class="kanban-column__dot" :style="{ background: column.color }"></span>
      <span class="kanban-column__title">{{ column.title }}</span>
      <span class="kanban-column__count">{{ columnTaskList.length }}</span>
    </div>
    <div class="kanban-column__body">
      <TaskCard
        v-for="task in columnTaskList"
        :key="task.id"
        :task="task"
        @toggle-star="emit('toggle-star', $event)"
        @toggle-urgent="emit('toggle-urgent', $event)"
        @remove="emit('remove', $event)"
      />
      <EmptyState
        v-if="columnTaskList.length === 0"
        :icon="column.id === 'todo' ? '📝' : column.id === 'doing' ? '🔄' : '✅'"
        :title="column.id === 'todo' ? '暂无待办任务' : column.id === 'doing' ? '暂无进行中任务' : '暂无已完成任务'"
        hint="拖拽任务到此列"
        :action-text="column.id === 'todo' ? '新增任务' : ''"
        action-icon="➕"
        @action="emit('add-task', column.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.kanban-column {
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  transition: all var(--transition-normal);
}

.kanban-column--drag-over {
  background: var(--color-border-light);
  box-shadow: inset 0 0 0 2px var(--color-primary);
}

.kanban-column__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-border-light);
}

.kanban-column__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.kanban-column__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text);
}

.kanban-column__count {
  margin-left: auto;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  background: var(--color-border-light);
  padding: 2px 10px;
  border-radius: var(--radius-sm);
}

.kanban-column__body {
  flex: 1;
  overflow-y: auto;
  min-height: 100px;
}
</style>