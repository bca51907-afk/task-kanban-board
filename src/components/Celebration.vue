<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  effect: { type: String, default: 'confetti' },
  duration: { type: Number, default: 3000 },
})

const emit = defineEmits(['complete'])

const canvasRef = ref(null)
let animationId = null
let particles = []
let startTime = 0

const colors = ['#f72585', '#4cc9f0', '#4361ee', '#ffd700', '#2ecc71', '#f39c12', '#e84393', '#6c5ce7']

function createParticles(type) {
  const canvas = canvasRef.value
  if (!canvas) return
  const w = canvas.width
  const h = canvas.height
  particles = []

  const count = type === 'confetti' ? 80 : type === 'stars' ? 40 : 50

  for (let i = 0; i < count; i++) {
    if (type === 'confetti') {
      particles.push({
        x: w / 2 + (Math.random() - 0.5) * 100,
        y: h / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 12 - 4,
        gravity: 0.3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        type: 'rect',
        life: 1,
      })
    } else if (type === 'stars') {
      particles.push({
        x: Math.random() * w,
        y: -20,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        type: 'star',
        life: 1,
      })
    } else {
      particles.push({
        x: w / 2 + (Math.random() - 0.5) * 80,
        y: h / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 10 - 3,
        gravity: 0.2,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'heart',
        life: 1,
      })
    }
  }
}

function drawStar(ctx, x, y, size, color, rotation) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.fillStyle = color
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
    const outerX = Math.cos(angle) * size
    const outerY = Math.sin(angle) * size
    const innerAngle = angle + Math.PI / 5
    const innerX = Math.cos(innerAngle) * size * 0.4
    const innerY = Math.sin(innerAngle) * size * 0.4
    if (i === 0) ctx.moveTo(outerX, outerY)
    else ctx.lineTo(outerX, outerY)
    ctx.lineTo(innerX, innerY)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawHeart(ctx, x, y, size, color) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = color
  ctx.beginPath()
  const s = size / 2
  ctx.moveTo(0, s * 0.3)
  ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.4)
  ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.3)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const elapsed = Date.now() - startTime

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach((p) => {
    p.x += p.vx
    p.y += p.vy
    if (p.gravity) p.vy += p.gravity
    if (p.rotationSpeed) p.rotation += p.rotationSpeed

    if (elapsed > props.duration * 0.5) {
      p.life -= 0.02
    }

    ctx.globalAlpha = Math.max(0, p.life)

    if (p.type === 'rect') {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      ctx.restore()
    } else if (p.type === 'star') {
      drawStar(ctx, p.x, p.y, p.size, p.color, p.rotation)
    } else if (p.type === 'heart') {
      drawHeart(ctx, p.x, p.y, p.size, p.color)
    }
  })

  ctx.globalAlpha = 1

  if (elapsed < props.duration && particles.some((p) => p.life > 0)) {
    animationId = requestAnimationFrame(animate)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    emit('complete')
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      const canvas = canvasRef.value
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      createParticles(props.effect)
      startTime = Date.now()
      animate()
    }
  }
)

onMounted(() => {
  const canvas = canvasRef.value
  if (canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <canvas
    v-if="visible"
    ref="canvasRef"
    class="celebration-canvas"
  ></canvas>
</template>

<style scoped>
.celebration-canvas {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-celebration);
  pointer-events: none;
}
</style>