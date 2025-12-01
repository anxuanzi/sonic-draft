/**
 * Speaker Database
 *
 * This file contains the complete speaker library for SonicDraft.
 * Contributors can add new speaker models by following the SpeakerModel interface.
 *
 * When adding a new speaker:
 * 1. Ensure all required fields are populated
 * 2. Use accurate specifications from manufacturer datasheets
 * 3. Include realistic pricing (MSRP or street price)
 * 4. Link to official product pages
 * 5. Add compatible subwoofer IDs if applicable
 */

import { type SpeakerModel, SpeakerType } from './types'

/**
 * Complete speaker database.
 * Organized by manufacturer for easy navigation.
 */
export const speakerDatabase: SpeakerModel[] = [
  // ============================================
  // JBL Professional
  // ============================================
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
      link: '[https://jblpro.com/products/vtx-a8](https://jblpro.com/products/vtx-a8)',
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
      link: '[https://jblpro.com/products/vtx-b28](https://jblpro.com/products/vtx-b28)',
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
      link: '[https://jblpro.com/products/srx910la](https://jblpro.com/products/srx910la)',
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
      link: '[https://jblpro.com/products/srx906la](https://jblpro.com/products/srx906la)',
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
      link: '[https://jblpro.com/products/srx928s](https://jblpro.com/products/srx928s)',
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
      description:
        'Constant curvature line array with 12" woofer and 3 x 1" HF drivers.',
      weight: 25.4,
      dimensions: { width: 587, height: 343, depth: 381 },
      link: '[https://jblpro.com/products/vrx932lap](https://jblpro.com/products/vrx932lap)',
    },
    compatibleSubs: ['jbl-vrx918sp'],
    arrayable: true,
    maxArraySize: 6,
  },

  // ============================================
  // Meyer Sound
  // ============================================
  {
    id: 'meyer-panther',
    brand: 'Meyer Sound',
    model: 'PANTHER',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 95, // Available in 80 (L), 95 (M), 110 (W)
      vertDispersion: 10,
      maxSPL: 150,
      couplingCoefficient: 0.96,
      frequencyRange: { low: 55, high: 16000 },
      impedance: 0, // Self-powered
      powerHandling: 3000, // Class D equivalent
    },
    pricing: {
      perUnit: 16000, // Est.
      perSub: 12000,
      currency: 'USD',
    },
    meta: {
      description: 'Large-format linear line array loudspeaker with Milan AVB.',
      weight: 68,
      dimensions: { width: 969, height: 297, depth: 567 },
      link: '[https://meyersound.com/product/panther/](https://meyersound.com/product/panther/)',
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
    pricing: {
      perUnit: 11000,
      perSub: 8500,
      currency: 'USD',
    },
    meta: {
      description: 'Compact linear line array. 2x9" drivers.',
      weight: 34,
      dimensions: { width: 684, height: 282, depth: 550 },
      link: '[https://meyersound.com/product/leopard/](https://meyersound.com/product/leopard/)',
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
    pricing: {
      perUnit: 8500,
      perSub: 9500,
      currency: 'USD',
    },
    meta: {
      description:
        'Ultra-compact linear line array loudspeaker with exceptional pattern control.',
      weight: 17.2,
      dimensions: { width: 556, height: 216, depth: 406 },
      link: '[https://meyersound.com/product/lina/](https://meyersound.com/product/lina/)',
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
    pricing: {
      perUnit: 14500,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Low-frequency control element, dual 18" drivers.',
      weight: 112,
      dimensions: { width: 1336, height: 520, depth: 838 },
      link: '[https://meyersound.com/product/1100-lfc/](https://meyersound.com/product/1100-lfc/)',
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
    pricing: {
      perUnit: 5600,
      perSub: 4000,
      currency: 'USD',
    },
    meta: {
      description: 'Concentric driver point source with rotatable horn.',
      weight: 23.6,
      dimensions: { width: 318, height: 567, depth: 391 },
      link: '[https://meyersound.com/product/ultra-x40/](https://meyersound.com/product/ultra-x40/)',
    },
    compatibleSubs: ['meyer-750-lfc'],
    arrayable: false,
  },

  // ============================================
  // d&b audiotechnik
  // ============================================
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
      powerHandling: 500, // RMS, Peak is 2000
    },
    pricing: {
      perUnit: 12000,
      perSub: 7500,
      currency: 'USD',
    },
    meta: {
      description: '3-way passive line array loudspeaker, 2x10" LF.',
      weight: 34,
      dimensions: { width: 700, height: 310, depth: 460 },
      link: '[https://www.dbaudio.com/global/en/products/series/v-series/v8/](https://www.dbaudio.com/global/en/products/series/v-series/v8/)',
    },
    compatibleSubs: ['db-v-sub'],
    arrayable: true,
    maxArraySize: 24,
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
    pricing: {
      perUnit: 7500,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Cardioid subwoofer, 18" front / 12" rear drivers.',
      weight: 64,
      dimensions: { width: 700, height: 606, depth: 728 },
      link: '[https://www.dbaudio.com/global/en/products/series/v-series/v-sub/](https://www.dbaudio.com/global/en/products/series/v-series/v-sub/)',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 10,
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
    pricing: {
      perUnit: 7200,
      perSub: 6800,
      currency: 'USD',
    },
    meta: {
      description: 'Compact 2-way passive line array, dual 8".',
      weight: 20,
      dimensions: { width: 630, height: 257, depth: 375 },
      link: '[https://www.dbaudio.com/global/en/products/series/y-series/](https://www.dbaudio.com/global/en/products/series/y-series/)',
    },
    compatibleSubs: ['db-y-sub'],
    arrayable: true,
    maxArraySize: 24,
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
    pricing: {
      perUnit: 6800,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Cardioid subwoofer 18"/12" for Y-Series.',
      weight: 52,
      dimensions: { width: 630, height: 457, depth: 672 },
      link: '[https://www.dbaudio.com/global/en/products/series/y-series/](https://www.dbaudio.com/global/en/products/series/y-series/)',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 8,
  },

  // ============================================
  // Electro-Voice
  // ============================================
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
    pricing: {
      perUnit: 1599,
      perSub: 1799,
      currency: 'USD',
    },
    meta: {
      description: '12" 2-way powered loudspeaker with FIR-Drive DSP.',
      weight: 23.6,
      dimensions: { width: 381, height: 613, depth: 400 },
      link: '[https://products.electrovoice.com/na/en/etx-12p/](https://products.electrovoice.com/na/en/etx-12p/)',
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
    pricing: {
      perUnit: 1999,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: '18" powered subwoofer, DSP with cardioid preset.',
      weight: 51.8,
      dimensions: { width: 675, height: 550, depth: 910 },
      link: '[https://products.electrovoice.com/na/en/etx-18sp/](https://products.electrovoice.com/na/en/etx-18sp/)',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 4,
  },

  // ============================================
  // Martin Audio
  // ============================================
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
    pricing: {
      perUnit: 12000,
      perSub: 8000,
      currency: 'USD',
    },
    meta: {
      description: 'Wavefront Precision Longbow, dual 12" 3-way bi-amp.',
      weight: 64,
      dimensions: { width: 1136, height: 371, depth: 526 },
      link: '[https://martin-audio.com/products/loudspeakers/wpl](https://martin-audio.com/products/loudspeakers/wpl)',
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
    pricing: {
      perUnit: 7500,
      perSub: 4500,
      currency: 'USD',
    },
    meta: {
      description: 'Wavefront Precision Compact, dual 10" 3-way bi-amp.',
      weight: 35,
      dimensions: { width: 772, height: 319, depth: 421 },
      link: '[https://martin-audio.com/products/loudspeakers/wpc](https://martin-audio.com/products/loudspeakers/wpc)',
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
    pricing: {
      perUnit: 4000,
      perSub: 1800,
      currency: 'USD',
    },
    meta: {
      description: 'Wavefront Precision Micro, dual 6.5" 2-way passive.',
      weight: 15.5,
      dimensions: { width: 500, height: 185, depth: 377 },
      link: '[https://martin-audio.com/products/loudspeakers/wpm](https://martin-audio.com/products/loudspeakers/wpm)',
    },
    compatibleSubs: ['martin-sx118'],
    arrayable: true,
    maxArraySize: 16,
  },

  // ============================================
  // RCF
  // ============================================
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
    pricing: {
      perUnit: 14400,
      perSub: 9400,
      currency: 'USD',
    },
    meta: {
      description: 'Active 3-way line array module, 4K amplifier, dual 12".',
      weight: 58,
      dimensions: { width: 1171, height: 366, depth: 502 },
      link: '[https://www.rcf.it/en/products/product-detail/hdl-50-a-4k](https://www.rcf.it/en/products/product-detail/hdl-50-a-4k)',
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
    pricing: {
      perUnit: 6800,
      perSub: 6200,
      currency: 'USD',
    },
    meta: {
      description: 'Active 2-way line array module, dual 10". RDNet onboard.',
      weight: 25,
      dimensions: { width: 705, height: 293, depth: 502 },
      link: '[https://www.rcf.it/en/products/product-detail/hdl-30-a](https://www.rcf.it/en/products/product-detail/hdl-30-a)',
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
    pricing: {
      perUnit: 1799,
      perSub: 2500,
      currency: 'USD',
    },
    meta: {
      description: 'Ultra compact active line array, dual 6".',
      weight: 11.6,
      dimensions: { width: 470, height: 237, depth: 377 },
      link: '[https://www.rcf.it/en/products/product-detail/hdl-6-a](https://www.rcf.it/en/products/product-detail/hdl-6-a)',
    },
    compatibleSubs: ['rcf-sub-8006-as'], // Often pairs with smaller subs too
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
    pricing: {
      perUnit: 9400,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Active high power dual 18" subwoofer.',
      weight: 86,
      dimensions: { width: 1188, height: 558, depth: 785 },
      link: '[https://www.rcf.it/en/products/product-detail/sub-9006-as](https://www.rcf.it/en/products/product-detail/sub-9006-as)',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 8,
  },

  // ============================================
  // QSC
  // ============================================
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
    pricing: {
      perUnit: 3400,
      perSub: 2000,
      currency: 'USD',
    },
    meta: {
      description: '12" active line array loudspeaker with AWARE system intelligence.',
      weight: 21.4,
      dimensions: { width: 630, height: 392, depth: 417 },
      link: '[https://www.qsc.com/products-solutions/loudspeakers/portable/powered/powered-line-array-loudspeakers/l-class-line-array-system/la112/](https://www.qsc.com/products-solutions/loudspeakers/portable/powered/powered-line-array-loudspeakers/l-class-line-array-system/la112/)',
    },
    compatibleSubs: ['qsc-ls118', 'qsc-ks118'],
    arrayable: true,
    maxArraySize: 6,
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
    pricing: {
      perUnit: 2600,
      perSub: 2000,
      currency: 'USD',
    },
    meta: {
      description: '8" active line array loudspeaker, lightweight and intelligent.',
      weight: 13.7,
      dimensions: { width: 519, height: 272, depth: 374 },
      link: '[https://www.qsc.com/products-solutions/loudspeakers/portable/powered/powered-line-array-loudspeakers/l-class-line-array-system/la108/](https://www.qsc.com/products-solutions/loudspeakers/portable/powered/powered-line-array-loudspeakers/l-class-line-array-system/la108/)',
    },
    compatibleSubs: ['qsc-ls118', 'qsc-ks118'],
    arrayable: true,
    maxArraySize: 6,
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
    pricing: {
      perUnit: 3400, // MSRP implied
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Active 18" subwoofer designed for L Class arrays.',
      weight: 53, // est
      dimensions: { width: 630, height: 640, depth: 790 }, // est
      link: '[https://www.qsc.com/products-solutions/loudspeakers/portable/powered/powered-line-array-loudspeakers/l-class-line-array-system/ls118/](https://www.qsc.com/products-solutions/loudspeakers/portable/powered/powered-line-array-loudspeakers/l-class-line-array-system/ls118/)',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 4,
  },

  // ============================================
  // L-Acoustics
  // ============================================
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
    pricing: {
      perUnit: 16500,
      perSub: 10000,
      currency: 'USD',
    },
    meta: {
      description: 'Large format WST line source with variable curvature and Panflex.',
      weight: 56,
      dimensions: { width: 1338, height: 354, depth: 400 },
      link: '[https://www.l-acoustics.com/products/k2/](https://www.l-acoustics.com/products/k2/)',
    },
    compatibleSubs: ['lacoustics-ks28'],
    arrayable: true,
    maxArraySize: 24,
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
    pricing: {
      perUnit: 9800,
      perSub: 8500,
      currency: 'USD',
    },
    meta: {
      description: 'Modular WST line source, dual 8" with Panflex.',
      weight: 26,
      dimensions: { width: 733, height: 250, depth: 485 },
      link: '[https://www.l-acoustics.com/products/kara-ii/](https://www.l-acoustics.com/products/kara-ii/)',
    },
    compatibleSubs: ['lacoustics-sb18', 'lacoustics-ks21'],
    arrayable: true,
    maxArraySize: 24,
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
    pricing: {
      perUnit: 5500,
      perSub: 4000,
      currency: 'USD',
    },
    meta: {
      description: 'Constant curvature WST enclosure, 15" driver, 10-degree vertical.',
      weight: 35,
      dimensions: { width: 764, height: 427, depth: 522 },
      link: '[https://www.l-acoustics.com/products/a15-focus/](https://www.l-acoustics.com/products/a15-focus/)',
    },
    compatibleSubs: ['lacoustics-ks21'],
    arrayable: true,
    maxArraySize: 8,
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
    pricing: {
      perUnit: 10000,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Flyable reference subwoofer, dual 18".',
      weight: 79,
      dimensions: { width: 1340, height: 550, depth: 719 },
      link: '[https://www.l-acoustics.com/products/ks28/](https://www.l-acoustics.com/products/ks28/)',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 12,
  },

  // ============================================
  // DAS Audio
  // ============================================
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
    pricing: {
      perUnit: 3509,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: '3-way powered line array with dual 10" drivers.',
      weight: 34,
      dimensions: { width: 735, height: 270, depth: 366 },
      link: '[https://www.dasaudio.com/en/products/systems/event-series/event-210a/](https://www.dasaudio.com/en/products/systems/event-series/event-210a/)',
    },
    compatibleSubs: ['das-event-218a'],
    arrayable: true,
    maxArraySize: 16,
  },

  // ============================================
  // Nexo
  // ============================================
  {
    id: 'nexo-geo-m10',
    brand: 'Nexo',
    model: 'GEO M1012',
    type: SpeakerType.LineArray,
    specs: {
      horzDispersion: 120, // or 80
      vertDispersion: 12,
      maxSPL: 136,
      couplingCoefficient: 0.9,
      frequencyRange: { low: 59, high: 20000 },
      impedance: 8,
      powerHandling: 750,
    },
    pricing: {
      perUnit: 4124,
      perSub: 0,
      currency: 'USD',
    },
    meta: {
      description: 'Compact 10" line array element, 12 degree vertical.',
      weight: 21,
      dimensions: { width: 531, height: 288, depth: 355 },
      link: '[https://www.nexo-sa.com/products/geo-m10/](https://www.nexo-sa.com/products/geo-m10/)',
    },
    compatibleSubs: ['nexo-msub15'],
    arrayable: true,
    maxArraySize: 12,
  },

  // ============================================
  // Point Source Examples
  // ============================================
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
      description:
        'Dual 18" self-powered subwoofer with DSP for SRX800 series.',
      weight: 63.5,
      dimensions: { width: 603, height: 760, depth: 686 },
      link: 'https://jblpro.com/products/srx828sp',
    },
    compatibleSubs: [],
    arrayable: true,
    maxArraySize: 4,
  },
]

/**
 * Get all speaker models (excluding subwoofers).
 */
export function getMainSpeakers (): SpeakerModel[] {
  return speakerDatabase.filter((s) => s.type !== SpeakerType.Subwoofer)
}

/**
 * Get all subwoofer models.
 */
export function getSubwoofers (): SpeakerModel[] {
  return speakerDatabase.filter((s) => s.type === SpeakerType.Subwoofer)
}

/**
 * Get a speaker by its ID.
 */
export function getSpeakerById (id: string): SpeakerModel | undefined {
  return speakerDatabase.find((s) => s.id === id)
}

/**
 * Get compatible subwoofers for a given speaker.
 * @param speakerId - The ID of the main speaker
 * @returns Array of compatible subwoofer models
 */
export function getCompatibleSubwoofers (speakerId: string): SpeakerModel[] {
  const speaker = getSpeakerById(speakerId)
  if (!speaker) return []

  return speaker.compatibleSubs
    .map((subId) => getSpeakerById(subId))
    .filter((sub): sub is SpeakerModel => sub !== undefined)
}

/**
 * Get speakers by type.
 */
export function getSpeakersByType (type: SpeakerType): SpeakerModel[] {
  return speakerDatabase.filter((s) => s.type === type)
}

/**
 * Get speakers by brand.
 */
export function getSpeakersByBrand (brand: string): SpeakerModel[] {
  return speakerDatabase.filter(
    (s) => s.brand.toLowerCase() === brand.toLowerCase()
  )
}

/**
 * Get unique brand names from the database.
 */
export function getUniqueBrands (): string[] {
  const brands = new Set(speakerDatabase.map((s) => s.brand))
  return Array.from(brands).sort()
}
