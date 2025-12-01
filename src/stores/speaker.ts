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
  type CenterFillConfig,
  type DeploymentMode,
  type SystemTypeId,
  SystemTypeId as SystemTypeIds,
  getSpeakerById,
  getMainSpeakers,
  getCompatibleSubwoofers,
  getCenterFillSpeakers,
  getSpeakersBySystemType,
  getSystemTypeConfig,
} from '@/data/speakers'
import { useAcoustics } from '@/composables/useAcoustics'
import { useRoomStore } from './room'

export const useSpeakerStore = defineStore('speaker', () => {
  const acoustics = useAcoustics()
  const roomStore = useRoomStore()

  // ============================================
  // State
  // ============================================

  /** Currently selected system type */
  const selectedSystemType = ref<SystemTypeId>(SystemTypeIds.LineArrayLR)

  /** Currently selected main speaker ID */
  const selectedSpeakerId = ref('jbl-vrx932lap')

  /** Number of main speakers (per side in stereo mode) */
  const quantity = ref(4)

  /** Currently selected subwoofer ID */
  const selectedSubId = ref<string | undefined>('jbl-vrx918sp')

  /** Number of subwoofers */
  const subQuantity = ref(2)

  /** Trim height in meters (bottom of array to floor) */
  const trimHeight = ref(4)

  /** Tilt angle in degrees (positive = downward) */
  const tiltAngle = ref(8)

  /** Horizontal aim angle in degrees (0 = straight ahead, positive = toe-in) */
  const horizontalAim = ref(0)

  /** Deployment mode: L/R Stereo or Center Mono */
  const deploymentMode = ref<DeploymentMode>('L/R Stereo')

  /** Distance between L/R arrays in meters */
  const arraySpread = ref(8)

  /** Center fill configuration */
  const centerFill = ref<CenterFillConfig>({
    enabled: false,
    modelId: '',
    gain: 0,
  })

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

  /** Available main speakers for selection (all, unfiltered) */
  const availableSpeakers = computed(() => getMainSpeakers())

  /** Current system type configuration */
  const systemTypeConfig = computed(() => getSystemTypeConfig(selectedSystemType.value))

  /** Speakers filtered by current system type */
  const filteredSpeakers = computed(() => getSpeakersBySystemType(selectedSystemType.value))

  /** Unique brands from filtered speakers */
  const filteredBrands = computed(() => {
    const brands = new Set(filteredSpeakers.value.map((s) => s.brand))
    return Array.from(brands).sort()
  })

  /** Compatible subwoofers for selected main speaker */
  const compatibleSubwoofers = computed(() =>
    getCompatibleSubwoofers(selectedSpeakerId.value)
  )

  /** Available speakers for center fill use */
  const availableCenterFillSpeakers = computed(() => getCenterFillSpeakers())

  /** Currently selected center fill speaker model */
  const selectedCenterFillSpeaker = computed<SpeakerModel | undefined>(() =>
    centerFill.value.modelId ? getSpeakerById(centerFill.value.modelId) : undefined
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
    deploymentMode: deploymentMode.value,
    arraySpread: arraySpread.value,
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

  /** Mounting options for the selected speaker */
  const mountingOptions = computed(() => selectedSpeaker.value?.mountingOptions)

  /** Whether the speaker can be flown (rigged) */
  const canFly = computed(() => mountingOptions.value?.canFly ?? true)

  /** Whether the speaker can be ground-stacked or pole-mounted */
  const canGroundStack = computed(() => mountingOptions.value?.canGroundStack ?? true)

  /** Maximum deployment height based on speaker type */
  const maxDeploymentHeight = computed(() => {
    const speakerMax = mountingOptions.value?.maxHeight ?? 20
    return Math.min(speakerMax, roomStore.height - 1)
  })

  /** Minimum deployment height based on speaker type */
  const minDeploymentHeight = computed(() =>
    mountingOptions.value?.minHeight ?? 2
  )

  /** Whether tilt is fixed for this speaker */
  const hasFixedTilt = computed(() =>
    mountingOptions.value?.fixedTilt !== undefined
  )

  /** Fixed tilt value (if applicable) */
  const fixedTiltValue = computed(() =>
    mountingOptions.value?.fixedTilt
  )

  /** Whether this is a column with asymmetrical coverage */
  const isAsymmetrical = computed(() =>
    mountingOptions.value?.isAsymmetrical ?? false
  )

  /** Label for height control based on speaker type */
  const heightControlLabel = computed(() =>
    canFly.value ? 'Trim Height' : 'Stand/Pole Height'
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
   * Set the trim height, respecting speaker mounting constraints.
   */
  function setTrimHeight(value: number) {
    const min = minDeploymentHeight.value
    const max = maxDeploymentHeight.value
    trimHeight.value = Math.max(min, Math.min(max, value))
  }

  /**
   * Set the tilt angle, respecting fixed tilt constraints.
   */
  function setTiltAngle(value: number) {
    // If tilt is fixed, don't allow changes
    if (hasFixedTilt.value && fixedTiltValue.value !== undefined) {
      tiltAngle.value = fixedTiltValue.value
      return
    }
    tiltAngle.value = Math.max(-15, Math.min(45, value))
  }

  /**
   * Set the horizontal aim angle.
   */
  function setHorizontalAim(value: number) {
    horizontalAim.value = Math.max(-45, Math.min(45, value))
  }

  /**
   * Set the deployment mode.
   */
  function setDeploymentMode(mode: DeploymentMode) {
    deploymentMode.value = mode
  }

  /**
   * Set the system type.
   * This updates filtered speakers and applies sensible defaults.
   */
  function setSystemType(type: SystemTypeId) {
    selectedSystemType.value = type
    const config = getSystemTypeConfig(type)

    // Apply default deployment mode
    deploymentMode.value = config.defaultDeploymentMode

    // Apply default quantity
    quantity.value = config.defaultQuantity

    // Apply default height
    trimHeight.value = config.defaultHeight

    // Select first available speaker of this system type
    const speakers = getSpeakersBySystemType(type)
    if (speakers.length > 0 && speakers[0]) {
      selectSpeaker(speakers[0].id)
    }

    // Handle subs based on system type preference
    if (!config.usesSubs) {
      selectedSubId.value = undefined
      subQuantity.value = 0
    }
  }

  /**
   * Set the array spread (distance between L/R arrays).
   */
  function setArraySpread(value: number) {
    // Clamp to reasonable range (0 to room width minus some margin)
    const maxSpread = Math.max(0, roomStore.width - 2)
    arraySpread.value = Math.max(0, Math.min(maxSpread, value))
  }

  /**
   * Toggle center fill enabled state.
   */
  function setCenterFillEnabled(enabled: boolean) {
    centerFill.value.enabled = enabled
    // If enabling and no model selected, default to first available
    if (enabled && !centerFill.value.modelId) {
      const speakers = getCenterFillSpeakers()
      if (speakers.length > 0 && speakers[0]) {
        centerFill.value.modelId = speakers[0].id
      }
    }
  }

  /**
   * Set the center fill speaker model.
   */
  function setCenterFillModel(modelId: string) {
    centerFill.value.modelId = modelId
  }

  /**
   * Set the center fill gain adjustment.
   */
  function setCenterFillGain(gain: number) {
    centerFill.value.gain = Math.max(-12, Math.min(6, gain))
  }

  /**
   * Reset to default configuration.
   */
  function resetToDefaults() {
    selectedSystemType.value = SystemTypeIds.LineArrayLR
    selectedSpeakerId.value = 'jbl-vrx932lap'
    quantity.value = 4
    selectedSubId.value = 'jbl-vrx918sp'
    subQuantity.value = 2
    trimHeight.value = 4
    tiltAngle.value = 8
    horizontalAim.value = 0
    deploymentMode.value = 'L/R Stereo'
    arraySpread.value = 8
    centerFill.value = {
      enabled: false,
      modelId: '',
      gain: 0,
    }
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
   * Suggest optimal trim height based on room and speaker constraints.
   */
  function suggestTrimHeight() {
    // For non-flyable systems, suggest max stand height
    if (!canFly.value) {
      setTrimHeight(maxDeploymentHeight.value)
      return
    }
    // Rule of thumb: trim height should be about 60-70% of room height
    const suggested = roomStore.height * 0.65
    setTrimHeight(Math.round(suggested * 2) / 2) // Round to nearest 0.5m
  }

  // Watch for room height changes and adjust trim height if needed
  watch(
    () => roomStore.height,
    (newHeight) => {
      const max = Math.min(maxDeploymentHeight.value, newHeight - 1)
      if (trimHeight.value > max) {
        trimHeight.value = Math.max(minDeploymentHeight.value, max)
      }
    }
  )

  // Watch for speaker changes and adjust constraints
  watch(
    () => selectedSpeaker.value,
    (newSpeaker) => {
      if (!newSpeaker) return

      const mounting = newSpeaker.mountingOptions

      // Auto-adjust trim height if it exceeds the new max
      const maxHeight = Math.min(mounting.maxHeight, roomStore.height - 1)
      const minHeight = mounting.minHeight ?? 2
      if (trimHeight.value > maxHeight) {
        trimHeight.value = maxHeight
      }
      if (trimHeight.value < minHeight) {
        trimHeight.value = minHeight
      }

      // Apply fixed tilt if defined
      if (mounting.fixedTilt !== undefined) {
        tiltAngle.value = mounting.fixedTilt
      }

      // For columns/non-arrayable, set quantity to 1
      if (!newSpeaker.arrayable) {
        quantity.value = 1
      }
    }
  )

  return {
    // State
    selectedSystemType,
    selectedSpeakerId,
    quantity,
    selectedSubId,
    subQuantity,
    trimHeight,
    tiltAngle,
    horizontalAim,
    deploymentMode,
    arraySpread,
    centerFill,

    // Getters
    selectedSpeaker,
    selectedSubwoofer,
    availableSpeakers,
    systemTypeConfig,
    filteredSpeakers,
    filteredBrands,
    compatibleSubwoofers,
    availableCenterFillSpeakers,
    selectedCenterFillSpeaker,
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
    // Mounting options
    mountingOptions,
    canFly,
    canGroundStack,
    maxDeploymentHeight,
    minDeploymentHeight,
    hasFixedTilt,
    fixedTiltValue,
    isAsymmetrical,
    heightControlLabel,

    // Actions
    setSystemType,
    selectSpeaker,
    selectSubwoofer,
    setQuantity,
    setSubQuantity,
    setTrimHeight,
    setTiltAngle,
    setHorizontalAim,
    setDeploymentMode,
    setArraySpread,
    setCenterFillEnabled,
    setCenterFillModel,
    setCenterFillGain,
    resetToDefaults,
    autoCalculateTilt,
    suggestTrimHeight,
  }
})
