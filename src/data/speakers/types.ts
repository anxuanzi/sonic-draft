/**
 * Speaker Library Type Definitions
 *
 * This module defines the core TypeScript interfaces for the speaker database.
 * These types ensure type safety across the application and provide clear
 * documentation for contributors adding new speaker models.
 */

/**
 * Constants representing the different types of speaker systems.
 * Each type has distinct acoustic propagation characteristics.
 */
export const SpeakerType = {
  /** Traditional point source speakers - spherical sound propagation */
  PointSource: 'point_source',
  /** Line array elements - cylindrical sound propagation */
  LineArray: 'line_array',
  /** Column speakers - hybrid propagation characteristics */
  Column: 'column',
  /** Subwoofer - low frequency reinforcement */
  Subwoofer: 'subwoofer',
} as const

export type SpeakerType = (typeof SpeakerType)[keyof typeof SpeakerType]

/**
 * Technical specifications for a speaker model.
 * These values are used in acoustic calculations.
 */
export interface SpeakerSpecs {
  /**
   * Horizontal dispersion angle in degrees.
   * Represents the -6dB coverage angle in the horizontal plane.
   * @example 90 // 90-degree horizontal coverage
   */
  horzDispersion: number

  /**
   * Vertical dispersion angle in degrees.
   * Represents the -6dB coverage angle in the vertical plane.
   * For symmetrical speakers, this is the total angle.
   * @example 20 // Narrow 20-degree vertical coverage
   */
  vertDispersion: number

  /**
   * Vertical dispersion upward from axis in degrees (optional).
   * For asymmetrical column speakers that project downward.
   * If not specified, uses symmetrical dispersion (vertDispersion / 2).
   * @example 0 // No upward dispersion
   */
  vertDispersionUp?: number

  /**
   * Vertical dispersion downward from axis in degrees (optional).
   * For asymmetrical column speakers that project downward.
   * If not specified, uses symmetrical dispersion (vertDispersion / 2).
   * @example 40 // 40° downward coverage
   */
  vertDispersionDown?: number

  /**
   * Maximum SPL (Sound Pressure Level) in dB at 1 meter.
   * This is the peak continuous output of the speaker.
   * @example 135 // 135 dB SPL @ 1m
   */
  maxSPL: number

  /**
   * Coupling coefficient for array configurations (0-1).
   * Higher values indicate better acoustic coupling when arrayed.
   * Only applicable to line arrays and column speakers.
   * @example 0.85 // 85% coupling efficiency
   */
  couplingCoefficient: number

  /**
   * Frequency response range in Hz.
   * @example { low: 50, high: 20000 }
   */
  frequencyRange: {
    low: number
    high: number
  }

  /**
   * Nominal impedance in ohms.
   * @example 8
   */
  impedance: number

  /**
   * Power handling in watts (program power).
   * @example 800
   */
  powerHandling: number
}

/**
 * Pricing information for a speaker model.
 */
export interface SpeakerPricing {
  /**
   * Price per unit in the specified currency.
   * @example 2500
   */
  perUnit: number

  /**
   * Price for compatible subwoofer (if applicable).
   * Set to 0 if no subwoofer is available.
   * @example 3000
   */
  perSub: number

  /**
   * Currency code (ISO 4217).
   * @example "USD"
   */
  currency: string
}

/**
 * Mounting and deployment options for a speaker model.
 * Defines what physical configurations are possible.
 */
export interface MountingOptions {
  /**
   * Whether this speaker can be flown (hung from rigging).
   * Typically true for line arrays, false for portable systems.
   * @example true // Line array can be flown
   */
  canFly: boolean

  /**
   * Whether this speaker can be ground-stacked or pole-mounted.
   * Typically true for portable systems, columns, point sources.
   * @example true // Can be placed on stand/pole
   */
  canGroundStack: boolean

  /**
   * Maximum deployment height in meters.
   * For flown systems: typically 20m or more.
   * For stand/pole mounted: typically 2-3.5m.
   * @example 20 // Can fly up to 20m
   */
  maxHeight: number

  /**
   * Minimum deployment height in meters.
   * @example 2 // Minimum trim height of 2m
   */
  minHeight?: number

  /**
   * If defined, locks the tilt angle to this value.
   * Columns typically have fixed geometry (0°).
   * @example 0 // Fixed at 0° tilt
   */
  fixedTilt?: number

  /**
   * Whether this is a column/line source with asymmetrical vertical coverage.
   * If true, sound projects downward but not upward.
   */
  isAsymmetrical?: boolean
}

