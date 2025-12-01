/**
 * d&b audiotechnik — Speaker Models
 */

import { SpeakerType, type SpeakerModel } from '../types'

const dbaudiotechnik: SpeakerModel[] = [
  {
    id: 'db-v8',
    brand: 'd&b audiotechnik',
    model: 'V8',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 80,
      vertDispersion: 14,
      maxSPL: 142,
      couplingCoefficient: 0.96,
      frequencyRange: { low: 67, high: 18000 },
      impedance: 8,
      powerHandling: 500,
    },
    pricing: { perUnit: 12000, perSub: 7500, currency: 'USD' },
    meta: {
      description: '3-way passive line array loudspeaker, 2x10" LF.',
      weight: 34,
      dimensions: { width: 700, height: 310, depth: 460 },
      link: 'https://www.dbaudio.com/global/en/products/series/v-series/v8/',
    },
    compatibleSubs: ['db-v-sub'],
    arrayable: true,
    maxArraySize: 24,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 20,
      minHeight: 2,
    },
  },
  {
    id: 'db-v-sub',
    brand: 'd&b audiotechnik',
    model: 'V-SUB',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 200, // Cardioid
      vertDispersion: 360,
      maxSPL: 137,
      couplingCoefficient: 0.93,
      frequencyRange: { low: 37, high: 115 },
      impedance: 8,
      powerHandling: 800,
    },
    pricing: { perUnit: 7500, perSub: 0, currency: 'USD' },
    meta: {
      description: 'Cardioid subwoofer, 18" front / 12" rear drivers.',
      weight: 64,
      dimensions: { width: 700, height: 606, depth: 728 },
      link: 'https://www.dbaudio.com/global/en/products/series/v-series/v-sub/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 10,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 15,
      minHeight: 0,
    },
  },
  {
    id: 'db-y8',
    brand: 'd&b audiotechnik',
    model: 'Y8',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 80,
      vertDispersion: 14,
      maxSPL: 139,
      couplingCoefficient: 0.94,
      frequencyRange: { low: 54, high: 19000 },
      impedance: 8,
      powerHandling: 400,
    },
    pricing: { perUnit: 7200, perSub: 6800, currency: 'USD' },
    meta: {
      description: 'Compact 2-way passive line array, dual 8".',
      weight: 20,
      dimensions: { width: 630, height: 257, depth: 375 },
      link: 'https://www.dbaudio.com/global/en/products/series/y-series/',
    },
    compatibleSubs: ['db-y-sub'],
    arrayable: true,
    maxArraySize: 24,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 20,
      minHeight: 2,
    },
  },
  {
    id: 'db-y-sub',
    brand: 'd&b audiotechnik',
    model: 'Y-SUB',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 200, // Cardioid
      vertDispersion: 360,
      maxSPL: 134,
      couplingCoefficient: 0.93,
      frequencyRange: { low: 39, high: 140 },
      impedance: 8,
      powerHandling: 600,
    },
    pricing: { perUnit: 6800, perSub: 0, currency: 'USD' },
    meta: {
      description: 'Cardioid subwoofer 18"/12" for Y-Series.',
      weight: 52,
      dimensions: { width: 630, height: 457, depth: 672 },
      link: 'https://www.dbaudio.com/global/en/products/series/y-series/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 8,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 15,
      minHeight: 0,
    },
  },
]

export default dbaudiotechnik
