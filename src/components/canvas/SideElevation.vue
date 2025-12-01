<script setup lang="ts">
/**
 * SideElevation Component
 *
 * Visualizes vertical speaker coverage from a side view.
 * Shows room depth vs height with SPL distribution and reflection warnings.
 */

import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoomStore, useSpeakerStore, useSettingsStore } from '@/stores'
import { useAcoustics, type Point3D } from '@/composables/useAcoustics'

const roomStore = useRoomStore()
const speakerStore = useSpeakerStore()
const settingsStore = useSettingsStore()
const acoustics = useAcoustics()

const emit = defineEmits<{
  'heatmap-start': []
  'heatmap-end': []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const overlayRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const canvasWidth = ref(600)
const canvasHeight = ref(300)
let resizeObserver: ResizeObserver | null = null

// rAF draw scheduler to batch rapid changes
let rafId: number | null = null
function requestDraw() {
  if (rafId != null) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    rafId = null
    draw()
  })
}

// Debounce redraws to coalesce rapid reactive changes
let debounceId: number | null = null
function requestDrawDebounced(delay = 70) {
  if (debounceId != null) clearTimeout(debounceId)
  debounceId = window.setTimeout(() => requestDraw(), delay)
}

// Mouse position for probe tooltip
const mousePos = ref<{ x: number; y: number } | null>(null)
const probeData = ref<{ spl: number; distance: number; height: number } | null>(null)

// Progressive heatmap state
const isComputingHeatmap = ref(false)
let heatmapGeneration = 0

// Padding
const PADDING = 40

// Convert room coordinates to canvas coordinates
function toCanvasX(roomZ: number): number {
  return PADDING + (roomZ / roomStore.depth) * (canvasWidth.value - PADDING * 2)
}

function toCanvasY(roomY: number): number {
  // Y is inverted (0 at bottom, height at top)
  return canvasHeight.value - PADDING - (roomY / roomStore.height) * (canvasHeight.value - PADDING * 2)
}

// Convert canvas to room coordinates
function toRoomZ(canvasX: number): number {
  return ((canvasX - PADDING) / (canvasWidth.value - PADDING * 2)) * roomStore.depth
}

function toRoomY(canvasY: number): number {
  return ((canvasHeight.value - PADDING - canvasY) / (canvasHeight.value - PADDING * 2)) * roomStore.height
}

// Get SPL color
function getSPLColor(spl: number): string {
  const scheme = settingsStore.splColorScheme
  const normalized = Math.max(0, Math.min(1, (spl - 70) / 40))

  if (scheme === 'mono') {
    return `rgba(0, 255, 136, ${normalized * 0.6})`
  }

  if (scheme === 'neon') {
    if (normalized < 0.5) {
      const t = normalized * 2
      return `rgba(0, ${Math.floor(255 * t)}, ${Math.floor(255 * (1 - t))}, 0.6)`
    } else {
      const t = (normalized - 0.5) * 2
      return `rgba(${Math.floor(255 * t)}, ${Math.floor(255 * (1 - t * 0.7))}, 0, 0.6)`
    }
  }

  // Thermal
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

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear overlay at the start of a full draw to avoid ghost tooltips
  const octx = overlayRef.value?.getContext('2d')
  if (octx) octx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  const speaker = speakerStore.selectedSpeaker
  if (!speaker) return

  // Clear canvas
  ctx.fillStyle = '#0a0a0f'
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value)

  // Draw grid
  if (settingsStore.showGrid) {
    drawGrid(ctx)
  }

  // Base geometry first

  // Draw room outline
  drawRoomOutline(ctx)

  // Draw speaker and array
  drawSpeaker(ctx)

  // Draw coverage cone
  drawCoverageCone(ctx, speaker)

  // Draw ceiling reflection warning
  if (settingsStore.showReflectionWarnings && speakerStore.hasCeilingReflection) {
    drawReflectionWarning(ctx, speaker)
  }

  // Draw audience area
  drawAudienceArea(ctx)

  // Draw legend (only when SPL is shown)
  if (settingsStore.showLegend && settingsStore.showSPL) {
    drawLegend(ctx)
  }

  // Probe tooltip/crosshair is drawn on the overlay canvas to avoid full redraws

  // Progressive heatmap start/continue
  if (settingsStore.showSPL) {
    startHeatmap(ctx, speaker)
  } else {
    heatmapGeneration++
    if (isComputingHeatmap.value) emit('heatmap-end')
    isComputingHeatmap.value = false
  }

  // Re-draw probe overlay if we have hover data
  drawProbeOverlay()
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(0, 170, 255, 0.1)'
  ctx.lineWidth = 1

  const gridSpacing = 5

  // Vertical lines (depth)
  for (let z = 0; z <= roomStore.depth; z += gridSpacing) {
    const x = toCanvasX(z)
    ctx.beginPath()
    ctx.moveTo(x, PADDING)
    ctx.lineTo(x, canvasHeight.value - PADDING)
    ctx.stroke()
  }

  // Horizontal lines (height)
  for (let y = 0; y <= roomStore.height; y += 2) {
    const canvasY = toCanvasY(y)
    ctx.beginPath()
    ctx.moveTo(PADDING, canvasY)
    ctx.lineTo(canvasWidth.value - PADDING, canvasY)
    ctx.stroke()
  }
}

