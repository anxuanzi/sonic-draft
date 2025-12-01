/**
 * Speaker Library Entry Point
 *
 * This module re-exports all speaker-related types, data, and utilities.
 * Import from '@/data/speakers' for access to the complete speaker library.
 *
 * @example
 * ```typescript
 * import {
 *   speakerDatabase,
 *   getSpeakerById,
 *   getCompatibleSubwoofers,
 *   SpeakerType,
 *   type SpeakerModel
 * } from '@/data/speakers'
 * ```
 */

// Type exports
export {
  SpeakerType,
  type SpeakerSpecs,
  type SpeakerPricing,
  type SpeakerMeta,
  type MountingOptions,
  type SpeakerModel,
  type SpeakerDeployment,
  type DeploymentMode,
  type CenterFillConfig,
  type BOMItem,
  type BillOfMaterials,
} from './types'

// Database and utilities
export {
  speakerDatabase,
  getMainSpeakers,
  getSubwoofers,
  getSpeakerById,
  getCompatibleSubwoofers,
  getSpeakersByType,
  getSpeakersByBrand,
  getUniqueBrands,
  getCenterFillSpeakers,
} from './database'
