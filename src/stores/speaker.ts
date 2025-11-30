/**
 * Speaker Configuration Store
 *
 * Manages the selected speaker system and deployment configuration.
 * This store handles speaker selection, quantity, positioning, and
 * works with the acoustics composable for coverage calculations.
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  type SpeakerModel,
  type SpeakerDeployment,
  getSpeakerById,
  getMainSpeakers,
  getCompatibleSubwoofers,
} from '@/data/speakers'
import { useAcoustics } from '@/composables/useAcoustics'
import { useRoomStore } from './room'

export const useSpeakerStore = defineStore('speaker', () => {
  const acoustics = useAcoustics()
  const roomStore = useRoomStore()

  // ============================================
  // State
  // ============================================

  /** Currently selected main speaker ID */
  const selectedSpeakerId = ref('jbl-vrx932lap')

  /** Number of main speakers */
  const quantity = ref(4)

  /** Currently selected subwoofer ID */
  const selectedSubId = ref<string | undefined>('jbl-vrx918sp')

  /** Number of subwoofers */
  const subQuantity = ref(2)

  /** Trim height in meters (bottom of array to floor) */
  const trimHeight = ref(4)

  /** Tilt angle in degrees (positive = downward) */
  const tiltAngle = ref(8)

  /** Horizontal aim angle in degrees (0 = straight ahead) */
  const horizontalAim = ref(0)

  // ============================================
  // Getters
  // ============================================

  /** Currently selected speaker model */
  const selectedSpeaker = computed<SpeakerModel | undefined>(() =>
    getSpeakerById(selectedSpeakerId.value)
  )

  /** Currently selected subwoofer model */
  const selectedSubwoofer = computed<SpeakerModel | undefined>(() =>
    selectedSubId.value ? getSpeakerById(selectedSubId.value) : undefined
  )

  /** Available main speakers for selection */
  const availableSpeakers = computed(() => getMainSpeakers())

  /** Compatible subwoofers for selected main speaker */
  const compatibleSubwoofers = computed(() =>
    getCompatibleSubwoofers(selectedSpeakerId.value)
  )

  /** Maximum array size for selected speaker */
  const maxArraySize = computed(() => selectedSpeaker.value?.maxArraySize || 12)

  /** Complete deployment configuration */
  const deployment = computed<SpeakerDeployment>(() => ({
    speakerId: selectedSpeakerId.value,
    quantity: quantity.value,
    subId: selectedSubId.value,
    subQuantity: subQuantity.value,
    trimHeight: trimHeight.value,
    tiltAngle: tiltAngle.value,
    horizontalAim: horizontalAim.value,
  }))

  /** Bill of Materials for current configuration */
  const bom = computed(() => acoustics.estimateBOM(deployment.value))

  /** Total system cost */
  const totalCost = computed(() => bom.value.subtotal)

  /** Formatted total cost string */
  const formattedTotalCost = computed(() =>
    acoustics.formatCurrency(totalCost.value, bom.value.currency)
  )

  /** Coverage analysis for current configuration */
  const coverageAnalysis = computed(() => {
    if (!selectedSpeaker.value) return null
    return acoustics.analyzeCoverage(
      roomStore.dimensions,
      selectedSpeaker.value,
      deployment.value
    )
  })

  /** SPL at center stage */
  const centerStageSPL = computed(() =>
    coverageAnalysis.value
      ? acoustics.formatSPL(coverageAnalysis.value.centerStageSPL)
      : '--'
  )

  /** Whether current config has ceiling reflection issues */
  const hasCeilingReflection = computed(() =>
    coverageAnalysis.value?.hasCeilingReflection || false
  )

  /** Total array height in meters */
  const arrayHeight = computed(() => {
    if (!selectedSpeaker.value) return 0
    // Approximate based on element height (usually around 0.25-0.35m per element)
    const elementHeight = selectedSpeaker.value.meta.dimensions.height / 1000
    return quantity.value * elementHeight
  })

  /** Top of array height from floor */
  const topOfArrayHeight = computed(() =>
    trimHeight.value + arrayHeight.value
  )

  // ============================================
  // Actions
  // ============================================

  /**
   * Select a new main speaker.
   * Automatically updates subwoofer to first compatible option.
   */
  function selectSpeaker(id: string) {
    const speaker = getSpeakerById(id)
    if (!speaker) return

    selectedSpeakerId.value = id

    // Update subwoofer to first compatible option
    const compatibleSubs = getCompatibleSubwoofers(id)
    if (compatibleSubs.length > 0 && compatibleSubs[0]) {
      selectedSubId.value = compatibleSubs[0].id
    } else {
      selectedSubId.value = undefined
      subQuantity.value = 0
    }

    // Clamp quantity to max array size
    if (speaker.maxArraySize && quantity.value > speaker.maxArraySize) {
      quantity.value = speaker.maxArraySize
    }
  }

  /**
   * Select a subwoofer.
   */
  function selectSubwoofer(id: string | undefined) {
    selectedSubId.value = id
    if (!id) {
      subQuantity.value = 0
    } else if (subQuantity.value === 0) {
      subQuantity.value = 2
    }
  }

  /**
   * Set the number of main speakers.
   */
  function setQuantity(value: number) {
    const max = maxArraySize.value
    quantity.value = Math.max(1, Math.min(max, value))
  }

  /**
   * Set the number of subwoofers.
   */
  function setSubQuantity(value: number) {
    subQuantity.value = Math.max(0, Math.min(12, value))
  }

  /**
   * Set the trim height.
   */
  function setTrimHeight(value: number) {
    trimHeight.value = Math.max(2, Math.min(roomStore.height - 1, value))
  }

  /**
   * Set the tilt angle.
   */
  function setTiltAngle(value: number) {
    tiltAngle.value = Math.max(-15, Math.min(45, value))
  }

  /**
   * Set the horizontal aim angle.
   */
  function setHorizontalAim(value: number) {
    horizontalAim.value = Math.max(-45, Math.min(45, value))
  }

  /**
   * Reset to default configuration.
   */
  function resetToDefaults() {
    selectedSpeakerId.value = 'jbl-vrx932lap'
    quantity.value = 4
    selectedSubId.value = 'jbl-vrx918sp'
    subQuantity.value = 2
    trimHeight.value = 4
    tiltAngle.value = 8
    horizontalAim.value = 0
  }

  /**
   * Auto-calculate optimal tilt angle based on room dimensions.
   */
  function autoCalculateTilt() {
    const targetDistance = roomStore.depth / 2
    const heightAboveListener = trimHeight.value - 1.4 // Ear height
    const optimalAngle = Math.atan2(heightAboveListener, targetDistance) * (180 / Math.PI)
    setTiltAngle(Math.round(optimalAngle))
  }

  /**
   * Suggest optimal trim height based on room.
   */
  function suggestTrimHeight() {
    // Rule of thumb: trim height should be about 60-70% of room height
    const suggested = roomStore.height * 0.65
    setTrimHeight(Math.round(suggested * 2) / 2) // Round to nearest 0.5m
  }

  // Watch for room height changes and adjust trim height if needed
  watch(
    () => roomStore.height,
    (newHeight) => {
      if (trimHeight.value > newHeight - 1) {
        trimHeight.value = Math.max(2, newHeight - 1)
      }
    }
  )

  return {
    // State
    selectedSpeakerId,
    quantity,
    selectedSubId,
    subQuantity,
    trimHeight,
    tiltAngle,
    horizontalAim,

    // Getters
    selectedSpeaker,
    selectedSubwoofer,
    availableSpeakers,
    compatibleSubwoofers,
    maxArraySize,
    deployment,
    bom,
    totalCost,
    formattedTotalCost,
    coverageAnalysis,
    centerStageSPL,
    hasCeilingReflection,
    arrayHeight,
    topOfArrayHeight,

    // Actions
    selectSpeaker,
    selectSubwoofer,
    setQuantity,
    setSubQuantity,
    setTrimHeight,
    setTiltAngle,
    setHorizontalAim,
    resetToDefaults,
    autoCalculateTilt,
    suggestTrimHeight,
  }
})