function drawRoomOutline(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#00aaff'
  ctx.lineWidth = 2

  // Floor
  ctx.beginPath()
  ctx.moveTo(PADDING, toCanvasY(0))
  ctx.lineTo(canvasWidth.value - PADDING, toCanvasY(0))
  ctx.stroke()

  // Ceiling
  ctx.beginPath()
  ctx.moveTo(PADDING, toCanvasY(roomStore.height))
  ctx.lineTo(canvasWidth.value - PADDING, toCanvasY(roomStore.height))
  ctx.stroke()

  // Front wall (stage)
  ctx.beginPath()
  ctx.moveTo(PADDING, toCanvasY(0))
  ctx.lineTo(PADDING, toCanvasY(roomStore.height))
  ctx.stroke()

  // Back wall
  ctx.beginPath()
  ctx.moveTo(canvasWidth.value - PADDING, toCanvasY(0))
  ctx.lineTo(canvasWidth.value - PADDING, toCanvasY(roomStore.height))
  ctx.stroke()

  // Dimension labels
  ctx.fillStyle = '#6a6a7a'
  ctx.font = '11px JetBrains Mono, monospace'
  ctx.textAlign = 'center'

  // Depth label
  ctx.fillText(`${roomStore.depth.toFixed(1)}m`, canvasWidth.value / 2, canvasHeight.value - 10)

  // Height label
  ctx.save()
  ctx.translate(15, canvasHeight.value / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText(`${roomStore.height.toFixed(1)}m`, 0, 0)
  ctx.restore()

  // Labels
  ctx.fillStyle = '#4a4a5a'
  ctx.fillText('STAGE', PADDING + 30, toCanvasY(0) + 15)
  ctx.fillText('BACK', canvasWidth.value - PADDING - 30, toCanvasY(0) + 15)
}

function startHeatmap(ctx: CanvasRenderingContext2D, speaker: any) {
  const currentGen = ++heatmapGeneration
  const wasComputing = isComputingHeatmap.value
  isComputingHeatmap.value = true
  if (!wasComputing) emit('heatmap-start')

  // Slightly coarser default resolution for interactivity; account for DPR
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const resolution = Math.max(8, Math.round(12 / Math.min(dpr, 2)))

  const speakerPosition: Point3D = {
    x: roomStore.width / 2,
    y: speakerStore.trimHeight,
    z: 0,
  }

  let px = PADDING
  let py = PADDING
  const maxX = canvasWidth.value - PADDING
  const maxY = canvasHeight.value - PADDING

  // Draw with standard composition so tiles appear over cleared background
  const prevComp = ctx.globalCompositeOperation
  ctx.globalCompositeOperation = 'source-over'

  const step = () => {
    if (currentGen !== heatmapGeneration) {
      ctx.globalCompositeOperation = prevComp
      isComputingHeatmap.value = false
      emit('heatmap-end')
      return
    }

    const start = performance.now()
    const budget = 14

    while (px < maxX) {
      while (py < maxY) {
        const roomZ = toRoomZ(px + resolution / 2)
        const roomY = toRoomY(py + resolution / 2)
        if (roomY >= 0 && roomY <= roomStore.height) {
          const point: Point3D = { x: roomStore.width / 2, y: roomY, z: roomZ }
          const result = acoustics.calculateSPLAtPoint(
            point,
            speakerPosition,
            speaker,
            speakerStore.deployment
          )
          ctx.fillStyle = getSPLColor(result.spl)
          ctx.fillRect(px, py, resolution, resolution)
        }
        py += resolution
        if (performance.now() - start > budget) {
          requestAnimationFrame(step)
          return
        }
      }
      py = PADDING
      px += resolution
    }

    ctx.globalCompositeOperation = prevComp
    isComputingHeatmap.value = false
    emit('heatmap-end')
  }

  requestAnimationFrame(step)
}

function drawSpeaker(ctx: CanvasRenderingContext2D) {
  const speakerX = PADDING + 15
  const speakerY = toCanvasY(speakerStore.trimHeight)
  const arrayHeight = speakerStore.arrayHeight

  // Draw array bracket
  ctx.strokeStyle = '#00ff88'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(speakerX, speakerY)
  ctx.lineTo(speakerX, toCanvasY(speakerStore.trimHeight + arrayHeight))
  ctx.stroke()

  // Draw individual elements
  const elementCount = speakerStore.quantity
  const elementSpacing = (toCanvasY(speakerStore.trimHeight) - toCanvasY(speakerStore.trimHeight + arrayHeight)) / elementCount

  ctx.fillStyle = '#00ff88'
  for (let i = 0; i < elementCount; i++) {
    const elemY = speakerY - i * elementSpacing
    ctx.fillRect(speakerX - 4, elemY - 3, 12, 6)
  }

  // Trim height label
  ctx.fillStyle = '#00ff88'
  ctx.font = '10px JetBrains Mono, monospace'
  ctx.textAlign = 'left'
  ctx.fillText(`${speakerStore.trimHeight.toFixed(1)}m`, speakerX + 15, speakerY + 4)

  // Top of array label
  ctx.fillStyle = '#6a6a7a'
  ctx.fillText(`${speakerStore.topOfArrayHeight.toFixed(1)}m`, speakerX + 15, toCanvasY(speakerStore.topOfArrayHeight) + 4)
}

function drawCoverageCone(ctx: CanvasRenderingContext2D, speaker: any) {
  const speakerX = PADDING + 15
  const speakerCenterY = toCanvasY(speakerStore.trimHeight + speakerStore.arrayHeight / 2)

  const vertAngle = (speaker.specs.vertDispersion / 2) * (Math.PI / 180)
  const tiltAngle = speakerStore.tiltAngle * (Math.PI / 180)

  // Calculate cone edges
  const rayLength = canvasWidth.value - PADDING * 2

  const topAngle = tiltAngle - vertAngle
  const bottomAngle = tiltAngle + vertAngle

  const topEndX = speakerX + Math.cos(topAngle) * rayLength
  const topEndY = speakerCenterY + Math.sin(topAngle) * rayLength

  const bottomEndX = speakerX + Math.cos(bottomAngle) * rayLength
  const bottomEndY = speakerCenterY + Math.sin(bottomAngle) * rayLength

  // Draw cone outline
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(speakerX, speakerCenterY)
  ctx.lineTo(topEndX, topEndY)
  ctx.moveTo(speakerX, speakerCenterY)
  ctx.lineTo(bottomEndX, bottomEndY)
  ctx.stroke()
  ctx.setLineDash([])

  // Center axis (aim direction)
  const centerEndX = speakerX + Math.cos(tiltAngle) * rayLength
  const centerEndY = speakerCenterY + Math.sin(tiltAngle) * rayLength

  ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)'
  ctx.setLineDash([2, 4])
  ctx.beginPath()
  ctx.moveTo(speakerX, speakerCenterY)
  ctx.lineTo(centerEndX, centerEndY)
  ctx.stroke()
  ctx.setLineDash([])

  // Tilt angle indicator
  ctx.fillStyle = '#6a6a7a'
  ctx.font = '10px JetBrains Mono, monospace'
  const labelX = speakerX + 60
  const labelY = speakerCenterY + Math.sin(tiltAngle) * 60 + 4
  ctx.fillText(`${speakerStore.tiltAngle.toFixed(1)}°`, labelX, labelY)
}

