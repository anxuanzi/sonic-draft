/**
 * RCF — Speaker Models
 */

import { SpeakerType, type SpeakerModel } from '../types'

const rcf: SpeakerModel[] = [
  {
    id: 'rcf-hdl-50a-4k',
    brand: 'RCF',
    model: 'HDL 50-A 4K',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 90,
      vertDispersion: 10,
      maxSPL: 143,
      couplingCoefficient: 0.94,
      frequencyRange: { low: 40, high: 20000 },
      impedance: 0, // Active
      powerHandling: 4000, // RMS
    },
    pricing: { perUnit: 14400, perSub: 9400, currency: 'USD' },
    meta: {
      description: 'Active 3-way line array module, 4K amplifier, dual 12".',
      weight: 58,
      dimensions: { width: 1171, height: 366, depth: 502 },
      link: 'https://www.rcf.it/en/products/product-detail/hdl-50-a-4k',
    },
    compatibleSubs: ['rcf-sub-9006-as'],
    arrayable: true,
    maxArraySize: 20,
  },
  {
    id: 'rcf-hdl-30a',
    brand: 'RCF',
    model: 'HDL 30-A',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 100,
      vertDispersion: 15,
      maxSPL: 137,
      couplingCoefficient: 0.91,
      frequencyRange: { low: 50, high: 20000 },
      impedance: 0,
      powerHandling: 2200,
    },
    pricing: { perUnit: 6800, perSub: 6200, currency: 'USD' },
    meta: {
      description: 'Active 2-way line array module, dual 10". RDNet onboard.',
      weight: 25,
      dimensions: { width: 705, height: 293, depth: 502 },
      link: 'https://www.rcf.it/en/products/product-detail/hdl-30-a',
    },
    compatibleSubs: ['rcf-sub-8006-as'],
    arrayable: true,
    maxArraySize: 20,
  },
  {
    id: 'rcf-hdl-6a',
    brand: 'RCF',
    model: 'HDL 6-A',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 100,
      vertDispersion: 10,
      maxSPL: 131,
      couplingCoefficient: 0.85,
      frequencyRange: { low: 65, high: 20000 },
      impedance: 0,
      powerHandling: 1400, // Peak
    },
    pricing: { perUnit: 1799, perSub: 2500, currency: 'USD' },
    meta: {
      description: 'Ultra compact active line array, dual 6".',
      weight: 11.6,
      dimensions: { width: 470, height: 237, depth: 377 },
      link: 'https://www.rcf.it/en/products/product-detail/hdl-6-a',
    },
    compatibleSubs: ['rcf-sub-8006-as'],
    arrayable: true,
    maxArraySize: 16,
  },
  {
    id: 'rcf-sub-9006-as',
    brand: 'RCF',
    model: 'SUB 9006-AS',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 142,
      couplingCoefficient: 0.95,
      frequencyRange: { low: 30, high: 400 },
      impedance: 0,
      powerHandling: 7200, // Peak
    },
    pricing: { perUnit: 9400, perSub: 0, currency: 'USD' },
    meta: {
      description: 'Active high power dual 18" subwoofer.',
      weight: 86,
      dimensions: { width: 1188, height: 558, depth: 785 },
      link: 'https://www.rcf.it/en/products/product-detail/sub-9006-as',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 8,
  },
]

export default rcf
