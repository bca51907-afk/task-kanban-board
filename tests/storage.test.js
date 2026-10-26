import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadState, saveState, clearState } from '../src/utils/storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loadState returns null when no data', () => {
    expect(loadState()).toBeNull()
  })

  it('saveState and loadState round-trip', () => {
    const state = { tasks: [{ id: '1', title: 'Test', columnId: 'todo' }], columns: [] }
    saveState(state)
    const loaded = loadState()
    expect(loaded).not.toBeNull()
    expect(loaded.tasks).toHaveLength(1)
    expect(loaded.tasks[0].title).toBe('Test')
  })

  it('loadState returns null for invalid JSON', () => {
    localStorage.setItem('task-kanban-state', 'not-json{')
    expect(loadState()).toBeNull()
  })

  it('loadState returns null when tasks is not an array', () => {
    localStorage.setItem('task-kanban-state', JSON.stringify({ tasks: 'not-array' }))
    expect(loadState()).toBeNull()
  })

  it('clearState removes data', () => {
    saveState({ tasks: [{ id: '1', title: 'Test' }] })
    clearState()
    expect(loadState()).toBeNull()
  })
})