function drawReflectionWarning(ctx: CanvasRenderingContext2D, speaker: any) {
  const speakerX = PADDING + 15
  const speakerCenterY = toCanvasY(speakerStore.trimHeight + speakerStore.arrayHeight / 2)
  const ceilingY = toCanvasY(roomStore.height)

  const vertAngle = (speaker.specs.vertDispersion / 2) * (Math.PI / 180)
  const tiltAngle = speakerStore.tiltAngle * (Math.PI / 180)
  const topAngle = tiltAngle - vertAngle

  // If top of coverage points up, check ceiling intersection
  if (topAngle < 0) {
    const rise = Math.tan(Math.abs(topAngle))
    const ceilingDistance = (speakerStore.trimHeight + speakerStore.arrayHeight / 2)
    const intersectionZ = ceilingDistance / rise

    if (intersectionZ > 0 && intersectionZ < roomStore.depth) {
      const intersectionX = toCanvasX(intersectionZ)

      // Draw warning highlight on ceiling
      ctx.fillStyle = 'rgba(255, 68, 68, 0.3)'
      ctx.fillRect(speakerX, ceilingY - 5, intersectionX - speakerX, 10)

      // Draw reflection ray
      ctx.strokeStyle = '#ff4444'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(speakerX, speakerCenterY)
      ctx.lineTo(intersectionX, ceilingY)
      ctx.stroke()
      ctx.setLineDash([])

      // Warning label
      ctx.fillStyle = '#ff4444'
      ctx.font = 'bold 10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('CEILING REFLECTION', (speakerX + intersectionX) / 2, ceilingY - 12)
    }
  }
}

