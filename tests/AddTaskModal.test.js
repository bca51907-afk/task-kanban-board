import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddTaskModal from '../src/components/AddTaskModal.vue'

describe('AddTaskModal', () => {
  const mockColumns = [
    { id: 'todo', title: '待办', color: 'var(--color-column-todo)' },
    { id: 'doing', title: '进行中', color: 'var(--color-column-doing)' },
    { id: 'done', title: '已完成', color: 'var(--color-column-done)' },
  ]

  it('renders form with title input', () => {
    const wrapper = mount(AddTaskModal, {
      props: { columns: mockColumns, existingCategories: [] },
    })
    expect(wrapper.find('input[placeholder="请输入任务标题"]').exists()).toBe(true)
  })

  it('does not submit when title is empty', async () => {
    const wrapper = mount(AddTaskModal, {
      props: { columns: mockColumns, existingCategories: [] },
    })
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('emits submit with task data when title is filled', async () => {
    const wrapper = mount(AddTaskModal, {
      props: { columns: mockColumns, existingCategories: [] },
    })
    const titleInput = wrapper.find('input[placeholder="请输入任务标题"]')
    await titleInput.setValue('新任务')
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    expect(wrapper.emitted('submit')).toBeTruthy()
    const submitted = wrapper.emitted('submit')[0][0]
    expect(submitted.title).toBe('新任务')
    expect(submitted.columnId).toBe('todo')
  })

  it('emits close event when close button clicked', async () => {
    const wrapper = mount(AddTaskModal, {
      props: { columns: mockColumns, existingCategories: [] },
    })
    const closeBtn = wrapper.find('.modal__close')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('shows category suggestions for existing categories', async () => {
    const wrapper = mount(AddTaskModal, {
      props: { columns: mockColumns, existingCategories: ['开发', '测试', '设计'] },
    })
    const categoryInput = wrapper.find('input[placeholder="请输入或选择分类"]')
    await categoryInput.setValue('开')
    await categoryInput.trigger('focus')
    expect(wrapper.text()).toContain('开发')
  })
})