/**
 * Metadata and descriptive information for a speaker model.
 */
export interface SpeakerMeta {
  /**
   * Brief description of the speaker and its intended use.
   * @example "Compact line array for medium-sized venues"
   */
  description: string

  /**
   * Weight of a single unit in kilograms.
   * @example 15.5
   */
  weight: number

  /**
   * Physical dimensions in millimeters.
   */
  dimensions: {
    width: number
    height: number
    depth: number
  }

  /**
   * URL to manufacturer's product page.
   * @example "https://www.jblpro.com/vrx932"
   */
  link: string

  /**
   * URL to product image (optional).
   */
  imageUrl?: string
}

/**
 * Complete speaker model definition.
 * This interface represents a single speaker in the database.
 */
export interface SpeakerModel {
  /**
   * Unique identifier for the speaker model.
   * Should be lowercase with hyphens.
   * @example "jbl-vrx932lap"
   */
  id: string

  /**
   * Manufacturer brand name.
   * @example "JBL Professional"
   */
  brand: string

  /**
   * Model name/number.
   * @example "VRX932LAP"
   */
  model: string

  /**
   * Type of speaker system.
   */
  type: SpeakerType

  /**
   * Technical specifications.
   */
  specs: SpeakerSpecs

  /**
   * Pricing information.
   */
  pricing: SpeakerPricing

  /**
   * Metadata and descriptions.
   */
  meta: SpeakerMeta

  /**
   * IDs of compatible subwoofer models.
   * Empty array if no compatible subs.
   */
  compatibleSubs: string[]

  /**
   * Whether this speaker can be arrayed.
   */
  arrayable: boolean

  /**
   * Maximum number of units in an array (if applicable).
   */
  maxArraySize?: number

  /**
   * Mounting and deployment options.
   * Defines physical installation constraints.
   */
  mountingOptions: MountingOptions
}

/**
 * Deployment mode for the speaker system.
 */
export type DeploymentMode = 'L/R Stereo' | 'Center Mono'

/**
 * Center fill configuration.
 */
export interface CenterFillConfig {
  /** Whether center fill is enabled */
  enabled: boolean
  /** ID of the center fill speaker model */
  modelId: string
  /** Gain adjustment in dB (-12 to +6) */
  gain: number
}

/**
 * Configuration for a deployed speaker system.
 */
export interface SpeakerDeployment {
  /**
   * Reference to the speaker model.
   */
  speakerId: string

  /**
   * Number of main/top speakers (per side in stereo mode).
   */
  quantity: number

  /**
   * Number of subwoofers.
   */
  subQuantity: number

  /**
   * Reference to subwoofer model (if used).
   */
  subId?: string

  /**
   * Trim height in meters (height from floor to bottom of array).
   */
  trimHeight: number

  /**
   * Tilt angle in degrees (positive = down, negative = up).
   */
  tiltAngle: number

  /**
   * Horizontal aim angle in degrees from center.
   * In stereo mode, this is the toe-in angle (both arrays aim inward).
   */
  horizontalAim: number

  /**
   * Deployment mode: L/R Stereo or Center Mono.
   */
  deploymentMode: DeploymentMode

  /**
   * Distance between L/R arrays in meters (only used in L/R Stereo mode).
   */
  arraySpread: number
}

/**
 * Bill of Materials item for cost estimation.
 */
export interface BOMItem {
  /**
   * Item description.
   */
  description: string

  /**
   * Model identifier.
   */
  modelId: string

  /**
   * Quantity of items.
   */
  quantity: number

  /**
   * Unit price.
   */
  unitPrice: number

  /**
   * Total price (quantity * unitPrice).
   */
  totalPrice: number
}

/**
 * Complete Bill of Materials for a system configuration.
 */
export interface BillOfMaterials {
  /**
   * List of items in the BOM.
   */
  items: BOMItem[]

  /**
   * Subtotal before any adjustments.
   */
  subtotal: number

  /**
   * Currency code.
   */
  currency: string

  /**
   * Timestamp when BOM was generated.
   */
  generatedAt: Date
}

// ============================================
// System Type Configuration
// ============================================

/**
 * System type categories for speaker selection workflow.
 * Each type represents a common PA deployment scenario.
 */
