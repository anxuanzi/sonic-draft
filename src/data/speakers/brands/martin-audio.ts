/**
 * Martin Audio — Speaker Models
 */

import { SpeakerType, type SpeakerModel } from '../types'

const martinAudio: SpeakerModel[] = [
  {
    id: 'martin-wpl',
    brand: 'Martin Audio',
    model: 'WPL',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 90,
      vertDispersion: 7.5,
      maxSPL: 145,
      couplingCoefficient: 0.96,
      frequencyRange: { low: 52, high: 18000 },
      impedance: 8, // Bi-amp
      powerHandling: 1500,
    },
    pricing: { perUnit: 12000, perSub: 8000, currency: 'USD' },
    meta: {
      description: 'Wavefront Precision Longbow, dual 12" 3-way bi-amp.',
      weight: 64,
      dimensions: { width: 1136, height: 371, depth: 526 },
      link: 'https://martin-audio.com/products/loudspeakers/wpl',
    },
    compatibleSubs: ['martin-sx118', 'martin-sxh218'],
    arrayable: true,
    maxArraySize: 24,
  },
  {
    id: 'martin-wpc',
    brand: 'Martin Audio',
    model: 'WPC',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 100,
      vertDispersion: 10,
      maxSPL: 135,
      couplingCoefficient: 0.92,
      frequencyRange: { low: 65, high: 18000 },
      impedance: 8,
      powerHandling: 700,
    },
    pricing: { perUnit: 7500, perSub: 4500, currency: 'USD' },
    meta: {
      description: 'Wavefront Precision Compact, dual 10" 3-way bi-amp.',
      weight: 35,
      dimensions: { width: 772, height: 319, depth: 421 },
      link: 'https://martin-audio.com/products/loudspeakers/wpc',
    },
    compatibleSubs: ['martin-sx118'],
    arrayable: true,
    maxArraySize: 16,
  },
  {
    id: 'martin-wpm',
    brand: 'Martin Audio',
    model: 'WPM',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 100,
      vertDispersion: 15,
      maxSPL: 130,
      couplingCoefficient: 0.86,
      frequencyRange: { low: 76, high: 18000 },
      impedance: 16,
      powerHandling: 300,
    },
    pricing: { perUnit: 4000, perSub: 1800, currency: 'USD' },
    meta: {
      description: 'Wavefront Precision Micro, dual 6.5" 2-way passive.',
      weight: 15.5,
      dimensions: { width: 500, height: 185, depth: 377 },
      link: 'https://martin-audio.com/products/loudspeakers/wpm',
    },
    compatibleSubs: ['martin-sx118'],
    arrayable: true,
    maxArraySize: 16,
  },
]

export default martinAudio
