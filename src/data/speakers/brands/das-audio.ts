/**
 * DAS Audio — Speaker Models
 */

import { SpeakerType, type SpeakerModel } from '../types'

const dasAudio: SpeakerModel[] = [
  {
    id: 'das-event-210a',
    brand: 'DAS Audio',
    model: 'Event-210A',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 90,
      vertDispersion: 10, // Splay dependent
      maxSPL: 134,
      couplingCoefficient: 0.88,
      frequencyRange: { low: 70, high: 20000 },
      impedance: 0,
      powerHandling: 1080, // 3-ch amp
    },
    pricing: { perUnit: 3509, perSub: 0, currency: 'USD' },
    meta: {
      description: '3-way powered line array with dual 10" drivers.',
      weight: 34,
      dimensions: { width: 735, height: 270, depth: 366 },
      link: 'https://www.dasaudio.com/en/products/systems/event-series/event-210a/',
    },
    compatibleSubs: ['das-event-218a'],
    arrayable: true,
    maxArraySize: 16,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 20,
      minHeight: 2,
    },
  },
]

export default dasAudio
