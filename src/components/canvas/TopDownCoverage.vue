<script setup lang="ts">
/**
 * TopDownCoverage Component
 *
 * Visualizes horizontal speaker coverage from a bird's-eye view.
 * Shows the room layout with SPL heatmap and coverage cones.
 */

import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoomStore, useSpeakerStore, useSettingsStore } from '@/stores'
import { useAcoustics, type Point3D } from '@/composables/useAcoustics'

const roomStore = useRoomStore()
const speakerStore = useSpeakerStore()
const settingsStore = useSettingsStore()
const acoustics = useAcoustics()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const canvasWidth = ref(600)
const canvasHeight = ref(400)

// rAF draw scheduler to batch rapid changes
let rafId: number | null = null
function requestDraw() {
  if (rafId != null) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    rafId = null
    draw()
  })
}

// Mouse position for probe tooltip
const mousePos = ref<{ x: number; y: number } | null>(null)
const probeData = ref<{ spl: number; distance: number } | null>(null)

// Convert room coordinates to canvas coordinates
function toCanvasX(roomX: number): number {
  const padding = 40
  const roomWidth = roomStore.width
  return padding + (roomX / roomWidth) * (canvasWidth.value - padding * 2)
}

function toCanvasY(roomY: number): number {
  const padding = 40
  const roomDepth = roomStore.depth
  return padding + (roomY / roomDepth) * (canvasHeight.value - padding * 2)
}

// Convert canvas coordinates to room coordinates
function toRoomX(canvasX: number): number {
  const padding = 40
  return ((canvasX - padding) / (canvasWidth.value - padding * 2)) * roomStore.width
}

function toRoomY(canvasY: number): number {
  const padding = 40
  return ((canvasY - padding) / (canvasHeight.value - padding * 2)) * roomStore.depth
}

// Get SPL color based on value
function getSPLColor(spl: number): string {
  const scheme = settingsStore.splColorScheme

  if (scheme === 'mono') {
    const alpha = Math.max(0, Math.min(1, (spl - 70) / 40))
    return `rgba(0, 255, 136, ${alpha * 0.6})`
  }

  if (scheme === 'thermal') {
    // Thermal: blue -> cyan -> green -> yellow -> orange -> red
    const normalized = Math.max(0, Math.min(1, (spl - 70) / 40))
    if (normalized < 0.25) {
      return `rgba(0, 0, ${Math.floor(255 * (normalized / 0.25))}, 0.6)`
    } else if (normalized < 0.5) {
      return `rgba(0, ${Math.floor(255 * ((normalized - 0.25) / 0.25))}, 255, 0.6)`
    } else if (normalized < 0.75) {
      return `rgba(${Math.floor(255 * ((normalized - 0.5) / 0.25))}, 255, ${Math.floor(255 * (1 - (normalized - 0.5) / 0.25))}, 0.6)`
    } else {
      return `rgba(255, ${Math.floor(255 * (1 - (normalized - 0.75) / 0.25))}, 0, 0.6)`
    }
  }

  // Neon scheme (default)
  const normalized = Math.max(0, Math.min(1, (spl - 70) / 40))
  if (normalized < 0.5) {
    // Blue to green
    const t = normalized * 2
    const r = 0
    const g = Math.floor(255 * t)
    const b = Math.floor(255 * (1 - t))
    return `rgba(${r}, ${g}, ${b}, 0.6)`
  } else {
    // Green to orange
    const t = (normalized - 0.5) * 2
    const r = Math.floor(255 * t)
    const g = Math.floor(255 * (1 - t * 0.7))
    const b = 0
    return `rgba(${r}, ${g}, ${b}, 0.6)`
  }
}

// Draw the canvas
function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const speaker = speakerStore.selectedSpeaker
  if (!speaker) return

  // Clear canvas
  ctx.fillStyle = '#0a0a0f'
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value)

  // Draw grid
  if (settingsStore.showGrid) {
    drawGrid(ctx)
  }

  // Draw SPL heatmap (only when enabled)
  if (settingsStore.showSPL) {
    drawHeatmap(ctx, speaker)
  }

  // Draw room outline
  drawRoomOutline(ctx)

  // Draw speaker position
  drawSpeaker(ctx)

  // Draw coverage cone
  drawCoverageCone(ctx, speaker)

  // Draw legend (only when SPL is shown)
  if (settingsStore.showLegend && settingsStore.showSPL) {
    drawLegend(ctx)
  }

  // Draw probe tooltip (only when SPL is shown)
  if (mousePos.value && probeData.value && settingsStore.showProbe && settingsStore.showSPL) {
    drawProbe(ctx)
  }
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(0, 170, 255, 0.1)'
  ctx.lineWidth = 1

  // Grid spacing (every 5 meters in room space)
  const gridSpacing = 5
  const padding = 40

  // Vertical lines
  for (let x = 0; x <= roomStore.width; x += gridSpacing) {
    const canvasX = toCanvasX(x)
    ctx.beginPath()
    ctx.moveTo(canvasX, padding)
    ctx.lineTo(canvasX, canvasHeight.value - padding)
    ctx.stroke()
  }

  // Horizontal lines
  for (let y = 0; y <= roomStore.depth; y += gridSpacing) {
    const canvasY = toCanvasY(y)
    ctx.beginPath()
    ctx.moveTo(padding, canvasY)
    ctx.lineTo(canvasWidth.value - padding, canvasY)
    ctx.stroke()
  }
}

