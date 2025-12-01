<script setup lang="ts">
/**
 * VisualizationPanel Component
 *
 * Main container for the visualization canvases.
 * Supports split view, top-down only, and side elevation only modes.
 */

import { ref } from 'vue'
import { LayoutGrid, ArrowUpDown, ArrowLeftRight } from 'lucide-vue-next'
import { useSettingsStore, type ViewMode } from '@/stores'
import TopDownCoverage from './TopDownCoverage.vue'
import SideElevation from './SideElevation.vue'

const settingsStore = useSettingsStore()

const topDownRef = ref<InstanceType<typeof TopDownCoverage> | null>(null)
const sideElevationRef = ref<InstanceType<typeof SideElevation> | null>(null)

const viewModeOptions: { mode: ViewMode; icon: any; label: string }[] = [
  { mode: 'split', icon: LayoutGrid, label: 'Split View' },
  { mode: 'topDown', icon: ArrowUpDown, label: 'Top Down' },
  { mode: 'sideElevation', icon: ArrowLeftRight, label: 'Side Elevation' },
]

function setViewMode(mode: ViewMode) {
  settingsStore.setViewMode(mode)
}

// Expose refs for PDF export
defineExpose({
  topDownRef,
  sideElevationRef,
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- View Mode Toggle -->
    <div class="flex items-center justify-center gap-2 p-2 bg-audio-panel border-b border-audio-border">
      <button
        v-for="option in viewModeOptions"
        :key="option.mode"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors"
        :class="
          settingsStore.viewMode === option.mode
            ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
            : 'text-audio-muted hover:text-audio-text hover:bg-audio-surface'
        "
        @click="setViewMode(option.mode)"
      >
        <component :is="option.icon" class="w-3.5 h-3.5" />
        {{ option.label }}
      </button>

      <!-- Separator -->
      <div class="mx-2 h-5 w-px bg-audio-border" />

      <!-- SPL Toggle (off by default) -->
      <button
        class="px-3 py-1.5 rounded text-xs font-medium transition-colors border"
        :class="
          settingsStore.showSPL
            ? 'bg-neon-green/20 text-neon-green border-neon-green/30'
            : 'text-audio-muted hover:text-audio-text hover:bg-audio-surface border-audio-border'
        "
        @click="settingsStore.toggleSPL()"
        title="Toggle SPL heatmap overlay"
      >
        Show SPL
      </button>
    </div>

    <!-- Canvas Area -->
    <div class="flex-1 p-2 overflow-hidden">
      <!-- Split View -->
      <div
        v-if="settingsStore.viewMode === 'split'"
        class="grid grid-rows-2 gap-2 h-full"
      >
        <TopDownCoverage ref="topDownRef" />
        <SideElevation ref="sideElevationRef" />
      </div>

      <!-- Top Down Only -->
      <div
        v-else-if="settingsStore.viewMode === 'topDown'"
        class="h-full"
      >
        <TopDownCoverage ref="topDownRef" />
      </div>

      <!-- Side Elevation Only -->
      <div
        v-else-if="settingsStore.viewMode === 'sideElevation'"
        class="h-full"
      >
        <SideElevation ref="sideElevationRef" />
      </div>
    </div>
  </div>
</template>
