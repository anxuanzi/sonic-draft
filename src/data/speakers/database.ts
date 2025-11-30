/**
 * Speaker Database
 *
 * This file contains the complete speaker library for SonicDraft.
 * Contributors can add new speaker models by following the SpeakerModel interface.
 *
 * When adding a new speaker:
 * 1. Ensure all required fields are populated
 * 2. Use accurate specifications from manufacturer datasheets
 * 3. Include realistic pricing (MSRP or street price)
 * 4. Link to official product pages
 * 5. Add compatible subwoofer IDs if applicable
 */

import { type SpeakerModel, SpeakerType } from './types'

/**
 * Complete speaker database.
 * Organized by manufacturer for easy navigation.
 */
export const speakerDatabase: SpeakerModel[] = [
  // ============================================
  // JBL Professional
  // ============================================
  {
    id: 'jbl-vrx932lap',
    brand: 'JBL Professional',
    model: 'VRX932LAP',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 100,
      vertDispersion: 15,
      maxSPL: 131,
      couplingCoefficient: 0.82,
      frequencyRange: { low: 57, high: 20000 },
      impedance: 8,
      powerHandling: 875,
    },
    pricing: {
      perUnit: 2499,
      perSub: 1999,
      currency: 'USD',
    },
    meta: {
      description:
        'Constant curvature line array with 12" woofer and 3 x 1" HF drivers. Excellent for portable PA and permanent installations.',
      weight: 25.4,
      dimensions: { width: 587, height: 343, depth: 381 },
      link: 'https://jblpro.com/products/vrx932lap',
    },
    compatibleSubs: ['jbl-vrx918sp'],
    arrayable: true,
    maxArraySize: 6,
  },
  {
    id: 'jbl-vrx918sp',
    brand: 'JBL Professional',
    model: 'VRX918SP',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 134,
      couplingCoefficient: 0.9,
      frequencyRange: { low: 31, high: 250 },
      impedance: 4,
      powerHandling: 1500,
    },
    pricing: {
      perUnit: 1999,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description:
        'Powered 18" flyable subwoofer designed for use with VRX932LAP line array.',
      weight: 44.5,
      dimensions: { width: 575, height: 597, depth: 750 },
      link: 'https://jblpro.com/products/vrx918sp',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 4,
  },

  // ============================================
  // Meyer Sound
  // ============================================
  {
    id: 'meyer-lina',
    brand: 'Meyer Sound',
    model: 'LINA',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 110,
      vertDispersion: 10,
      maxSPL: 133,
      couplingCoefficient: 0.92,
      frequencyRange: { low: 60, high: 18000 },
      impedance: 8,
      powerHandling: 1000,
    },
    pricing: {
      perUnit: 8500,
      perSub: 9500,
      currency: 'USD',
    },
    meta: {
      description:
        'Ultra-compact linear line array loudspeaker with exceptional pattern control. Part of the LEOPARD family.',
      weight: 17.2,
      dimensions: { width: 556, height: 216, depth: 406 },
      link: 'https://meyersound.com/product/lina/',
    },
    compatibleSubs: ['meyer-750-lfc'],
    arrayable: true,
    maxArraySize: 16,
  },
  {
    id: 'meyer-750-lfc',
    brand: 'Meyer Sound',
    model: '750-LFC',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 136,
      couplingCoefficient: 0.95,
      frequencyRange: { low: 28, high: 125 },
      impedance: 4,
      powerHandling: 1700,
    },
    pricing: {
      perUnit: 9500,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description:
        'Compact low-frequency control element with cardioid pattern for use with LINA and LEOPARD systems.',
      weight: 80,
      dimensions: { width: 599, height: 762, depth: 851 },
      link: 'https://meyersound.com/product/750-lfc/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 8,
  },

  // ============================================
  // d&b audiotechnik
  // ============================================
  {
    id: 'db-y8',
    brand: 'd&b audiotechnik',
    model: 'Y8',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 80,
      vertDispersion: 6,
      maxSPL: 137,
      couplingCoefficient: 0.94,
      frequencyRange: { low: 59, high: 18000 },
      impedance: 8,
      powerHandling: 1400,
    },
    pricing: {
      perUnit: 7200,
      perSub: 6800,
      currency: 'USD',
    },
    meta: {
      description:
        'Y-Series line array with excellent long-throw capabilities and consistent directivity.',
      weight: 31,
      dimensions: { width: 600, height: 230, depth: 420 },
      link: 'https://www.dbaudio.com/global/en/products/series/y-series/',
    },
    compatibleSubs: ['db-y-sub'],
    arrayable: true,
    maxArraySize: 24,
  },
  {
    id: 'db-y-sub',
    brand: 'd&b audiotechnik',
    model: 'Y-SUB',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 138,
      couplingCoefficient: 0.93,
      frequencyRange: { low: 37, high: 120 },
      impedance: 8,
      powerHandling: 1400,
    },
    pricing: {
      perUnit: 6800,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description:
        'Compact cardioid-capable subwoofer for Y-Series systems with 2x 18" drivers.',
      weight: 87,
      dimensions: { width: 600, height: 450, depth: 820 },
      link: 'https://www.dbaudio.com/global/en/products/series/y-series/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 12,
  },

  // ============================================
  // Electro-Voice
  // ============================================
  {
    id: 'ev-evolve-50m',
    brand: 'Electro-Voice',
    model: 'EVOLVE 50M',
    type: SpeakerType.Column,
    specs: {
      horzDispersion: 120,
      vertDispersion: 40,
      maxSPL: 127,
      couplingCoefficient: 0.88,
      frequencyRange: { low: 42, high: 20000 },
      impedance: 8,
      powerHandling: 1000,
    },
    pricing: {
      perUnit: 2199,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description:
        'Portable column speaker with 8 x 3.5" neodymium drivers and integrated 12" subwoofer base.',
      weight: 26,
      dimensions: { width: 152, height: 1850, depth: 426 },
      link: 'https://products.electrovoice.com/na/en/evolve-50m/',
    },
    compatibleSubs: [],
    arrayable: false,
  },

  // ============================================
  // Martin Audio
  // ============================================
  {
    id: 'martin-wpm',
    brand: 'Martin Audio',
    model: 'WPM',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 100,
      vertDispersion: 15,
      maxSPL: 127,
      couplingCoefficient: 0.86,
      frequencyRange: { low: 80, high: 18000 },
      impedance: 16,
      powerHandling: 500,
    },
    pricing: {
      perUnit: 3200,
      perSub: 4500,
      currency: 'USD',
    },
    meta: {
      description:
        'Wavefront Precision Micro - compact line array optimized for touring and installations.',
      weight: 15.5,
      dimensions: { width: 512, height: 200, depth: 263 },
      link: 'https://martin-audio.com/products/loudspeakers/wpm',
    },
    compatibleSubs: ['martin-sx118'],
    arrayable: true,
    maxArraySize: 16,
  },
  {
    id: 'martin-sx118',
    brand: 'Martin Audio',
    model: 'SX118',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 135,
      couplingCoefficient: 0.9,
      frequencyRange: { low: 35, high: 200 },
      impedance: 8,
      powerHandling: 1000,
    },
    pricing: {
      perUnit: 4500,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'High-output 18" subwoofer for WPM and other Martin Audio systems.',
      weight: 50,
      dimensions: { width: 545, height: 600, depth: 670 },
      link: 'https://martin-audio.com/products/loudspeakers/sx118',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 6,
  },

  // ============================================
  // QSC
  // ============================================
  {
    id: 'qsc-kla12',
    brand: 'QSC',
    model: 'KLA12',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 90,
      vertDispersion: 18,
      maxSPL: 131,
      couplingCoefficient: 0.84,
      frequencyRange: { low: 48, high: 18000 },
      impedance: 8,
      powerHandling: 500,
    },
    pricing: {
      perUnit: 1699,
      perSub: 1499,
      currency: 'USD',
    },
    meta: {
      description:
        'Active 12" line array loudspeaker with integrated DSP and rigging hardware.',
      weight: 19.5,
      dimensions: { width: 552, height: 338, depth: 336 },
      link: 'https://www.qsc.com/products-solutions/loudspeakers/powered-loudspeakers/kla-series/kla12/',
    },
    compatibleSubs: ['qsc-ksub'],
    arrayable: true,
    maxArraySize: 8,
  },
  {
    id: 'qsc-ksub',
    brand: 'QSC',
    model: 'KSub',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 131,
      couplingCoefficient: 0.88,
      frequencyRange: { low: 42, high: 110 },
      impedance: 4,
      powerHandling: 1000,
    },
    pricing: {
      perUnit: 1499,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Active dual 12" subwoofer designed for KLA series.',
      weight: 42.6,
      dimensions: { width: 609, height: 533, depth: 559 },
      link: 'https://www.qsc.com/products-solutions/loudspeakers/powered-loudspeakers/k-series/ksub/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 4,
  },

  // ============================================
  // L-Acoustics
  // ============================================
  {
    id: 'lacoustics-kara-ii',
    brand: 'L-Acoustics',
    model: 'KARA II',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 110,
      vertDispersion: 10,
      maxSPL: 142,
      couplingCoefficient: 0.95,
      frequencyRange: { low: 50, high: 20000 },
      impedance: 8,
      powerHandling: 2000,
    },
    pricing: {
      perUnit: 9800,
      perSub: 8500,
      currency: 'USD',
    },
    meta: {
      description:
        'Premium medium-format WST line source, featuring L-Acoustics Panflex technology.',
      weight: 39,
      dimensions: { width: 560, height: 282, depth: 485 },
      link: 'https://www.l-acoustics.com/products/kara-ii/',
    },
    compatibleSubs: ['lacoustics-sb18'],
    arrayable: true,
    maxArraySize: 24,
  },
  {
    id: 'lacoustics-sb18',
    brand: 'L-Acoustics',
    model: 'SB18',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 138,
      couplingCoefficient: 0.92,
      frequencyRange: { low: 32, high: 125 },
      impedance: 8,
      powerHandling: 1400,
    },
    pricing: {
      perUnit: 8500,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'High-performance 18" subwoofer for KARA II systems.',
      weight: 67,
      dimensions: { width: 600, height: 508, depth: 680 },
      link: 'https://www.l-acoustics.com/products/sb18/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 12,
  },

  // ============================================
  // Point Source Examples
  // ============================================
  {
    id: 'jbl-srx835p',
    brand: 'JBL Professional',
    model: 'SRX835P',
    type: SpeakerType.PointSource,
    specs: {
      horzDispersion: 75,
      vertDispersion: 50,
      maxSPL: 136,
      couplingCoefficient: 0.6,
      frequencyRange: { low: 35, high: 21000 },
      impedance: 4,
      powerHandling: 2000,
    },
    pricing: {
      perUnit: 1999,
      perSub: 1799,
      currency: 'USD',
    },
    meta: {
      description:
        '3-way bass-reflex self-powered system with dual 15" woofers for high-output applications.',
      weight: 39.7,
      dimensions: { width: 495, height: 878, depth: 533 },
      link: 'https://jblpro.com/products/srx835p',
    },
    compatibleSubs: ['jbl-srx828sp'],
    arrayable: false,
  },
  {
    id: 'jbl-srx828sp',
    brand: 'JBL Professional',
    model: 'SRX828SP',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 141,
      couplingCoefficient: 0.85,
      frequencyRange: { low: 27, high: 150 },
      impedance: 4,
      powerHandling: 2000,
    },
    pricing: {
      perUnit: 1799,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description:
        'Dual 18" self-powered subwoofer with DSP for SRX800 series.',
      weight: 63.5,
      dimensions: { width: 603, height: 760, depth: 686 },
      link: 'https://jblpro.com/products/srx828sp',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 4,
  },
]

