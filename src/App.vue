<script setup lang="ts">
/**
 * Main Application Component
 *
 * SonicDraft - The Open-Source Acoustic Design & Proposal Studio
 *
 * This is the root component that orchestrates the entire application,
 * combining the header, control sidebar, and visualization panels.
 */

import { ref } from 'vue'
import { useSettingsStore } from '@/stores'
import AppHeader from '@/components/layout/AppHeader.vue'
import ControlSidebar from '@/components/layout/ControlSidebar.vue'
import VisualizationPanel from '@/components/canvas/VisualizationPanel.vue'
import { usePdfExport } from '@/composables/usePdfExport'

const visualizationRef = ref<InstanceType<typeof VisualizationPanel> | null>(null)
const { exportProposal } = usePdfExport()
const settingsStore = useSettingsStore()

/**
 * Handle PDF export request.
 * Captures canvases from visualization panel and generates PDF.
 */
async function handleExportPdf() {
  if (!visualizationRef.value) return

  const topDownCanvas = visualizationRef.value.topDownRef?.canvasRef
  const sideElevationCanvas = visualizationRef.value.sideElevationRef?.canvasRef

  await exportProposal(topDownCanvas, sideElevationCanvas)
}
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Control Sidebar -->
      <transition name="fade" mode="out-in">
        <ControlSidebar v-show="!settingsStore.sidebarCollapsed" @export-pdf="handleExportPdf" />
      </transition>

      <!-- Visualization Area -->
      <main class="flex-1 bg-audio-bg overflow-hidden">
        <VisualizationPanel ref="visualizationRef" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
