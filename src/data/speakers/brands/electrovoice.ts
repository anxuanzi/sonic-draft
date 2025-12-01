/**
 * Electro-Voice — Speaker Models
 */

import { SpeakerType, type SpeakerModel } from '../types'

const electrovoice: SpeakerModel[] = [
  {
    id: 'ev-etx-12p',
    brand: 'Electro-Voice',
    model: 'ETX-12P',
    type: SpeakerType.PointSource,
    specs: {
      horzDispersion: 90,
      vertDispersion: 60,
      maxSPL: 135,
      couplingCoefficient: 0.6,
      frequencyRange: { low: 43, high: 20000 },
      impedance: 0,
      powerHandling: 2000,
    },
    pricing: { perUnit: 1599, perSub: 1799, currency: 'USD' },
    meta: {
      description: '12" 2-way powered loudspeaker with FIR-Drive DSP.',
      weight: 23.6,
      dimensions: { width: 381, height: 613, depth: 400 },
      link: 'https://products.electrovoice.com/na/en/etx-12p/',
    },
    compatibleSubs: ['ev-etx-18sp', 'ev-etx-15sp'],
    arrayable: false,
  },
  {
    id: 'ev-etx-18sp',
    brand: 'Electro-Voice',
    model: 'ETX-18SP',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 135,
      couplingCoefficient: 0.9,
      frequencyRange: { low: 28, high: 180 },
      impedance: 0,
      powerHandling: 1800,
    },
    pricing: { perUnit: 1999, perSub: 0, currency: 'USD' },
    meta: {
      description: '18" powered subwoofer, DSP with cardioid preset.',
      weight: 51.8,
      dimensions: { width: 675, height: 550, depth: 910 },
      link: 'https://products.electrovoice.com/na/en/etx-18sp/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 4,
  },
]

export default electrovoice
