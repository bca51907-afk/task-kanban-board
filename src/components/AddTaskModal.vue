<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  existingCategories: { type: Array, default: () => [] },
})

const emit = defineEmits(['submit', 'close'])

const title = ref('')
const description = ref('')
const category = ref('')
const columnId = ref('todo')
const showCategorySuggestions = ref(false)

const filteredCategories = computed(() => {
  if (!category.value) return []
  return props.existingCategories.filter((c) =>
    c.toLowerCase().includes(category.value.toLowerCase())
  )
})

function submit() {
  if (!title.value.trim()) return
  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim(),
    category: category.value.trim(),
    columnId: columnId.value,
  })
  title.value = ''
  description.value = ''
  category.value = ''
  columnId.value = 'todo'
  showCategorySuggestions.value = false
}

function close() {
  emit('close')
}

function selectCategory(cat) {
  category.value = cat
  showCategorySuggestions.value = false
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">新增任务</h2>
        <button class="modal__close" @click="close">✕</button>
      </div>
      <form class="modal__form" @submit.prevent="submit">
        <div class="form-field">
          <label class="form-label">标题 *</label>
          <input
            v-model="title"
            type="text"
            class="form-input"
            placeholder="请输入任务标题"
            autofocus
          />
        </div>
        <div class="form-field">
          <label class="form-label">描述</label>
          <textarea
            v-model="description"
            class="form-textarea"
            placeholder="请输入任务描述（可选）"
            rows="3"
          ></textarea>
        </div>
        <div class="form-field form-field--category">
          <label class="form-label">分类</label>
          <input
            v-model="category"
            type="text"
            class="form-input"
            placeholder="请输入或选择分类"
            @focus="showCategorySuggestions = true"
            @blur="setTimeout(() => (showCategorySuggestions = false), 200)"
          />
          <ul v-if="showCategorySuggestions && filteredCategories.length" class="category-suggestions">
            <li
              v-for="cat in filteredCategories"
              :key="cat"
              class="category-suggestion"
              @mousedown.prevent="selectCategory(cat)"
            >
              {{ cat }}
            </li>
          </ul>
        </div>
        <div class="form-field">
          <label class="form-label">状态</label>
          <select v-model="columnId" class="form-select">
            <option v-for="col in columns" :key="col.id" :value="col.id">{{ col.title }}</option>
          </select>
        </div>
        <div class="modal__footer">
          <button type="button" class="btn btn--secondary" @click="close">取消</button>
          <button type="submit" class="btn btn--primary">添加任务</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
  animation: fadeIn var(--transition-fast);
}

.modal {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  width: 90%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
  animation: scaleIn var(--transition-normal);
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.modal__title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
}

.modal__close {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}

.modal__close:hover {
  background: var(--color-border-light);
  color: var(--color-text);
}

.modal__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  position: relative;
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.form-input,
.form-textarea,
.form-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  color: var(--color-text);
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: var(--color-primary);
}

.form-textarea {
  resize: vertical;
}

.category-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  z-index: 10;
  max-height: 150px;
  overflow-y: auto;
}

.category-suggestion {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.category-suggestion:hover {
  background: var(--color-border-light);
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all var(--transition-fast);
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.btn--secondary {
  background: var(--color-border-light);
  color: var(--color-text-secondary);
}

.btn--secondary:hover {
  background: var(--color-border);
}
</style>