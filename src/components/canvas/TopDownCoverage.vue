<script setup lang="ts">
/**
 * TopDownCoverage Component
 *
 * Visualizes horizontal speaker coverage from a bird's-eye view.
 * Shows the room layout with SPL heatmap and coverage cones.
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
const canvasHeight = ref(400)
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

// Debounce for reactive bursts (sliders/view switches)
let debounceId: number | null = null
function requestDrawDebounced(delay = 70) {
  if (debounceId != null) clearTimeout(debounceId)
  debounceId = window.setTimeout(() => {
    requestDraw()
  }, delay)
}

// Mouse position for probe tooltip
const mousePos = ref<{ x: number; y: number } | null>(null)
const probeData = ref<{ spl: number; distance: number } | null>(null)

// Progressive heatmap state
const isComputingHeatmap = ref(false)
let heatmapGeneration = 0

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

  // Draw base geometry first so it appears above the progressive heatmap background

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

  // Probe tooltip/crosshair is rendered on overlay canvas to avoid full redraws on hover

  // Start/continue progressive heatmap (only when enabled)
  if (settingsStore.showSPL) {
    startHeatmap(ctx, speaker)
  } else {
    // cancel any in-flight heatmap job
    if (isComputingHeatmap.value) emit('heatmap-end')
    heatmapGeneration++
    isComputingHeatmap.value = false
  }

  // Re-draw probe overlay if we have hover data
  drawProbeOverlay()
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

function startHeatmap(ctx: CanvasRenderingContext2D, speaker: any) {
  const currentGen = ++heatmapGeneration
  const wasComputing = isComputingHeatmap.value
  isComputingHeatmap.value = true
  if (!wasComputing) emit('heatmap-start')

  // Slightly coarser default resolution for better interactivity
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const resolution = Math.max(10, Math.round(12 / Math.min(dpr, 2)))
  const padding = 40
  const listenerHeight = 1.4

  // Get center fill speaker if enabled
  const centerFillConfig = speakerStore.centerFill
  const centerFillSpeaker = speakerStore.selectedCenterFillSpeaker

  let px = padding
  let py = padding
  const maxX = canvasWidth.value - padding
  const maxY = canvasHeight.value - padding

  // Draw with normal composition so tiles are visible over the cleared background
  const prevComp = ctx.globalCompositeOperation
  ctx.globalCompositeOperation = 'source-over'

  const step = () => {
    if (currentGen !== heatmapGeneration) {
      // aborted
      ctx.globalCompositeOperation = prevComp
      isComputingHeatmap.value = false
      emit('heatmap-end')
      return
    }

    const frameStart = performance.now()
    const budget = 14 // ms per frame for SPL tiles

    while (px < maxX) {
      while (py < maxY) {
        const roomX = toRoomX(px + resolution / 2)
        const roomZ = toRoomY(py + resolution / 2)
        const point: Point3D = { x: roomX, y: listenerHeight, z: roomZ }

        // Use multi-source SPL calculation for L/R stereo + center fill
        const result = acoustics.calculateMultiSourceSPL(
          point,
          roomStore.width,
          speaker,
          speakerStore.deployment,
          centerFillConfig,
          centerFillSpeaker
        )
        ctx.fillStyle = getSPLColor(result.totalSPL)
        ctx.fillRect(px, py, resolution, resolution)

        py += resolution

        if (performance.now() - frameStart > budget) {
          requestAnimationFrame(step)
          return
        }
      }
      py = padding
      px += resolution
    }

    // done
    ctx.globalCompositeOperation = prevComp
    isComputingHeatmap.value = false
    emit('heatmap-end')
  }

  requestAnimationFrame(step)
}

function drawSpeaker(ctx: CanvasRenderingContext2D) {
  const deployment = speakerStore.deployment

  if (deployment.deploymentMode === 'L/R Stereo') {
    // Draw Left speaker
    const leftX = toCanvasX((roomStore.width / 2) - (deployment.arraySpread / 2))
    const speakerY = toCanvasY(0) + 10

    ctx.fillStyle = '#00ff88'
    ctx.beginPath()
    ctx.arc(leftX, speakerY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Left label
    ctx.fillStyle = '#00ff88'
    ctx.font = '10px JetBrains Mono, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`L ${speakerStore.quantity}x`, leftX, speakerY + 22)

    // Draw Right speaker
    const rightX = toCanvasX((roomStore.width / 2) + (deployment.arraySpread / 2))

    ctx.beginPath()
    ctx.arc(rightX, speakerY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Right label
    ctx.fillText(`R ${speakerStore.quantity}x`, rightX, speakerY + 22)

    // Draw center fill if enabled
    if (speakerStore.centerFill.enabled && speakerStore.selectedCenterFillSpeaker) {
      const centerX = toCanvasX(roomStore.width / 2)
      const fillY = toCanvasY(0) + 10

      ctx.fillStyle = '#00aaff'
      ctx.beginPath()
      ctx.arc(centerX, fillY, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#00aaff'
      ctx.font = '9px JetBrains Mono, monospace'
      ctx.fillText('CF', centerX, fillY + 20)
    }
  } else {
    // Center Mono mode - single speaker
    const speakerX = toCanvasX(roomStore.width / 2)
    const speakerY = toCanvasY(0) + 10

    ctx.fillStyle = '#00ff88'
    ctx.beginPath()
    ctx.arc(speakerX, speakerY, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#00ff88'
    ctx.font = '10px JetBrains Mono, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`${speakerStore.quantity}x`, speakerX, speakerY + 22)
  }
}

function drawCoverageCone(ctx: CanvasRenderingContext2D, speaker: any) {
  const deployment = speakerStore.deployment
  const horzAngle = (speaker.specs.horzDispersion / 2) * (Math.PI / 180)
  const endY = toCanvasY(roomStore.depth)
  const baseY = toCanvasY(0)
  const depthInCanvas = endY - baseY

  if (deployment.deploymentMode === 'L/R Stereo') {
    // Draw Left speaker cone
    const leftSpeakerX = toCanvasX((roomStore.width / 2) - (deployment.arraySpread / 2))
    // Left speaker aims right (toe-in)
    const leftAimAngle = speakerStore.horizontalAim * (Math.PI / 180)

    const leftConeLeft = leftSpeakerX + Math.sin(leftAimAngle - horzAngle) * depthInCanvas * 2
    const leftConeRight = leftSpeakerX + Math.sin(leftAimAngle + horzAngle) * depthInCanvas * 2

    // Draw left cone outline
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(leftSpeakerX, baseY + 10)
    ctx.lineTo(leftConeLeft, endY)
    ctx.moveTo(leftSpeakerX, baseY + 10)
    ctx.lineTo(leftConeRight, endY)
    ctx.stroke()

    // Fill left coverage area
    ctx.fillStyle = 'rgba(0, 255, 136, 0.03)'
    ctx.beginPath()
    ctx.moveTo(leftSpeakerX, baseY + 10)
    ctx.lineTo(leftConeLeft, endY)
    ctx.lineTo(leftConeRight, endY)
    ctx.closePath()
    ctx.fill()

    // Draw Right speaker cone
    const rightSpeakerX = toCanvasX((roomStore.width / 2) + (deployment.arraySpread / 2))
    // Right speaker aims left (toe-in)
    const rightAimAngle = -speakerStore.horizontalAim * (Math.PI / 180)

    const rightConeLeft = rightSpeakerX + Math.sin(rightAimAngle - horzAngle) * depthInCanvas * 2
    const rightConeRight = rightSpeakerX + Math.sin(rightAimAngle + horzAngle) * depthInCanvas * 2

    // Draw right cone outline
    ctx.beginPath()
    ctx.moveTo(rightSpeakerX, baseY + 10)
    ctx.lineTo(rightConeLeft, endY)
    ctx.moveTo(rightSpeakerX, baseY + 10)
    ctx.lineTo(rightConeRight, endY)
    ctx.stroke()
    ctx.setLineDash([])

    // Fill right coverage area
    ctx.fillStyle = 'rgba(0, 255, 136, 0.03)'
    ctx.beginPath()
    ctx.moveTo(rightSpeakerX, baseY + 10)
    ctx.lineTo(rightConeLeft, endY)
    ctx.lineTo(rightConeRight, endY)
    ctx.closePath()
    ctx.fill()

    // Draw center fill cone if enabled
    if (speakerStore.centerFill.enabled && speakerStore.selectedCenterFillSpeaker) {
      const cfSpeaker = speakerStore.selectedCenterFillSpeaker
      const cfHorzAngle = (cfSpeaker.specs.horzDispersion / 2) * (Math.PI / 180)
      const centerX = toCanvasX(roomStore.width / 2)

      const cfLeft = centerX + Math.sin(-cfHorzAngle) * depthInCanvas * 0.5
      const cfRight = centerX + Math.sin(cfHorzAngle) * depthInCanvas * 0.5

      ctx.strokeStyle = 'rgba(0, 170, 255, 0.4)'
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(centerX, baseY + 10)
      ctx.lineTo(cfLeft, baseY + depthInCanvas * 0.5)
      ctx.moveTo(centerX, baseY + 10)
      ctx.lineTo(cfRight, baseY + depthInCanvas * 0.5)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = 'rgba(0, 170, 255, 0.03)'
      ctx.beginPath()
      ctx.moveTo(centerX, baseY + 10)
      ctx.lineTo(cfLeft, baseY + depthInCanvas * 0.5)
      ctx.lineTo(cfRight, baseY + depthInCanvas * 0.5)
      ctx.closePath()
      ctx.fill()
    }
  } else {
    // Center Mono mode - single cone
    const speakerX = toCanvasX(roomStore.width / 2)
    const aimAngle = speakerStore.horizontalAim * (Math.PI / 180)

    const leftX = speakerX + Math.sin(aimAngle - horzAngle) * depthInCanvas * 2
    const rightX = speakerX + Math.sin(aimAngle + horzAngle) * depthInCanvas * 2

    ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(speakerX, baseY + 10)
    ctx.lineTo(leftX, endY)
    ctx.moveTo(speakerX, baseY + 10)
    ctx.lineTo(rightX, endY)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = 'rgba(0, 255, 136, 0.05)'
    ctx.beginPath()
    ctx.moveTo(speakerX, baseY + 10)
    ctx.lineTo(leftX, endY)
    ctx.lineTo(rightX, endY)
    ctx.closePath()
    ctx.fill()
  }
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

function drawProbeOverlay() {
  const overlay = overlayRef.value
  if (!overlay) return
  const ctx = overlay.getContext('2d')
  if (!ctx) return

  // Clear previous overlay
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  // Render only when SPL/probe is enabled and we have data
  if (!settingsStore.showSPL || !settingsStore.showProbe) return
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

  // Draw background box
  ctx.fillStyle = 'rgba(18, 18, 26, 0.95)'
  ctx.strokeStyle = '#2a2a3a'
  ctx.lineWidth = 1
  ctx.beginPath()
  // @ts-ignore - roundRect is supported in modern browsers
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 4)
  ctx.fill()
  ctx.stroke()

  // Text
  ctx.fillStyle = '#00ff88'
  ctx.font = 'bold 12px JetBrains Mono, monospace'
  ctx.textAlign = 'left'
  ctx.fillText(`${spl.toFixed(1)} dB`, boxX + padding, boxY + 18)

  ctx.fillStyle = '#6a6a7a'
  ctx.font = '10px JetBrains Mono, monospace'
  ctx.fillText(`${distance.toFixed(1)}m`, boxX + padding, boxY + 32)

  // Crosshair
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

  if (settingsStore.showSPL) {
    const point: Point3D = { x: roomX, y: listenerHeight, z: roomZ }

    // Use multi-source SPL calculation
    const result = acoustics.calculateMultiSourceSPL(
      point,
      roomStore.width,
      speaker,
      speakerStore.deployment,
      speakerStore.centerFill,
      speakerStore.selectedCenterFillSpeaker
    )

    probeData.value = {
      spl: result.totalSPL,
      distance: result.nearestDistance,
    }
  } else {
    // When SPL is hidden, avoid heavy computation and clear probe data
    probeData.value = null
  }

  // Update only the overlay on hover to avoid restarting heatmap
  drawProbeOverlay()
}

function handleMouseLeave() {
  mousePos.value = null
  probeData.value = null
  // Clear overlay without touching the base canvas
  const overlay = overlayRef.value
  const ctx = overlay?.getContext('2d')
  if (ctx) ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
}

function handleResize() {
  if (containerRef.value) {
    canvasWidth.value = containerRef.value.clientWidth
    canvasHeight.value = containerRef.value.clientHeight
  }
  requestDraw()
  // Ensure overlay is cleared/synced on resize
  const ctx = overlayRef.value?.getContext('2d')
  if (ctx) ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
}

// Watch for changes and redraw
watch(
  [
    () => roomStore.dimensions,
    () => speakerStore.deployment,
    () => speakerStore.selectedSpeaker,
    () => speakerStore.centerFill,
    () => speakerStore.selectedCenterFillSpeaker,
    () => settingsStore.showGrid,
    () => settingsStore.showLegend,
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
  // Observe container size changes (including 0 -> actual on tab switch)
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
  // Ensure first draw after mount when DOM has settled
  nextTick(() => requestDraw())
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    try { resizeObserver.disconnect() } catch {}
    resizeObserver = null
  }
})

// Expose draw method for PDF export and external triggers
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

    <!-- Overlay canvas for probe/crosshair/tooltip (no heavy redraws) -->
    <canvas
      ref="overlayRef"
      :width="canvasWidth"
      :height="canvasHeight"
      class="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />

    <!-- View label -->
    <div class="absolute top-2 left-2 px-2 py-1 bg-audio-panel/80 rounded text-xs text-audio-muted">
      Top View (Bird's Eye)
    </div>
  </div>
</template>
