/**
 * Acoustic Physics Engine Composable
 *
 * This module provides all acoustic calculations for the SonicDraft application.
 * It implements industry-standard formulas for SPL propagation, coverage patterns,
 * and sound system analysis.
 *
 * References:
 * - Inverse Square Law: I ∝ 1/r² (6dB per doubling of distance)
 * - Cylindrical Spreading: I ∝ 1/r (3dB per doubling of distance)
 * - Line Source Decay: Transition from cylindrical to spherical spreading
 *
 * @module useAcoustics
 */

import {
  getSpeakerById,
  SpeakerType,
  type SpeakerModel,
  type SpeakerDeployment,
  type BOMItem,
  type BillOfMaterials,
} from '@/data/speakers'

/**
 * Point in 2D or 3D space.
 */
export interface Point2D {
  x: number
  y: number
}

export interface Point3D extends Point2D {
  z: number
}

/**
 * Result of SPL calculation at a specific point.
 */
export interface SPLResult {
  /** Total SPL in dB at this point */
  spl: number
  /** Distance from source in meters */
  distance: number
  /** Horizontal off-axis angle in degrees */
  horzAngle: number
  /** Vertical off-axis angle in degrees */
  vertAngle: number
  /** Combined off-axis attenuation in dB */
  attenuation: number
  /** Whether this point is within the coverage pattern */
  inCoverage: boolean
}

/**
 * Coverage analysis result.
 */
export interface CoverageAnalysis {
  /** SPL at center stage (front center at ear height) */
  centerStageSPL: number
  /** SPL at the front row */
  frontRowSPL: number
  /** SPL at the back row */
  backRowSPL: number
  /** Front-to-back ratio in dB (ideally < 6dB) */
  frontToBackRatio: number
  /** Whether there's potential ceiling reflection */
  hasCeilingReflection: boolean
  /** Percentage of audience area with adequate coverage */
  coveragePercentage: number
}

/**
 * Composable providing acoustic calculation utilities.
 *
 * @example
 * ```typescript
 * const { calculateInverseSquare, getOffAxisAttenuation, estimateBOM } = useAcoustics()
 *
 * const spl = calculateInverseSquare(10, 130) // SPL at 10m for 130dB source
 * ```
 */
