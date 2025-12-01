/**
 * JBL Professional — Speaker Models
 *
 * How to edit:
 * - Add, remove, or change items inside the array below.
 * - Keep the same field names. Values are simple numbers or text.
 * - If unsure about a field, leave it as is or copy an existing item and tweak.
 */

import { SpeakerType, type SpeakerModel } from '../types'

const jbl: SpeakerModel[] = [
  {
    id: 'jbl-vtx-a8',
    brand: 'JBL Professional',
    model: 'VTX A8',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 110,
      vertDispersion: 12, // Varies
      maxSPL: 139,
      couplingCoefficient: 0.92,
      frequencyRange: { low: 50, high: 19000 },
      impedance: 8,
      powerHandling: 1500,
    },
    pricing: {
      perUnit: 6275,
      perSub: 6000,
      currency: 'USD',
    },
    meta: {
      description: 'Compact dual 8" line array element with 110-degree dispersion.',
      weight: 29.5,
      dimensions: { width: 761, height: 227, depth: 375 },
      link: 'https://jblpro.com/products/vtx-a8',
    },
    compatibleSubs: ['jbl-vtx-b18', 'jbl-vtx-b28'],
    arrayable: true,
    maxArraySize: 16,
  },
  {
    id: 'jbl-vtx-b28',
    brand: 'JBL Professional',
    model: 'VTX B28',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 141,
      couplingCoefficient: 0.95,
      frequencyRange: { low: 25, high: 80 },
      impedance: 4,
      powerHandling: 4000,
    },
    pricing: {
      perUnit: 9500,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Dual 18" subwoofer with omnidirectional or cardioid capabilities.',
      weight: 87,
      dimensions: { width: 1322, height: 508, depth: 750 },
      link: 'https://jblpro.com/products/vtx-b28',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 12,
  },
  {
    id: 'jbl-srx910la',
    brand: 'JBL Professional',
    model: 'SRX910LA',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 105,
      vertDispersion: 10,
      maxSPL: 135,
      couplingCoefficient: 0.9,
      frequencyRange: { low: 53, high: 19000 },
      impedance: 0, // Active
      powerHandling: 880, // Continuous
    },
    pricing: {
      perUnit: 3464,
      perSub: 3824,
      currency: 'USD',
    },
    meta: {
      description: 'Dual 10" powered line array loudspeaker with DSP and software control.',
      weight: 26.7,
      dimensions: { width: 716, height: 305, depth: 519 },
      link: 'https://jblpro.com/products/srx910la',
    },
    compatibleSubs: ['jbl-srx928s', 'jbl-srx918s'],
    arrayable: true,
    maxArraySize: 16,
  },
  {
    id: 'jbl-srx906la',
    brand: 'JBL Professional',
    model: 'SRX906LA',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 120,
      vertDispersion: 10,
      maxSPL: 134,
      couplingCoefficient: 0.88,
      frequencyRange: { low: 63, high: 17000 },
      impedance: 0, // Active
      powerHandling: 600,
    },
    pricing: {
      perUnit: 2069,
      perSub: 3114,
      currency: 'USD',
    },
    meta: {
      description: 'Dual 6.5" powered line array loudspeaker, ultra-compact.',
      weight: 16.8,
      dimensions: { width: 507, height: 243, depth: 420 },
      link: 'https://jblpro.com/products/srx906la',
    },
    compatibleSubs: ['jbl-srx918s', 'jbl-srx928s'],
    arrayable: true,
    maxArraySize: 12,
  },
  {
    id: 'jbl-srx928s',
    brand: 'JBL Professional',
    model: 'SRX928S',
    type: SpeakerType.Subwoofer,
    specs: {
      horzDispersion: 360,
      vertDispersion: 360,
      maxSPL: 140,
      couplingCoefficient: 0.92,
      frequencyRange: { low: 31, high: 100 },
      impedance: 0, // Active
      powerHandling: 2500, // Peak amp power often higher
    },
    pricing: {
      perUnit: 3824,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Dual 18" powered subwoofer for SRX900 series.',
      weight: 70.3,
      dimensions: { width: 1205, height: 565, depth: 681 },
      link: 'https://jblpro.com/products/srx928s',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 8,
  },
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
      description: 'Constant curvature line array with 12" woofer and 3 x 1" HF drivers.',
      weight: 25.4,
      dimensions: { width: 587, height: 343, depth: 381 },
      link: 'https://jblpro.com/products/vrx932lap',
    },
    compatibleSubs: ['jbl-vrx918sp'],
    arrayable: true,
    maxArraySize: 6,
  },
  // Point source examples (JBL)
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
      description: 'Dual 18" self-powered subwoofer with DSP for SRX800 series.',
      weight: 63.5,
      dimensions: { width: 603, height: 760, depth: 686 },
      link: 'https://jblpro.com/products/srx828sp',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 4,
  },
]

export default jbl
