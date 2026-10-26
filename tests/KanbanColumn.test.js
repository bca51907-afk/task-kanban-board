import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanColumn from '../src/components/KanbanColumn.vue'

describe('KanbanColumn', () => {
  const mockColumn = { id: 'todo', title: '待办', color: 'var(--color-column-todo)' }
  const mockTasks = [
    { id: '1', title: '任务1', columnId: 'todo', starred: false, urgent: false, createdAt: Date.now() },
    { id: '2', title: '任务2', columnId: 'todo', starred: true, urgent: false, createdAt: Date.now() },
  ]

  it('renders column title', () => {
    const wrapper = mount(KanbanColumn, {
      props: { column: mockColumn, taskList: mockTasks },
    })
    expect(wrapper.text()).toContain('待办')
  })

  it('shows task count', () => {
    const wrapper = mount(KanbanColumn, {
      props: { column: mockColumn, taskList: mockTasks },
    })
    expect(wrapper.text()).toContain('2')
  })

  it('renders task cards', () => {
    const wrapper = mount(KanbanColumn, {
      props: { column: mockColumn, taskList: mockTasks },
    })
    expect(wrapper.text()).toContain('任务1')
    expect(wrapper.text()).toContain('任务2')
  })

  it('shows empty state when no tasks', () => {
    const wrapper = mount(KanbanColumn, {
      props: { column: mockColumn, taskList: [] },
    })
    expect(wrapper.text()).toContain('暂无待办任务')
  })

  it('emits drop event on drop', async () => {
    const wrapper = mount(KanbanColumn, {
      props: { column: mockColumn, taskList: mockTasks },
    })
    const columnEl = wrapper.find('.kanban-column')
    await columnEl.trigger('drop', {
      dataTransfer: { getData: () => '1' },
    })
    expect(wrapper.emitted('drop')).toBeTruthy()
    expect(wrapper.emitted('drop')[0][0]).toEqual({ taskId: '1', columnId: 'todo' })
  })
})