function drawRoomOutline(ctx: CanvasRenderingContext2D) {
  const padding = 40
  ctx.strokeStyle = '#00aaff'
  ctx.lineWidth = 2
  ctx.strokeRect(
    padding,
    padding,
    canvasWidth.value - padding * 2,
    canvasHeight.value - padding * 2
  )

  // Add dimension labels
  ctx.fillStyle = '#6a6a7a'
  ctx.font = '11px JetBrains Mono, monospace'
  ctx.textAlign = 'center'

  // Width label (top)
  ctx.fillText(
    `${roomStore.width.toFixed(1)}m`,
    canvasWidth.value / 2,
    padding - 10
  )

  // Depth label (right side)
  ctx.save()
  ctx.translate(canvasWidth.value - padding + 15, canvasHeight.value / 2)
  ctx.rotate(Math.PI / 2)
  ctx.fillText(`${roomStore.depth.toFixed(1)}m`, 0, 0)
  ctx.restore()

  // Stage label
  ctx.fillStyle = '#4a4a5a'
  ctx.fillText('STAGE', canvasWidth.value / 2, padding + 15)
}

function drawHeatmap(ctx: CanvasRenderingContext2D, speaker: any) {
  // Slightly coarser default resolution for better interactivity
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const resolution = Math.max(10, Math.round(12 / Math.min(dpr, 2))) // pixels per grid cell
  const padding = 40
  const listenerHeight = 1.4

  const speakerPosition: Point3D = {
    x: roomStore.width / 2,
    y: speakerStore.trimHeight,
    z: 0,
  }

  // Draw heatmap in chunks
  for (let px = padding; px < canvasWidth.value - padding; px += resolution) {
    for (let py = padding; py < canvasHeight.value - padding; py += resolution) {
      const roomX = toRoomX(px + resolution / 2)
      const roomZ = toRoomY(py + resolution / 2)

      const point: Point3D = { x: roomX, y: listenerHeight, z: roomZ }
      const result = acoustics.calculateSPLAtPoint(
        point,
        speakerPosition,
        speaker,
        speakerStore.deployment
      )

      const color = getSPLColor(result.spl)
      ctx.fillStyle = color
      ctx.fillRect(px, py, resolution, resolution)
    }
  }
}

function drawSpeaker(ctx: CanvasRenderingContext2D) {
  const speakerX = toCanvasX(roomStore.width / 2)
  const speakerY = toCanvasY(0) + 10

  // Speaker icon
  ctx.fillStyle = '#00ff88'
  ctx.beginPath()
  ctx.arc(speakerX, speakerY, 8, 0, Math.PI * 2)
  ctx.fill()

  // Speaker label
  ctx.fillStyle = '#00ff88'
  ctx.font = '10px JetBrains Mono, monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`${speakerStore.quantity}x`, speakerX, speakerY + 22)
}

function drawCoverageCone(ctx: CanvasRenderingContext2D, speaker: any) {
  const speakerX = toCanvasX(roomStore.width / 2)
  const speakerY = toCanvasY(0)

  const horzAngle = (speaker.specs.horzDispersion / 2) * (Math.PI / 180)
  const aimAngle = speakerStore.horizontalAim * (Math.PI / 180)

  // Calculate cone endpoints at room depth
  const depthInCanvas = toCanvasY(roomStore.depth) - speakerY
  const leftAngle = aimAngle - horzAngle
  const rightAngle = aimAngle + horzAngle

  const leftX = speakerX + Math.sin(leftAngle) * depthInCanvas * 2
  const rightX = speakerX + Math.sin(rightAngle) * depthInCanvas * 2
  const endY = toCanvasY(roomStore.depth)

  // Draw coverage cone outline
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(speakerX, speakerY + 10)
  ctx.lineTo(leftX, endY)
  ctx.moveTo(speakerX, speakerY + 10)
  ctx.lineTo(rightX, endY)
  ctx.stroke()
  ctx.setLineDash([])

  // Fill coverage area
  ctx.fillStyle = 'rgba(0, 255, 136, 0.05)'
  ctx.beginPath()
  ctx.moveTo(speakerX, speakerY + 10)
  ctx.lineTo(leftX, endY)
  ctx.lineTo(rightX, endY)
  ctx.closePath()
  ctx.fill()
}

