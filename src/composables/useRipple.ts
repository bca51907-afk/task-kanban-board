import { ref } from 'vue'

export function useRipple() {
  const ripples = ref([])

  function createRipple(event) {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const ripple = {
      id: Date.now() + Math.random(),
      style: {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`,
      },
    }

    ripples.value.push(ripple)
    setTimeout(() => {
      const idx = ripples.value.findIndex((r) => r.id === ripple.id)
      if (idx !== -1) {
        ripples.value.splice(idx, 1)
      }
    }, 600)
  }

  return {
    ripples,
    createRipple,
  }
}