function drawAudienceArea(ctx: CanvasRenderingContext2D) {
  const audienceStart = toCanvasX(2) // 2m from stage
  const audienceEnd = toCanvasX(roomStore.depth - 1) // 1m from back
  const floorY = toCanvasY(0)
  const earHeight = toCanvasY(1.4) // Ear height

  // Audience zone
  ctx.fillStyle = 'rgba(0, 170, 255, 0.1)'
  ctx.fillRect(audienceStart, earHeight, audienceEnd - audienceStart, floorY - earHeight)

  // Ear height line
  ctx.strokeStyle = 'rgba(0, 170, 255, 0.5)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(audienceStart, earHeight)
  ctx.lineTo(audienceEnd, earHeight)
  ctx.stroke()
  ctx.setLineDash([])

  // Label
  ctx.fillStyle = '#4a4a5a'
  ctx.font = '9px JetBrains Mono, monospace'
  ctx.textAlign = 'left'
  ctx.fillText('Ear Height 1.4m', audienceEnd + 5, earHeight + 3)
}

function drawLegend(ctx: CanvasRenderingContext2D) {
  const legendX = canvasWidth.value - 80
  const legendY = 50
  const legendHeight = 80
  const legendWidth = 12

  const gradient = ctx.createLinearGradient(0, legendY + legendHeight, 0, legendY)
  if (settingsStore.splColorScheme === 'neon') {
    gradient.addColorStop(0, 'rgba(0, 0, 255, 0.8)')
    gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 136, 0, 0.8)')
  } else if (settingsStore.splColorScheme === 'thermal') {
    gradient.addColorStop(0, 'rgba(0, 0, 255, 0.8)')
    gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0.8)')
  } else {
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)')
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0.8)')
  }

  ctx.fillStyle = gradient
  ctx.fillRect(legendX, legendY, legendWidth, legendHeight)

  ctx.strokeStyle = '#2a2a3a'
  ctx.lineWidth = 1
  ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

  ctx.fillStyle = '#6a6a7a'
  ctx.font = '9px JetBrains Mono, monospace'
  ctx.textAlign = 'left'
  ctx.fillText('110', legendX + 16, legendY + 5)
  ctx.fillText('70', legendX + 16, legendY + legendHeight)
}

function drawProbeOverlay() {
  const overlay = overlayRef.value
  if (!overlay) return
  const ctx = overlay.getContext('2d')
  if (!ctx) return

  // Clear previous overlay contents
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  if (!settingsStore.showSPL || !settingsStore.showProbe) return
  if (!mousePos.value || !probeData.value) return

  const { x, y } = mousePos.value
  const { spl, distance, height } = probeData.value

  const boxWidth = 90
  const boxHeight = 50
  let boxX = x + 15
  let boxY = y - 55
  if (boxX + boxWidth > canvasWidth.value) boxX = x - boxWidth - 15
  if (boxY < 0) boxY = y + 15

  ctx.fillStyle = 'rgba(18, 18, 26, 0.95)'
  ctx.strokeStyle = '#2a2a3a'
  ctx.lineWidth = 1
  ctx.beginPath()
  // @ts-ignore
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 4)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#00ff88'
  ctx.font = 'bold 12px JetBrains Mono, monospace'
  ctx.textAlign = 'left'
  ctx.fillText(`${spl.toFixed(1)} dB`, boxX + 8, boxY + 18)

  ctx.fillStyle = '#6a6a7a'
  ctx.font = '10px JetBrains Mono, monospace'
  ctx.fillText(`D: ${distance.toFixed(1)}m`, boxX + 8, boxY + 32)
  ctx.fillText(`H: ${height.toFixed(1)}m`, boxX + 8, boxY + 44)

  // Crosshair
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x - 8, y)
  ctx.lineTo(x + 8, y)
  ctx.moveTo(x, y - 8)
  ctx.lineTo(x, y + 8)
  ctx.stroke()
}

