import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCard from '../src/components/TaskCard.vue'

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: '测试任务',
    description: '这是一个测试',
    category: '开发',
    columnId: 'todo',
    starred: false,
    urgent: false,
    createdAt: Date.now(),
  }

  it('renders task title and description', () => {
    const wrapper = mount(TaskCard, { props: { task: mockTask } })
    expect(wrapper.text()).toContain('测试任务')
    expect(wrapper.text()).toContain('这是一个测试')
  })

  it('renders category badge', () => {
    const wrapper = mount(TaskCard, { props: { task: mockTask } })
    expect(wrapper.text()).toContain('开发')
  })

  it('emits toggle-star event', async () => {
    const wrapper = mount(TaskCard, { props: { task: mockTask } })
    const starBtn = wrapper.findAll('button')[0]
    await starBtn.trigger('click')
    expect(wrapper.emitted('toggle-star')).toBeTruthy()
    expect(wrapper.emitted('toggle-star')[0]).toEqual(['1'])
  })

  it('emits toggle-urgent event', async () => {
    const wrapper = mount(TaskCard, { props: { task: mockTask } })
    const urgentBtn = wrapper.findAll('button')[1]
    await urgentBtn.trigger('click')
    expect(wrapper.emitted('toggle-urgent')).toBeTruthy()
    expect(wrapper.emitted('toggle-urgent')[0]).toEqual(['1'])
  })

  it('emits remove event', async () => {
    const wrapper = mount(TaskCard, { props: { task: mockTask } })
    const deleteBtn = wrapper.findAll('button')[2]
    await deleteBtn.trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')[0]).toEqual(['1'])
  })

  it('has draggable attribute', () => {
    const wrapper = mount(TaskCard, { props: { task: mockTask } })
    expect(wrapper.attributes('draggable')).toBe('true')
  })

  it('applies starred class when task is starred', () => {
    const wrapper = mount(TaskCard, { props: { task: { ...mockTask, starred: true } } })
    expect(wrapper.classes()).toContain('starred')
  })

  it('applies urgent class when task is urgent', () => {
    const wrapper = mount(TaskCard, { props: { task: { ...mockTask, urgent: true } } })
    expect(wrapper.classes()).toContain('urgent')
  })
})