export function useAcoustics() {
  // ============================================
  // Core SPL Calculations
  // ============================================

  /**
   * Calculate SPL using the inverse square law for point sources.
   *
   * Point sources radiate sound spherically, losing 6dB for every
   * doubling of distance. This is the fundamental decay pattern for
   * most conventional loudspeakers.
   *
   * Formula: SPL(d) = SPL(1m) - 20 * log₁₀(d)
   *
   * @param distance - Distance from the source in meters (must be > 0)
   * @param maxSPL - Maximum SPL at 1 meter (typically from spec sheet)
   * @returns Calculated SPL at the given distance
   *
   * @example
   * ```typescript
   * // A speaker rated at 130dB @ 1m
   * calculateInverseSquare(2, 130)  // Returns 124dB (6dB loss)
   * calculateInverseSquare(4, 130)  // Returns 118dB (12dB loss)
   * calculateInverseSquare(10, 130) // Returns 110dB (20dB loss)
   * ```
   */
  function calculateInverseSquare(distance: number, maxSPL: number): number {
    if (distance <= 0) {
      console.warn('Distance must be greater than 0, defaulting to 1m')
      return maxSPL
    }
    // SPL decreases by 20*log10(d) for spherical spreading
    return maxSPL - 20 * Math.log10(distance)
  }

  /**
   * Calculate SPL for line array using cylindrical spreading model.
   *
   * Line arrays create a cylindrical wavefront that decays at 3dB per
   * doubling of distance (within the near field), transitioning to
   * spherical spreading in the far field.
   *
   * The transition distance depends on the array length:
   * d_transition ≈ L² / λ (where L = array length, λ = wavelength)
   *
   * @param distance - Distance from the array in meters
   * @param maxSPL - Maximum SPL at 1 meter for the array
   * @param lineLength - Total length of the line array in meters
   * @param couplingCoefficient - How well the elements couple (0-1)
   * @returns Calculated SPL at the given distance
   *
   * @example
   * ```typescript
   * // 8-element array, each 0.3m tall = 2.4m total length
   * calculateCylindricalLoss(10, 135, 2.4, 0.9) // Less loss than point source
   * ```
   */
  function calculateCylindricalLoss(
    distance: number,
    maxSPL: number,
    lineLength: number,
    couplingCoefficient: number = 0.9
  ): number {
    if (distance <= 0) return maxSPL
    if (lineLength <= 0) return calculateInverseSquare(distance, maxSPL)

    // Calculate transition distance (simplified - assumes 1kHz reference)
    // Full calculation would need frequency-dependent analysis
    const wavelength = 0.343 // ~1kHz wavelength in meters
    const transitionDistance = (lineLength * lineLength) / wavelength

    // Account for coupling efficiency
    const effectiveMaxSPL = maxSPL + 20 * Math.log10(couplingCoefficient)

    if (distance <= transitionDistance) {
      // Near field: cylindrical spreading (3dB per doubling)
      return effectiveMaxSPL - 10 * Math.log10(distance)
    } else {
      // Far field: spherical spreading kicks in
      // Calculate SPL at transition point, then apply spherical decay
      const splAtTransition = effectiveMaxSPL - 10 * Math.log10(transitionDistance)
      const farFieldDistance = distance / transitionDistance
      return splAtTransition - 20 * Math.log10(farFieldDistance)
    }
  }

  /**
   * Calculate off-axis attenuation based on dispersion pattern.
   *
   * Speakers have defined coverage angles (typically -6dB points).
   * Beyond these angles, SPL drops off more rapidly. This function
   * models the coverage pattern using a Gaussian approximation.
   *
   * @param angle - Off-axis angle in degrees (0 = on-axis)
   * @param coverageAngle - Speaker's coverage angle in degrees (-6dB point)
   * @returns Attenuation in dB (negative value)
   *
   * @example
   * ```typescript
   * // 90-degree coverage speaker
   * getOffAxisAttenuation(0, 90)   // Returns 0dB (on-axis)
   * getOffAxisAttenuation(45, 90)  // Returns -6dB (at coverage edge)
   * getOffAxisAttenuation(90, 90)  // Returns significant attenuation
   * ```
   */
  function getOffAxisAttenuation(angle: number, coverageAngle: number): number {
    if (coverageAngle <= 0) return 0

    // Normalize angle to positive value
    const absAngle = Math.abs(angle)

    // Half coverage angle (coverage angle is full width)
    const halfCoverage = coverageAngle / 2

    if (absAngle <= halfCoverage) {
      // Within coverage: gradual roll-off using Gaussian model
      // At half-coverage edge, attenuation is -6dB
      const ratio = absAngle / halfCoverage
      return -6 * ratio * ratio
    } else {
      // Beyond coverage: steeper roll-off
      const beyondCoverage = absAngle - halfCoverage
      const baseAttenuation = -6 // At the coverage edge
      const additionalAttenuation = -2 * beyondCoverage // 2dB per degree beyond
      return Math.max(baseAttenuation + additionalAttenuation, -40) // Clamp at -40dB
    }
  }

  /**
   * Calculate combined horizontal and vertical off-axis attenuation.
   *
   * @param horzAngle - Horizontal off-axis angle in degrees
   * @param vertAngle - Vertical off-axis angle in degrees
   * @param horzDispersion - Horizontal coverage angle
   * @param vertDispersion - Vertical coverage angle
   * @returns Combined attenuation in dB
   */
  function getCombinedAttenuation(
    horzAngle: number,
    vertAngle: number,
    horzDispersion: number,
    vertDispersion: number
  ): number {
    const horzAtten = getOffAxisAttenuation(horzAngle, horzDispersion)
    const vertAtten = getOffAxisAttenuation(vertAngle, vertDispersion)

    // Combine using power sum (more accurate than simple addition)
    // This accounts for the fact that both angles affect coverage
    return Math.min(horzAtten, vertAtten) + Math.max(horzAtten, vertAtten) * 0.5
  }

  // ============================================
  // Geometric Calculations
  // ============================================

  /**
   * Calculate the 2D distance between two points.
   */
  function distance2D(p1: Point2D, p2: Point2D): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  }

  /**
   * Calculate the 3D distance between two points.
   */
  function distance3D(p1: Point3D, p2: Point3D): number {
    return Math.sqrt(
      Math.pow(p2.x - p1.x, 2) +
      Math.pow(p2.y - p1.y, 2) +
      Math.pow(p2.z - p1.z, 2)
    )
  }

  /**
   * Calculate the horizontal angle from source to target.
   *
   * @param source - Speaker position
   * @param target - Listener position
   * @param aimAngle - Speaker's horizontal aim angle (0 = straight ahead)
   * @returns Off-axis angle in degrees
   */
  function calculateHorizontalAngle(
    source: Point2D,
    target: Point2D,
    aimAngle: number = 0
  ): number {
    const dx = target.x - source.x
    const dy = target.y - source.y
    const angleToTarget = (Math.atan2(dx, dy) * 180) / Math.PI
    return Math.abs(angleToTarget - aimAngle)
  }

  /**
   * Calculate the vertical angle from source to target.
   *
   * @param sourceHeight - Height of the speaker
   * @param targetHeight - Height of the listener
   * @param horizontalDistance - Horizontal distance to the listener
   * @param tiltAngle - Speaker's tilt angle (positive = downward)
   * @returns Off-axis angle in degrees
   */
  function calculateVerticalAngle(
    sourceHeight: number,
    targetHeight: number,
    horizontalDistance: number,
    tiltAngle: number = 0
  ): number {
    const heightDiff = sourceHeight - targetHeight
    const angleToTarget = (Math.atan2(heightDiff, horizontalDistance) * 180) / Math.PI
    return Math.abs(angleToTarget - tiltAngle)
  }

  // ============================================
  // SPL at Point Calculations
  // ============================================

  /**
   * Calculate SPL at a specific point from a speaker deployment.
   *
   * This is the main calculation function that combines:
   * - Distance-based decay (inverse square or cylindrical)
   * - Off-axis attenuation (based on coverage pattern)
   * - Array coupling (for multi-element arrays)
   *
   * @param point - Target point in space (x, y, z in meters)
   * @param speakerPosition - Speaker position (x, y, z in meters)
   * @param speaker - Speaker model
   * @param deployment - Deployment configuration
   * @returns Detailed SPL result
   */
  function calculateSPLAtPoint(
    point: Point3D,
    speakerPosition: Point3D,
    speaker: SpeakerModel,
    deployment: SpeakerDeployment
  ): SPLResult {
    // Calculate distance
    const dist = distance3D(point, speakerPosition)

    // Calculate angles
    const horzAngle = calculateHorizontalAngle(
      { x: speakerPosition.x, y: speakerPosition.z },
      { x: point.x, y: point.z },
      deployment.horizontalAim
    )

    const vertAngle = calculateVerticalAngle(
      speakerPosition.y,
      point.y,
      Math.sqrt(
        Math.pow(point.x - speakerPosition.x, 2) +
        Math.pow(point.z - speakerPosition.z, 2)
      ),
      deployment.tiltAngle
    )

    // Calculate base SPL based on speaker type
    let baseSPL: number
    if (
      speaker.type === SpeakerType.LineArray &&
      deployment.quantity > 1 &&
      speaker.arrayable
    ) {
      // Line array calculation
      const arrayLength = deployment.quantity * 0.3 // Approximate element height
      const coupling = speaker.specs.couplingCoefficient

      // Array gain from multiple elements (3dB per doubling)
      const arrayGain = 10 * Math.log10(deployment.quantity) * coupling

      baseSPL = calculateCylindricalLoss(
        dist,
        speaker.specs.maxSPL + arrayGain,
        arrayLength,
        coupling
      )
    } else {
      // Point source calculation
      baseSPL = calculateInverseSquare(dist, speaker.specs.maxSPL)
    }

    // Calculate off-axis attenuation
    const attenuation = getCombinedAttenuation(
      horzAngle,
      vertAngle,
      speaker.specs.horzDispersion,
      speaker.specs.vertDispersion
    )

    // Check if within coverage
    const inCoverage =
      horzAngle <= speaker.specs.horzDispersion / 2 &&
      vertAngle <= speaker.specs.vertDispersion / 2

    return {
      spl: baseSPL + attenuation,
      distance: dist,
      horzAngle,
      vertAngle,
      attenuation,
      inCoverage,
    }
  }

  // ============================================
  // Coverage Analysis
  // ============================================

  /**
   * Check if dispersion cone intersects with a boundary.
   *
   * Used to detect potential reflection issues (e.g., ceiling reflections).
   *
   * @param speakerHeight - Height of the speaker in meters
   * @param tiltAngle - Downward tilt in degrees
   * @param vertDispersion - Vertical coverage angle
   * @param ceilingHeight - Room ceiling height
   * @param depth - Distance to check along
   * @returns True if there's a ceiling intersection
   */
  function checkCeilingIntersection(
    speakerHeight: number,
    tiltAngle: number,
    vertDispersion: number,
    ceilingHeight: number,
    depth: number
  ): boolean {
    // Calculate the top edge of the vertical coverage
    const topAngle = tiltAngle - vertDispersion / 2

    // If the top edge aims upward, check where it hits the ceiling
    if (topAngle < 0) {
      // Angle is upward - calculate intersection point
      const risePerMeter = Math.tan((Math.abs(topAngle) * Math.PI) / 180)
      const intersectionDistance = (ceilingHeight - speakerHeight) / risePerMeter

      // If intersection is within the room depth, there's a problem
      return intersectionDistance < depth && intersectionDistance > 0
    }

    return false
  }

  /**
   * Analyze overall coverage for a room configuration.
   *
   * @param room - Room dimensions { width, depth, height }
   * @param speaker - Speaker model
   * @param deployment - Deployment configuration
   * @returns Coverage analysis results
   */
  function analyzeCoverage(
    room: { width: number; depth: number; height: number },
    speaker: SpeakerModel,
    deployment: SpeakerDeployment
  ): CoverageAnalysis {
    const listenerHeight = 1.4 // Average seated ear height in meters
    const speakerPosition: Point3D = {
      x: room.width / 2, // Centered
      y: deployment.trimHeight,
      z: 0, // At front of room
    }

    // Calculate SPL at key positions
    const centerStage = calculateSPLAtPoint(
      { x: room.width / 2, y: listenerHeight, z: room.depth / 2 },
      speakerPosition,
      speaker,
      deployment
    )

    const frontRow = calculateSPLAtPoint(
      { x: room.width / 2, y: listenerHeight, z: 3 }, // 3m from front
      speakerPosition,
      speaker,
      deployment
    )

    const backRow = calculateSPLAtPoint(
      { x: room.width / 2, y: listenerHeight, z: room.depth - 1 }, // 1m from back
      speakerPosition,
      speaker,
      deployment
    )

    // Check for ceiling reflection
    const hasCeilingReflection = checkCeilingIntersection(
      deployment.trimHeight,
      deployment.tiltAngle,
      speaker.specs.vertDispersion,
      room.height,
      room.depth
    )

    // Estimate coverage percentage (simplified - sample grid)
    let pointsInCoverage = 0
    const totalPoints = 100
    const gridSize = 10

    for (let xi = 0; xi < gridSize; xi++) {
      for (let zi = 0; zi < gridSize; zi++) {
        const x = (room.width * (xi + 0.5)) / gridSize
        const z = ((room.depth - 2) * (zi + 0.5)) / gridSize + 2 // Start 2m from front

        const result = calculateSPLAtPoint(
          { x, y: listenerHeight, z },
          speakerPosition,
          speaker,
          deployment
        )

        // Consider "adequate" as within 10dB of center stage SPL
        if (result.spl >= centerStage.spl - 10 && result.spl <= centerStage.spl + 6) {
          pointsInCoverage++
        }
      }
    }

    return {
      centerStageSPL: centerStage.spl,
      frontRowSPL: frontRow.spl,
      backRowSPL: backRow.spl,
      frontToBackRatio: frontRow.spl - backRow.spl,
      hasCeilingReflection,
      coveragePercentage: (pointsInCoverage / totalPoints) * 100,
    }
  }

  // ============================================
  // Bill of Materials
  // ============================================

  /**
   * Generate a Bill of Materials for the current configuration.
   *
   * @param deployment - Speaker deployment configuration
   * @returns Complete Bill of Materials with costs
   */
  function estimateBOM(deployment: SpeakerDeployment): BillOfMaterials {
    const items: BOMItem[] = []
    let subtotal = 0

    // Get main speaker
    const mainSpeaker = getSpeakerById(deployment.speakerId)
    if (mainSpeaker && deployment.quantity > 0) {
      const totalPrice = mainSpeaker.pricing.perUnit * deployment.quantity
      items.push({
        description: `${mainSpeaker.brand} ${mainSpeaker.model}`,
        modelId: mainSpeaker.id,
        quantity: deployment.quantity,
        unitPrice: mainSpeaker.pricing.perUnit,
        totalPrice,
      })
      subtotal += totalPrice
    }

    // Get subwoofer if specified
    if (deployment.subId && deployment.subQuantity > 0) {
      const subwoofer = getSpeakerById(deployment.subId)
      if (subwoofer) {
        const totalPrice = subwoofer.pricing.perUnit * deployment.subQuantity
        items.push({
          description: `${subwoofer.brand} ${subwoofer.model}`,
          modelId: subwoofer.id,
          quantity: deployment.subQuantity,
          unitPrice: subwoofer.pricing.perUnit,
          totalPrice,
        })
        subtotal += totalPrice
      }
    }

    return {
      items,
      subtotal,
      currency: mainSpeaker?.pricing.currency || 'USD',
      generatedAt: new Date(),
    }
  }

  /**
   * Format currency value for display.
   */
  function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  /**
   * Format SPL value for display.
   */
  function formatSPL(spl: number): string {
    return `${Math.round(spl)} dB`
  }

  // ============================================
  // Return all functions
  // ============================================

  return {
    // Core calculations
    calculateInverseSquare,
    calculateCylindricalLoss,
    getOffAxisAttenuation,
    getCombinedAttenuation,

    // Geometry
    distance2D,
    distance3D,
    calculateHorizontalAngle,
    calculateVerticalAngle,

    // SPL at point
    calculateSPLAtPoint,

    // Coverage analysis
    checkCeilingIntersection,
    analyzeCoverage,

    // BOM
    estimateBOM,

    // Formatting
    formatCurrency,
    formatSPL,
  }
}
