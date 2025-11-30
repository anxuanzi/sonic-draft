# SonicDraft 🎛️

The Open-Source Acoustic Design & Proposal Studio. Plan speaker deployments, simulate coverage, and draft professional
audio proposals in seconds.

## 📖 About The Project

SonicDraft is a web-based acoustic simulation tool designed to help audio engineers, venue owners, and integrators
visualize sound.

Traditional acoustic modeling software is often expensive, complex, and overkill for small-to-mid-sized venue proposals.
SonicDraft fills this gap by providing an intuitive, browser-based interface to design PA systems. It combines a robust
physics engine with a "drafting" interface, allowing users to place speakers, check for coverage dead zones, and
instantly export a client-ready PDF proposal with a Bill of Materials (BOM).

## 🚀 Key Features

- **Real-time Coverage Visualization**
    - Top-down (bird's eye) view of horizontal coverage
    - Side elevation view for vertical coverage analysis
    - Interactive SPL probe - hover to see exact levels at any point
    - Ceiling reflection warnings for acoustic issues

- **Comprehensive Speaker Library**
    - Industry-standard systems (JBL, Meyer Sound, d&b, L-Acoustics, QSC, etc.)
    - Line arrays, point source, and column speakers
    - Compatible subwoofer recommendations
    - Detailed specifications and pricing

- **Physics-Based Calculations**
    - Inverse square law for point sources
    - Cylindrical spreading for line arrays
    - Off-axis attenuation modeling
    - Array coupling coefficients

- **Professional PDF Export**
    - Room specifications
    - System configuration details
    - Coverage map snapshots
    - Bill of Materials with cost estimates

## Tech Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **Language**: TypeScript (Strict Mode)
- **State Management**: Pinia
- **Styling**: Tailwind CSS (Dark Mode, Pro Audio Aesthetic)
- **Icons**: Lucide Vue
- **Graphics**: HTML5 Canvas API
- **PDF Generation**: jsPDF + html2canvas

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/anxuanzi/sonic-draft.git
cd sonic-draft

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/sonic-draft/`

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
sonic-draft/
├── src/
│   ├── components/
│   │   ├── canvas/          # Visualization components
│   │   ├── layout/          # Layout components (Header, Sidebar)
│   │   └── ui/              # Reusable UI components
│   ├── composables/
│   │   ├── useAcoustics.ts  # Physics engine
│   │   └── usePdfExport.ts  # PDF generation
│   ├── data/
│   │   └── speakers/        # Speaker database
│   ├── stores/              # Pinia stores
│   ├── assets/              # Styles and static assets
│   ├── App.vue              # Root component
│   └── main.ts              # Application entry
├── public/                  # Static assets
└── .github/workflows/       # CI/CD configuration
```

## Contributing

We welcome contributions! Here's how you can help:

### Adding New Speakers

The speaker database is in `src/data/speakers/database.ts`. To add a new speaker:

1. Create a new entry following the `SpeakerModel` interface
2. Include accurate specifications from manufacturer datasheets
3. Add realistic pricing (MSRP or street price)
4. Link to official product pages
5. Associate compatible subwoofers

```typescript
{
  id: 'brand-model',
    brand
:
  'Brand Name',
    model
:
  'Model Name',
    type
:
  SpeakerType.LineArray,
    specs
:
  {
    horzDispersion: 90,
      vertDispersion
  :
    15,
      maxSPL
  :
    135,
      couplingCoefficient
  :
    0.9,
      frequencyRange
  :
    {
      low: 50, high
    :
      20000
    }
  ,
    impedance: 8,
      powerHandling
  :
    1000,
  }
,
  pricing: {
    perUnit: 5000,
      perSub
  :
    4000,
      currency
  :
    'USD',
  }
,
  meta: {
    description: 'Description of the speaker...',
      weight
  :
    25,
      dimensions
  :
    {
      width: 500, height
    :
      300, depth
    :
      400
    }
  ,
    link: 'https://manufacturer.com/product',
  }
,
  compatibleSubs: ['brand-sub-model'],
    arrayable
:
  true,
    maxArraySize
:
  12,
}
```

### Development Guidelines

- Use Vue 3 Composition API with `<script setup>`
- Follow TypeScript strict mode
- Add TSDoc comments to composables and utilities
- Keep physics logic in composables, UI logic in components
- Use Tailwind CSS for styling

## Physics Reference

### Inverse Square Law (Point Sources)

```
SPL(d) = SPL(1m) - 20 × log₁₀(d)
```

Sound pressure decreases by 6dB for every doubling of distance.

### Cylindrical Spreading (Line Arrays)

```
SPL(d) = SPL(1m) - 10 × log₁₀(d)  [near field]
SPL(d) = SPL(1m) - 20 × log₁₀(d)  [far field]
```

Line arrays exhibit 3dB loss per doubling in the near field, transitioning to spherical spreading in the far field.

### Off-Axis Attenuation

Coverage angles represent -6dB points. Beyond the coverage cone, attenuation increases more rapidly.

## Deployment

The application is configured for GitHub Pages deployment via GitHub Actions. On push to the `main` branch, the
workflow:

1. Checks out the code
2. Installs dependencies
3. Runs type checking
4. Builds the production bundle
5. Deploys to GitHub Pages

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Acoustic formulas based on industry-standard calculations
- Speaker specifications from manufacturer datasheets
- Inspired by professional acoustic simulation tools

---

**SonicDraft** - Design with precision, propose with confidence.
