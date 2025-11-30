/**
 * Room State Store
 *
 * Manages the room dimensions and configuration for the acoustic simulation.
 * This store provides reactive state for the room parameters that affect
 * speaker coverage calculations.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Room dimensions interface.
 */
export interface RoomDimensions {
  /** Room width in meters */
  width: number
  /** Room depth in meters (distance from stage to back) */
  depth: number
  /** Room ceiling height in meters */
  height: number
}

export const useRoomStore = defineStore('room', () => {
  // ============================================
  // State
  // ============================================

  /** Room width in meters */
  const width = ref(15)

  /** Room depth in meters */
  const depth = ref(20)

  /** Room height in meters */
  const height = ref(6)

  /** Project/venue name */
  const projectName = ref('Untitled Project')

  /** Venue name */
  const venueName = ref('')

  /** Project notes */
  const notes = ref('')

  // ============================================
  // Getters
  // ============================================

  /** Complete room dimensions object */
  const dimensions = computed<RoomDimensions>(() => ({
    width: width.value,
    depth: depth.value,
    height: height.value,
  }))

  /** Room floor area in square meters */
  const floorArea = computed(() => width.value * depth.value)

  /** Room volume in cubic meters */
  const volume = computed(() => width.value * depth.value * height.value)

  /** Estimated audience capacity (0.5 sqm per person for standing) */
  const estimatedCapacity = computed(() => Math.floor(floorArea.value * 0.8 / 0.5))

  /** Room aspect ratio (width:depth) */
  const aspectRatio = computed(() => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const divisor = gcd(Math.round(width.value), Math.round(depth.value))
    return `${Math.round(width.value / divisor)}:${Math.round(depth.value / divisor)}`
  })

  // ============================================
  // Actions
  // ============================================

  /**
   * Update room width.
   * @param value - New width in meters (clamped to 5-100m)
   */
  function setWidth(value: number) {
    width.value = Math.max(5, Math.min(100, value))
  }

  /**
   * Update room depth.
   * @param value - New depth in meters (clamped to 5-200m)
   */
  function setDepth(value: number) {
    depth.value = Math.max(5, Math.min(200, value))
  }

  /**
   * Update room height.
   * @param value - New height in meters (clamped to 3-30m)
   */
  function setHeight(value: number) {
    height.value = Math.max(3, Math.min(30, value))
  }

  /**
   * Set all room dimensions at once.
   */
  function setDimensions(dims: Partial<RoomDimensions>) {
    if (dims.width !== undefined) setWidth(dims.width)
    if (dims.depth !== undefined) setDepth(dims.depth)
    if (dims.height !== undefined) setHeight(dims.height)
  }

  /**
   * Update project name.
   */
  function setProjectName(name: string) {
    projectName.value = name.trim()
  }

  /**
   * Update venue name.
   */
  function setVenueName(name: string) {
    venueName.value = name.trim()
  }

  /**
   * Update project notes.
   */
  function setNotes(text: string) {
    notes.value = text
  }

  /**
   * Reset room to default dimensions.
   */
  function resetToDefaults() {
    width.value = 15
    depth.value = 20
    height.value = 6
    projectName.value = 'Untitled Project'
    venueName.value = ''
    notes.value = ''
  }

  /**
   * Apply a room preset.
   */
  function applyPreset(preset: 'small' | 'medium' | 'large' | 'outdoor') {
    const presets: Record<string, RoomDimensions> = {
      small: { width: 10, depth: 12, height: 4 },
      medium: { width: 15, depth: 25, height: 6 },
      large: { width: 25, depth: 40, height: 10 },
      outdoor: { width: 40, depth: 60, height: 20 },
    }
    const dims = presets[preset]
    if (dims) setDimensions(dims)
  }

  return {
    // State
    width,
    depth,
    height,
    projectName,
    venueName,
    notes,

    // Getters
    dimensions,
    floorArea,
    volume,
    estimatedCapacity,
    aspectRatio,

    // Actions
    setWidth,
    setDepth,
    setHeight,
    setDimensions,
    setProjectName,
    setVenueName,
    setNotes,
    resetToDefaults,
    applyPreset,
  }
})