function drawLegend(ctx: CanvasRenderingContext2D) {
  const legendX = canvasWidth.value - 90
  const legendY = 50
  const legendHeight = 100
  const legendWidth = 15

  // Draw gradient bar
  const gradient = ctx.createLinearGradient(0, legendY + legendHeight, 0, legendY)
  if (settingsStore.splColorScheme === 'neon') {
    gradient.addColorStop(0, 'rgba(0, 0, 255, 0.8)')
    gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 136, 0, 0.8)')
  } else if (settingsStore.splColorScheme === 'thermal') {
    gradient.addColorStop(0, 'rgba(0, 0, 255, 0.8)')
    gradient.addColorStop(0.33, 'rgba(0, 255, 255, 0.8)')
    gradient.addColorStop(0.66, 'rgba(255, 255, 0, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0.8)')
  } else {
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)')
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0.8)')
  }

  ctx.fillStyle = gradient
  ctx.fillRect(legendX, legendY, legendWidth, legendHeight)

  // Border
  ctx.strokeStyle = '#2a2a3a'
  ctx.lineWidth = 1
  ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

  // Labels
  ctx.fillStyle = '#6a6a7a'
  ctx.font = '10px JetBrains Mono, monospace'
  ctx.textAlign = 'left'
  ctx.fillText('110dB', legendX + 20, legendY + 5)
  ctx.fillText('90dB', legendX + 20, legendY + legendHeight / 2 + 3)
  ctx.fillText('70dB', legendX + 20, legendY + legendHeight)
}

function drawProbe(ctx: CanvasRenderingContext2D) {
  if (!mousePos.value || !probeData.value) return

  const { x, y } = mousePos.value
  const { spl, distance } = probeData.value

  const padding = 8
  const boxWidth = 80
  const boxHeight = 40

  // Position box to not go off canvas
  let boxX = x + 15
  let boxY = y - 45
  if (boxX + boxWidth > canvasWidth.value) boxX = x - boxWidth - 15
  if (boxY < 0) boxY = y + 15

  // Draw background
  ctx.fillStyle = 'rgba(18, 18, 26, 0.95)'
  ctx.strokeStyle = '#2a2a3a'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 4)
  ctx.fill()
  ctx.stroke()

  // Draw text
  ctx.fillStyle = '#00ff88'
  ctx.font = 'bold 12px JetBrains Mono, monospace'
  ctx.textAlign = 'left'
  ctx.fillText(`${spl.toFixed(1)} dB`, boxX + padding, boxY + 18)

  ctx.fillStyle = '#6a6a7a'
  ctx.font = '10px JetBrains Mono, monospace'
  ctx.fillText(`${distance.toFixed(1)}m`, boxX + padding, boxY + 32)

  // Draw crosshair
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x - 10, y)
  ctx.lineTo(x + 10, y)
  ctx.moveTo(x, y - 10)
  ctx.lineTo(x, y + 10)
  ctx.stroke()
}

function handleMouseMove(event: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const padding = 40
  if (
    x < padding ||
    x > canvasWidth.value - padding ||
    y < padding ||
    y > canvasHeight.value - padding
  ) {
    mousePos.value = null
    probeData.value = null
    return
  }

  mousePos.value = { x, y }

  const speaker = speakerStore.selectedSpeaker
  if (!speaker) return

  const roomX = toRoomX(x)
  const roomZ = toRoomY(y)
  const listenerHeight = 1.4

  const speakerPosition: Point3D = {
    x: roomStore.width / 2,
    y: speakerStore.trimHeight,
    z: 0,
  }

  if (settingsStore.showSPL) {
    const point: Point3D = { x: roomX, y: listenerHeight, z: roomZ }
    const result = acoustics.calculateSPLAtPoint(
      point,
      speakerPosition,
      speaker,
      speakerStore.deployment
    )

    probeData.value = {
      spl: result.spl,
      distance: result.distance,
    }
  } else {
    // When SPL is hidden, avoid heavy computation and clear probe data
    probeData.value = null
  }

  requestDraw()
}

function handleMouseLeave() {
  mousePos.value = null
  probeData.value = null
  requestDraw()
}

function handleResize() {
  if (containerRef.value) {
    canvasWidth.value = containerRef.value.clientWidth
    canvasHeight.value = containerRef.value.clientHeight
  }
  draw()
}

// Watch for changes and redraw
watch(
  [
    () => roomStore.dimensions,
    () => speakerStore.deployment,
    () => speakerStore.selectedSpeaker,
    () => settingsStore.showGrid,
    () => settingsStore.showLegend,
    () => settingsStore.showSPL,
    () => settingsStore.splColorScheme,
  ],
  () => {
    requestDraw()
  },
  { deep: true }
)

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Expose draw method for PDF export
defineExpose({ draw, canvasRef })
</script>

<template>
  <div
    ref="containerRef"
    class="canvas-container w-full h-full blueprint-grid"
  >
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      class="w-full h-full"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    />

    <!-- View label -->
    <div class="absolute top-2 left-2 px-2 py-1 bg-audio-panel/80 rounded text-xs text-audio-muted">
      Top View (Bird's Eye)
    </div>
  </div>
</template>
