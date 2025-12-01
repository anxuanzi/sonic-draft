/**
 * QSC — Speaker Models
 */

import { SpeakerType, type SpeakerModel } from '../types'

const qsc: SpeakerModel[] = [
  {
    id: 'qsc-la112',
    brand: 'QSC',
    model: 'LA112',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 90,
      vertDispersion: 15,
      maxSPL: 136,
      couplingCoefficient: 0.88,
      frequencyRange: { low: 58, high: 20000 },
      impedance: 0,
      powerHandling: 2400,
    },
    pricing: { perUnit: 3400, perSub: 2000, currency: 'USD' },
    meta: {
      description: '12" active line array loudspeaker with AWARE system intelligence.',
      weight: 21.4,
      dimensions: { width: 630, height: 392, depth: 417 },
      link:
        'https://www.qsc.com/products-solutions/loudspeakers/portable/powered/powered-line-array-loudspeakers/l-class-line-array-system/la112/',
    },
    compatibleSubs: ['qsc-ls118', 'qsc-ks118'],
    arrayable: true,
    maxArraySize: 6,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 20,
      minHeight: 2,
    },
  },
  {
    id: 'qsc-la108',
    brand: 'QSC',
    model: 'LA108',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 100,
      vertDispersion: 15,
      maxSPL: 134,
      couplingCoefficient: 0.86,
      frequencyRange: { low: 62, high: 20000 },
      impedance: 0,
      powerHandling: 1300,
    },
    pricing: { perUnit: 2600, perSub: 2000, currency: 'USD' },
    meta: {
      description: '8" active line array loudspeaker, lightweight and intelligent.',
      weight: 13.7,
      dimensions: { width: 519, height: 272, depth: 374 },
      link:
        'https://www.qsc.com/products-solutions/loudspeakers/portable/powered/powered-line-array-loudspeakers/l-class-line-array-system/la108/',
    },
    compatibleSubs: ['qsc-ls118', 'qsc-ks118'],
    arrayable: true,
    maxArraySize: 6,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 20,
      minHeight: 2,
    },
  },
  {
    id: 'qsc-ls118',
    brand: 'QSC',
    model: 'LS118',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 136,
      couplingCoefficient: 0.9,
      frequencyRange: { low: 35, high: 111 },
      impedance: 0,
      powerHandling: 3600,
    },
    pricing: { perUnit: 3400, perSub: 0, currency: 'USD' },
    meta: {
      description: 'Active 18" subwoofer designed for L Class arrays.',
      weight: 53,
      dimensions: { width: 630, height: 640, depth: 790 },
      link:
        'https://www.qsc.com/products-solutions/loudspeakers/portable/powered/powered-line-array-loudspeakers/l-class-line-array-system/ls118/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 4,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 15,
      minHeight: 0,
    },
  },
]

export default qsc
