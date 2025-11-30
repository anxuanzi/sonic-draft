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
   * @example 20 // Narrow 20-degree vertical coverage
   */
  vertDispersion: number

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
   * Number of main/top speakers.
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
   */
  horizontalAim: number
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
