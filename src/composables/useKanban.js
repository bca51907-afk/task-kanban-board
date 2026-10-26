import { ref, reactive, computed, watch } from 'vue'
import { loadState, saveState, clearState } from '../utils/storage'

const STORAGE_KEY_TASKS = 'task-kanban-tasks'

const defaultColumns = [
  { id: 'todo', title: '待办', color: 'var(--color-column-todo)' },
  { id: 'doing', title: '进行中', color: 'var(--color-column-doing)' },
  { id: 'done', title: '已完成', color: 'var(--color-column-done)' },
]

const columns = reactive([...defaultColumns])

const tasks = ref([])

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

function init() {
  const state = loadState()
  if (state && Array.isArray(state.tasks)) {
    tasks.value = state.tasks
  } else {
    tasks.value = []
  }
}

watch(
  tasks,
  (newTasks) => {
    saveState({ tasks: newTasks, columns })
  },
  { deep: true }
)

function addTask(taskData) {
  const task = {
    id: generateId(),
    title: taskData.title,
    description: taskData.description || '',
    category: taskData.category || '',
    columnId: taskData.columnId || 'todo',
    starred: false,
    urgent: false,
    createdAt: Date.now(),
  }
  tasks.value.push(task)
  return task
}

function removeTask(taskId) {
  const idx = tasks.value.findIndex((t) => t.id === taskId)
  if (idx !== -1) {
    tasks.value.splice(idx, 1)
  }
}

function moveTask(taskId, targetColumnId, targetIndex = -1) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (!task) return
  task.columnId = targetColumnId
  if (targetIndex >= 0 && targetIndex < tasks.value.length) {
    const currentIdx = tasks.value.findIndex((t) => t.id === taskId)
    if (currentIdx !== -1) {
      tasks.value.splice(currentIdx, 1)
      tasks.value.splice(targetIndex, 0, task)
    }
  }
}

function toggleStar(taskId) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) task.starred = !task.starred
}

function toggleUrgent(taskId) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) task.urgent = !task.urgent
}

function resetBoard() {
  tasks.value = []
  clearState()
}

function getTasksByColumn(columnId) {
  return computed(() => tasks.value.filter((t) => t.columnId === columnId))
}

function getAllCategories() {
  const cats = new Set()
  tasks.value.forEach((t) => {
    if (t.category) cats.add(t.category)
  })
  return Array.from(cats)
}

function getStats() {
  return computed(() => ({
    total: tasks.value.length,
    todo: tasks.value.filter((t) => t.columnId === 'todo').length,
    doing: tasks.value.filter((t) => t.columnId === 'doing').length,
    done: tasks.value.filter((t) => t.columnId === 'done').length,
  }))
}

init()

export function useKanban() {
  return {
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
  }
}