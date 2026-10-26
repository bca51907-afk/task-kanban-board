<script setup>
import ThemeSelector from './ThemeSelector.vue'

const props = defineProps({
  stats: { type: Object, required: true },
})

const emit = defineEmits(['add-task', 'reset'])
</script>

<template>
  <nav class="navbar">
    <div class="navbar__left">
      <div class="navbar__logo">📋 任务看板</div>
      <div class="navbar__stats">
        <span class="stat-item">
          <span class="stat-dot" style="background: var(--color-column-todo)"></span>
          待办 {{ stats.todo }}
        </span>
        <span class="stat-item">
          <span class="stat-dot" style="background: var(--color-column-doing)"></span>
          进行中 {{ stats.doing }}
        </span>
        <span class="stat-item">
          <span class="stat-dot" style="background: var(--color-column-done)"></span>
          已完成 {{ stats.done }}
        </span>
        <span class="stat-item stat-item--total">共 {{ stats.total }} 项</span>
      </div>
    </div>
    <div class="navbar__right">
      <ThemeSelector />
      <button class="btn btn--add" @click="emit('add-task')">
        ➕ 新增任务
      </button>
      <button class="btn btn--reset" @click="emit('reset')">
        🔄 重置
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-secondary);
  box-shadow: var(--shadow-sm);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.navbar__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.navbar__logo {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
}

.navbar__stats {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stat-item--total {
  color: var(--color-text);
  font-weight: 700;
}

.navbar__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all var(--transition-fast);
}

.btn--add {
  background: var(--color-primary);
  color: white;
}

.btn--add:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.btn--reset {
  background: var(--color-border-light);
  color: var(--color-text-secondary);
}

.btn--reset:hover {
  background: rgba(231, 76, 60, 0.1);
  color: var(--color-danger);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
  }

  .navbar__left,
  .navbar__right {
    justify-content: center;
  }
}
</style>