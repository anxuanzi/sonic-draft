/**
 * Nexo — Speaker Models
 */

import { SpeakerType, type SpeakerModel } from '../types'

const nexo: SpeakerModel[] = [
  {
    id: 'nexo-geo-m10',
    brand: 'Nexo',
    model: 'GEO M1012',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 120, // or 80 with flanges
      vertDispersion: 12,
      maxSPL: 136,
      couplingCoefficient: 0.9,
      frequencyRange: { low: 59, high: 20000 },
      impedance: 8,
      powerHandling: 750,
    },
    pricing: { perUnit: 4124, perSub: 0, currency: 'USD' },
    meta: {
      description: 'Compact 10" line array element, 12 degree vertical.',
      weight: 21,
      dimensions: { width: 531, height: 288, depth: 355 },
      link: 'https://www.nexo-sa.com/products/geo-m10/',
    },
    compatibleSubs: ['nexo-msub15'],
    arrayable: true,
    maxArraySize: 12,
  },
]

export default nexo
