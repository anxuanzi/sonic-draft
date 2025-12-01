/**
 * Speaker Database (Aggregator)
 *
 * This file now simply aggregates brand-specific files into a single array.
 * Non-coders: do NOT edit here. Instead, open a file in src/data/speakers/brands/
 *   and add/edit items for that brand. The system will combine them automatically.
 */

import { type SpeakerModel, SpeakerType } from './types'

// Import brand data (each is a simple array of speaker models)
import jbl from './brands/jbl'
import meyer from './brands/meyer'
import dbaudiotechnik from './brands/dbaudiotechnik'
import electrovoice from './brands/electrovoice'
import martinAudio from './brands/martin-audio'
import rcf from './brands/rcf'
import qsc from './brands/qsc'
import lacoustics from './brands/l-acoustics'
import dasAudio from './brands/das-audio'
import nexo from './brands/nexo'

/**
 * Complete speaker database — automatically combined from brand files.
 */
export const speakerDatabase: SpeakerModel[] = [
  ...jbl,
  ...meyer,
  ...dbaudiotechnik,
  ...electrovoice,
  ...martinAudio,
  ...rcf,
  ...qsc,
  ...lacoustics,
  ...dasAudio,
  ...nexo,
]

/**
 * Get all speaker models (excluding subwoofers).
 */
export function getMainSpeakers (): SpeakerModel[] {
  return speakerDatabase.filter((s) => s.type !== SpeakerType.Subwoofer)
}

/**
 * Get all subwoofer models.
 */
export function getSubwoofers (): SpeakerModel[] {
  return speakerDatabase.filter((s) => s.type === SpeakerType.Subwoofer)
}

/**
 * Get a speaker by its ID.
 */
export function getSpeakerById (id: string): SpeakerModel | undefined {
  return speakerDatabase.find((s) => s.id === id)
}

/**
 * Get compatible subwoofers for a given speaker.
 * @param speakerId - The ID of the main speaker
 * @returns Array of compatible subwoofer models
 */
export function getCompatibleSubwoofers (speakerId: string): SpeakerModel[] {
  const speaker = getSpeakerById(speakerId)
  if (!speaker) return []

  return speaker.compatibleSubs
    .map((subId) => getSpeakerById(subId))
    .filter((sub): sub is SpeakerModel => sub !== undefined)
}

/**
 * Get speakers by type.
 */
export function getSpeakersByType (type: SpeakerType): SpeakerModel[] {
  return speakerDatabase.filter((s) => s.type === type)
}

/**
 * Get speakers by brand.
 */
export function getSpeakersByBrand (brand: string): SpeakerModel[] {
  return speakerDatabase.filter(
    (s) => s.brand.toLowerCase() === brand.toLowerCase()
  )
}

/**
 * Get unique brand names from the database.
 */
export function getUniqueBrands (): string[] {
  const brands = new Set(speakerDatabase.map((s) => s.brand))
  return Array.from(brands).sort()
}
