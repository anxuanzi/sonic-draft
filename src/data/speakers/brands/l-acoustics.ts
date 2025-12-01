/**
 * L-Acoustics — Speaker Models
 */

import { SpeakerType, type SpeakerModel } from '../types'

const lacoustics: SpeakerModel[] = [
  {
    id: 'lacoustics-k2',
    brand: 'L-Acoustics',
    model: 'K2',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 110, // Variable via Panflex: 70/90/110
      vertDispersion: 10, // Max inter-element angle
      maxSPL: 147,
      couplingCoefficient: 0.98,
      frequencyRange: { low: 35, high: 20000 },
      impedance: 8, // Active Bi/Quad
      powerHandling: 2000, // Nominal
    },
    pricing: { perUnit: 16500, perSub: 10000, currency: 'USD' },
    meta: {
      description: 'Large format WST line source with variable curvature and Panflex.',
      weight: 56,
      dimensions: { width: 1338, height: 354, depth: 400 },
      link: 'https://www.l-acoustics.com/products/k2/',
    },
    compatibleSubs: ['lacoustics-ks28'],
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
    id: 'lacoustics-kara-ii',
    brand: 'L-Acoustics',
    model: 'KARA II',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 110,
      vertDispersion: 10,
      maxSPL: 142,
      couplingCoefficient: 0.95,
      frequencyRange: { low: 55, high: 20000 },
      impedance: 8,
      powerHandling: 1500,
    },
    pricing: { perUnit: 9800, perSub: 8500, currency: 'USD' },
    meta: {
      description: 'Modular WST line source, dual 8" with Panflex.',
      weight: 26,
      dimensions: { width: 733, height: 250, depth: 485 },
      link: 'https://www.l-acoustics.com/products/kara-ii/',
    },
    compatibleSubs: ['lacoustics-sb18', 'lacoustics-ks21'],
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
    id: 'lacoustics-a15-focus',
    brand: 'L-Acoustics',
    model: 'A15 Focus',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 110, // Variable Panflex 70/110
      vertDispersion: 10, // Fixed constant curvature
      maxSPL: 144,
      couplingCoefficient: 0.9,
      frequencyRange: { low: 41, high: 20000 },
      impedance: 8,
      powerHandling: 1200,
    },
    pricing: { perUnit: 5500, perSub: 4000, currency: 'USD' },
    meta: {
      description: 'Constant curvature WST enclosure, 15" driver, 10-degree vertical.',
      weight: 35,
      dimensions: { width: 764, height: 427, depth: 522 },
      link: 'https://www.l-acoustics.com/products/a15-focus/',
    },
    compatibleSubs: ['lacoustics-ks21'],
    arrayable: true,
    maxArraySize: 8,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 20,
      minHeight: 2,
    },
  },
  {
    id: 'lacoustics-ks28',
    brand: 'L-Acoustics',
    model: 'KS28',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 143,
      couplingCoefficient: 0.96,
      frequencyRange: { low: 25, high: 100 },
      impedance: 4,
      powerHandling: 3000,
    },
    pricing: { perUnit: 10000, perSub: 0, currency: 'USD' },
    meta: {
      description: 'Flyable reference subwoofer, dual 18".',
      weight: 79,
      dimensions: { width: 1340, height: 550, depth: 719 },
      link: 'https://www.l-acoustics.com/products/ks28/',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 12,
    mountingOptions: {
      canFly: true,
      canGroundStack: true,
      maxHeight: 15,
      minHeight: 0,
    },
  },
]

export default lacoustics
