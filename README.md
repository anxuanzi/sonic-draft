# SonicDraft 🎛️

The Open-Source Acoustic Design & Proposal Studio. Plan speaker deployments, simulate coverage, and draft professional audio proposals in seconds.

## 📖 About The Project

SonicDraft is a web-based acoustic simulation tool designed to help audio engineers, venue owners, and integrators visualize sound.

Traditional acoustic modeling software is often expensive, complex, and overkill for small-to-mid-sized venue proposals. SonicDraft fills this gap by providing an intuitive, browser-based interface to design PA systems. It combines a robust physics engine with a "drafting" interface, allowing users to place speakers, check for coverage dead zones, and instantly export a client-ready PDF proposal with a Bill of Materials (BOM).

## 🚀 Key Features

- **Smart Acoustic Simulation**: Real-time rendering of horizontal (Top-Down) and vertical (Side-Elevation) coverage using the HTML5 Canvas API.

- **Physics-First Logic**: Accurate SPL calculations that respect the differences between Point Source (Inverse Square Law) and Line Array (Cylindrical Wave) behaviors.

- **Modular Speaker Library**: An extensible data layer supporting major industry standards (JBL, Meyer Sound, d&b, EV, etc.).

- **Safety Intelligence**: Automatic detection and visual warnings for ceiling reflections and poor coverage angles.

- **Proposal Studio**: One-click generation of professional PDF reports containing high-res coverage maps, equipment lists, and cost estimates.

- **Client-Side Architecture**: Runs entirely in the browser. Deployable anywhere, optimized for GitHub Pages.

## 🛠 Tech Stack

SonicDraft is built with modern web technologies, prioritizing type safety and performance.

- **Framework**: Vue 3 (Composition API, <script setup>)

- **Build Tool**: Vite

- **Language**: TypeScript (Strict Mode)

- **State Management**: Pinia (Reactive stores for Room & Speaker configurations)

- **Styling**: Tailwind CSS (Dark-mode focused "Pro Audio" aesthetic)

- **Icons**: Lucide Vue

- **Rendering**: Native HTML5 Canvas API

- **Export Engine**: `jspdf` + `html2canvas`