/**
 * Get all speaker models (excluding subwoofers).
 */
export function getMainSpeakers(): SpeakerModel[] {
  return speakerDatabase.filter((s) => s.type !== SpeakerType.Subwoofer)
}

/**
 * Get all subwoofer models.
 */
export function getSubwoofers(): SpeakerModel[] {
  return speakerDatabase.filter((s) => s.type === SpeakerType.Subwoofer)
}

/**
 * Get a speaker by its ID.
 */
export function getSpeakerById(id: string): SpeakerModel | undefined {
  return speakerDatabase.find((s) => s.id === id)
}

/**
 * Get compatible subwoofers for a given speaker.
 * @param speakerId - The ID of the main speaker
 * @returns Array of compatible subwoofer models
 */
export function getCompatibleSubwoofers(speakerId: string): SpeakerModel[] {
  const speaker = getSpeakerById(speakerId)
  if (!speaker) return []

  return speaker.compatibleSubs
    .map((subId) => getSpeakerById(subId))
    .filter((sub): sub is SpeakerModel => sub !== undefined)
}

/**
 * Get speakers by type.
 */
export function getSpeakersByType(type: SpeakerType): SpeakerModel[] {
  return speakerDatabase.filter((s) => s.type === type)
}

/**
 * Get speakers by brand.
 */
export function getSpeakersByBrand(brand: string): SpeakerModel[] {
  return speakerDatabase.filter(
    (s) => s.brand.toLowerCase() === brand.toLowerCase()
  )
}

/**
 * Get unique brand names from the database.
 */
export function getUniqueBrands(): string[] {
  const brands = new Set(speakerDatabase.map((s) => s.brand))
  return Array.from(brands).sort()
}