function handleMouseMove(event: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  if (
    x < PADDING ||
    x > canvasWidth.value - PADDING ||
    y < PADDING ||
    y > canvasHeight.value - PADDING
  ) {
    mousePos.value = null
    probeData.value = null
    return
  }

  mousePos.value = { x, y }

  const speaker = speakerStore.selectedSpeaker
  if (!speaker) return

  const roomZ = toRoomZ(x)
  const roomY = toRoomY(y)

  const speakerPosition: Point3D = {
    x: roomStore.width / 2,
    y: speakerStore.trimHeight,
    z: 0,
  }

  const point: Point3D = { x: roomStore.width / 2, y: roomY, z: roomZ }
  if (settingsStore.showSPL) {
    const result = acoustics.calculateSPLAtPoint(
      point,
      speakerPosition,
      speaker,
      speakerStore.deployment
    )

    probeData.value = {
      spl: result.spl,
      distance: result.distance,
      height: roomY,
    }
  } else {
    probeData.value = null
  }

  // Update only the overlay to avoid restarting the heatmap
  drawProbeOverlay()
}

function handleMouseLeave() {
  mousePos.value = null
  probeData.value = null
  // Clear overlay
  const ctx = overlayRef.value?.getContext('2d')
  if (ctx) ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
}

function handleResize() {
  if (containerRef.value) {
    canvasWidth.value = containerRef.value.clientWidth
    canvasHeight.value = containerRef.value.clientHeight
  }
  requestDraw()
  const ctx = overlayRef.value?.getContext('2d')
  if (ctx) ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
}

watch(
  [
    () => roomStore.dimensions,
    () => speakerStore.deployment,
    () => speakerStore.selectedSpeaker,
    () => settingsStore.showGrid,
    () => settingsStore.showLegend,
    () => settingsStore.showReflectionWarnings,
    () => settingsStore.showSPL,
    () => settingsStore.splColorScheme,
  ],
  () => {
    requestDrawDebounced()
  },
  { deep: true }
)

// Clear overlay when SPL is toggled off, or re-draw when on and hovering
watch(
  () => settingsStore.showSPL,
  (val) => {
    const ctx = overlayRef.value?.getContext('2d')
    if (!val && ctx) ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
    if (val) drawProbeOverlay()
  }
)

onMounted(() => {
  handleResize()
  if ('ResizeObserver' in window && containerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0 && (width !== canvasWidth.value || height !== canvasHeight.value)) {
          canvasWidth.value = Math.floor(width)
          canvasHeight.value = Math.floor(height)
          requestDraw()
        }
      }
    })
    resizeObserver.observe(containerRef.value)
  }
  window.addEventListener('resize', handleResize)
  nextTick(() => requestDraw())
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    try { resizeObserver.disconnect() } catch {}
    resizeObserver = null
  }
})

defineExpose({ draw, canvasRef })

// Trigger redraw when view mode changes and this view becomes visible
watch(
  () => settingsStore.viewMode,
  async () => {
    await nextTick()
    requestDraw()
  }
)
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

    <!-- Overlay canvas for probe UI -->
    <canvas
      ref="overlayRef"
      :width="canvasWidth"
      :height="canvasHeight"
      class="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />


    <div class="absolute top-2 left-2 px-2 py-1 bg-audio-panel/80 rounded text-xs text-audio-muted">
      Side Elevation
    </div>

    <!-- Reflection warning badge -->
    <div
      v-if="speakerStore.hasCeilingReflection && settingsStore.showReflectionWarnings"
      class="absolute top-2 right-2 px-2 py-1 bg-neon-red/20 border border-neon-red/50 rounded text-xs text-neon-red flex items-center gap-1"
    >
      <span class="w-2 h-2 bg-neon-red rounded-full animate-pulse"></span>
      Ceiling Reflection Detected
    </div>
  </div>
</template>