export const SystemTypeId = {
  /** Point source speakers in L/R configuration - most common portable setup */
  StereoPointSource: 'stereo_point_source',
  /** Line array elements flown in L/R configuration - concert/touring systems */
  LineArrayLR: 'line_array_lr',
  /** Column speakers for speech/music - compact high-quality coverage */
  ColumnArray: 'column_array',
  /** Distributed ceiling/delay system - even coverage over large areas */
  DistributedSystem: 'distributed_system',
} as const

export type SystemTypeId = (typeof SystemTypeId)[keyof typeof SystemTypeId]

/**
 * Configuration metadata for each system type.
 * Used to drive UI, filtering, and default settings.
 */
export interface SystemTypeConfig {
  /** Unique identifier */
  id: SystemTypeId
  /** Display name */
  name: string
  /** Short tagline */
  tagline: string
  /** Detailed description */
  description: string
  /** Icon identifier (Lucide icon name) */
  icon: string
  /** Speaker types to show in selection */
  speakerTypes: SpeakerType[]
  /** Default deployment mode */
  defaultDeploymentMode: DeploymentMode
  /** Whether this system type supports arraying */
  supportsArraying: boolean
  /** Typical use cases */
  useCases: string[]
  /** Default quantity of speakers */
  defaultQuantity: number
  /** Default trim/stand height */
  defaultHeight: number
  /** Whether subs are typically used */
  usesSubs: boolean
}

/**
 * Complete system type configurations.
 * This drives the system type selector UI and speaker filtering.
 */
export const SystemTypeConfigs: Record<SystemTypeId, SystemTypeConfig> = {
  [SystemTypeId.StereoPointSource]: {
    id: SystemTypeId.StereoPointSource,
    name: 'Point Source',
    tagline: 'Standard L/R Setup',
    description: 'Classic stereo setup with point source speakers on stands. Great for DJ events, bands, and small-medium venues.',
    icon: 'Speaker',
    speakerTypes: [SpeakerType.PointSource],
    defaultDeploymentMode: 'L/R Stereo',
    supportsArraying: false,
    useCases: ['DJ Events', 'Live Bands', 'Small Venues', 'Corporate Events'],
    defaultQuantity: 1,
    defaultHeight: 2.0,
    usesSubs: true,
  },
  [SystemTypeId.LineArrayLR]: {
    id: SystemTypeId.LineArrayLR,
    name: 'Line Array',
    tagline: 'Narrow Vertical, Long Throw',
    description: 'Flown line array system for maximum throw and SPL. Ideal for concerts, festivals, and large venues.',
    icon: 'Layers',
    speakerTypes: [SpeakerType.LineArray],
    defaultDeploymentMode: 'L/R Stereo',
    supportsArraying: true,
    useCases: ['Concerts', 'Festivals', 'Large Venues', 'Touring'],
    defaultQuantity: 4,
    defaultHeight: 8.0,
    usesSubs: true,
  },
  [SystemTypeId.ColumnArray]: {
    id: SystemTypeId.ColumnArray,
    name: 'Column Array',
    tagline: 'Wide Horizontal, Compact',
    description: 'Compact column speakers with controlled vertical coverage. Perfect for speech, corporate, and houses of worship.',
    icon: 'PanelLeft',
    speakerTypes: [SpeakerType.Column],
    defaultDeploymentMode: 'L/R Stereo',
    supportsArraying: false,
    useCases: ['Corporate', 'Houses of Worship', 'Conferences', 'Lectures'],
    defaultQuantity: 1,
    defaultHeight: 2.0,
    usesSubs: true,
  },
  [SystemTypeId.DistributedSystem]: {
    id: SystemTypeId.DistributedSystem,
    name: 'Distributed',
    tagline: 'Even Coverage Grid',
    description: 'Multiple speakers distributed for even coverage. Best for background music, retail, and large open spaces.',
    icon: 'Grid3x3',
    speakerTypes: [SpeakerType.PointSource, SpeakerType.Column],
    defaultDeploymentMode: 'Center Mono',
    supportsArraying: false,
    useCases: ['Retail', 'Restaurants', 'Background Music', 'Delay Systems'],
    defaultQuantity: 1,
    defaultHeight: 3.0,
    usesSubs: false,
  },
}

/**
 * Get system type configuration by ID.
 */
export function getSystemTypeConfig(id: SystemTypeId): SystemTypeConfig {
  return SystemTypeConfigs[id]
}

/**
 * Get all system type configurations as an array.
 */
export function getAllSystemTypeConfigs(): SystemTypeConfig[] {
  return Object.values(SystemTypeConfigs)
}
