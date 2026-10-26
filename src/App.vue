<script setup>
import { ref, computed } from 'vue'
import NavBar from './components/NavBar.vue'
import KanbanColumn from './components/KanbanColumn.vue'
import AddTaskModal from './components/AddTaskModal.vue'
import FunToast from './components/FunToast.vue'
import Celebration from './components/Celebration.vue'
import { useKanban } from './composables/useKanban'
import { useToast } from './composables/useToast'
import { getRandomMessage } from './config/toastMessages'

const {
  columns,
  tasks,
  addTask,
  removeTask,
  moveTask,
  toggleStar,
  toggleUrgent,
  resetBoard,
  getTasksByColumn,
  getAllCategories,
  getStats,
} = useKanban()

const { success } = useToast()

const showModal = ref(false)
const dragOverColumn = ref(null)
const celebrationVisible = ref(false)
const celebrationEffect = ref('confetti')
const resetConfirmVisible = ref(false)

const stats = getStats()

const todoTasks = getTasksByColumn('todo')
const doingTasks = getTasksByColumn('doing')
const doneTasks = getTasksByColumn('done')

const existingCategories = computed(() => getAllCategories())

function handleAddTask(taskData) {
  addTask(taskData)
  showModal.value = false
  success(getRandomMessage('add'))
}

function handleRemove(taskId) {
  removeTask(taskId)
  success(getRandomMessage('delete'))
}

function handleToggleStar(taskId) {
  toggleStar(taskId)
  success(getRandomMessage('star'))
}

function handleToggleUrgent(taskId) {
  toggleUrgent(taskId)
  success(getRandomMessage('urgent'))
}

function handleDrop({ taskId, columnId }) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (!task || task.columnId === columnId) {
    dragOverColumn.value = null
    return
  }
  moveTask(taskId, columnId)
  dragOverColumn.value = null

  if (columnId === 'done') {
    celebrationEffect.value = ['confetti', 'stars', 'hearts'][Math.floor(Math.random() * 3)]
    celebrationVisible.value = true
    success(getRandomMessage('done'))
  } else {
    success(getRandomMessage('move'))
  }
}

function handleReset() {
  resetConfirmVisible.value = true
}

function confirmReset() {
  resetBoard()
  resetConfirmVisible.value = false
  success(getRandomMessage('reset'))
}

function cancelReset() {
  resetConfirmVisible.value = false
}

function onCelebrationComplete() {
  celebrationVisible.value = false
}
</script>

<template>
  <div class="app">
    <NavBar :stats="stats" @add-task="showModal = true" @reset="handleReset" />

    <div class="board">
      <KanbanColumn
        :column="columns[0]"
        :task-list="todoTasks"
        :is-drag-over="dragOverColumn === 'todo'"
        @drop="handleDrop"
        @drag-over="dragOverColumn = $event"
        @drag-leave="dragOverColumn = null"
        @toggle-star="handleToggleStar"
        @toggle-urgent="handleToggleUrgent"
        @remove="handleRemove"
        @add-task="showModal = true"
      />
      <KanbanColumn
        :column="columns[1]"
        :task-list="doingTasks"
        :is-drag-over="dragOverColumn === 'doing'"
        @drop="handleDrop"
        @drag-over="dragOverColumn = $event"
        @drag-leave="dragOverColumn = null"
        @toggle-star="handleToggleStar"
        @toggle-urgent="handleToggleUrgent"
        @remove="handleRemove"
        @add-task="showModal = true"
      />
      <KanbanColumn
        :column="columns[2]"
        :task-list="doneTasks"
        :is-drag-over="dragOverColumn === 'done'"
        @drop="handleDrop"
        @drag-over="dragOverColumn = $event"
        @drag-leave="dragOverColumn = null"
        @toggle-star="handleToggleStar"
        @toggle-urgent="handleToggleUrgent"
        @remove="handleRemove"
        @add-task="showModal = true"
      />
    </div>

    <AddTaskModal
      v-if="showModal"
      :columns="columns"
      :existing-categories="existingCategories"
      @submit="handleAddTask"
      @close="showModal = false"
    />

    <FunToast />

    <Celebration
      :visible="celebrationVisible"
      :effect="celebrationEffect"
      @complete="onCelebrationComplete"
    />

    <Transition name="vue">
      <div v-if="resetConfirmVisible" class="confirm-overlay" @click.self="cancelReset">
        <div class="confirm-dialog">
          <h3>确认重置看板？</h3>
          <p>此操作将清空所有任务数据，且不可恢复。</p>
          <div class="confirm-actions">
            <button class="btn btn--secondary" @click="cancelReset">取消</button>
            <button class="btn btn--danger" @click="confirmReset">确认重置</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app {
  height: 100%;
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.board {
  flex: 1;
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
}

.confirm-dialog {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  width: 90%;
  max-width: 360px;
  text-align: center;
}

.confirm-dialog h3 {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.confirm-dialog p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all var(--transition-fast);
}

.btn--secondary {
  background: var(--color-border-light);
  color: var(--color-text-secondary);
}

.btn--danger {
  background: var(--color-danger);
  color: white;
}

.btn--danger:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .board {
    flex-direction: column;
  }

  .app {
    padding: var(--spacing-md);
  }
}
</style>