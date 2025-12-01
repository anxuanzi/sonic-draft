/**
 * Meyer Sound — Speaker Models
 */

import { SpeakerType, type SpeakerModel } from '../types'

const meyer: SpeakerModel[] = [
  {
    id: 'meyer-panther',
    brand: 'Meyer Sound',
    model: 'PANTHER',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 95, // 80/95/110 variants
      vertDispersion: 10,
      maxSPL: 150,
      couplingCoefficient: 0.96,
      frequencyRange: { low: 55, high: 16000 },
      impedance: 0, // Self-powered
      powerHandling: 3000,
    },
    pricing: { perUnit: 16000, perSub: 12000, currency: 'USD' },
    meta: {
      description: 'Large-format linear line array loudspeaker with Milan AVB.',
      weight: 68,
      dimensions: { width: 969, height: 297, depth: 567 },
      link: 'https://meyersound.com/product/panther/',
    },
    compatibleSubs: ['meyer-1100-lfc', 'meyer-900-lfc'],
    arrayable: true,
    maxArraySize: 24,
  },
  {
    id: 'meyer-leopard',
    brand: 'Meyer Sound',
    model: 'LEOPARD',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 110,
      vertDispersion: 10,
      maxSPL: 139,
      couplingCoefficient: 0.94,
      frequencyRange: { low: 55, high: 18000 },
      impedance: 0,
      powerHandling: 2000,
    },
    pricing: { perUnit: 11000, perSub: 8500, currency: 'USD' },
    meta: {
      description: 'Compact linear line array. 2x9" drivers.',
      weight: 34,
      dimensions: { width: 684, height: 282, depth: 550 },
      link: 'https://meyersound.com/product/leopard/',
    },
    compatibleSubs: ['meyer-900-lfc', 'meyer-750-lfc'],
    arrayable: true,
    maxArraySize: 20,
  },
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
    pricing: { perUnit: 8500, perSub: 9500, currency: 'USD' },
    meta: {
      description:
        'Ultra-compact linear line array loudspeaker with exceptional pattern control.',
      weight: 17.2,
      dimensions: { width: 556, height: 216, depth: 406 },
      link: 'https://meyersound.com/product/lina/',
    },
    compatibleSubs: ['meyer-750-lfc'],
    arrayable: true,
    maxArraySize: 16,
  },
  {
    id: 'meyer-1100-lfc',
    brand: 'Meyer Sound',
    model: '1100-LFC',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 142,
      couplingCoefficient: 0.95,
      frequencyRange: { low: 28, high: 100 },
      impedance: 0,
      powerHandling: 4000,
    },
    pricing: { perUnit: 14500, perSub: 0, currency: 'USD' },
    meta: {
      description: 'Low-frequency control element, dual 18" drivers.',
      weight: 112,
      dimensions: { width: 1336, height: 520, depth: 838 },
      link: 'https://meyersound.com/product/1100-lfc/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 12,
  },
  {
    id: 'meyer-ultra-x40',
    brand: 'Meyer Sound',
    model: 'ULTRA-X40',
    type: SpeakerType.PointSource,
    specs: {
      horzDispersion: 110,
      vertDispersion: 50,
      maxSPL: 138,
      couplingCoefficient: 0.65,
      frequencyRange: { low: 55, high: 19500 },
      impedance: 0,
      powerHandling: 1950,
    },
    pricing: { perUnit: 5600, perSub: 4000, currency: 'USD' },
    meta: {
      description: 'Concentric driver point source with rotatable horn.',
      weight: 23.6,
      dimensions: { width: 318, height: 567, depth: 391 },
      link: 'https://meyersound.com/product/ultra-x40/',
    },
    compatibleSubs: ['meyer-750-lfc'],
    arrayable: false,
  },
]

export default meyer
