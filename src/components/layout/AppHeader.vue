<script setup lang="ts">
/**
 * AppHeader Component
 *
 * Main application header with branding, project info, and quick stats.
 */

import { computed } from 'vue'
import { AudioLines, Settings, HelpCircle, Github } from 'lucide-vue-next'
import { useRoomStore, useSpeakerStore, useSettingsStore } from '@/stores'

const roomStore = useRoomStore()
const speakerStore = useSpeakerStore()
const settingsStore = useSettingsStore()

const hasCeilingWarning = computed(() => speakerStore.hasCeilingReflection)
</script>

<template>
  <header class="h-14 bg-audio-panel border-b border-audio-border flex items-center justify-between px-4">
    <!-- Brand -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <AudioLines class="w-7 h-7 text-neon-green" />
        <span class="text-xl font-semibold tracking-tight">
          <span class="text-gradient">Sonic</span><span class="text-audio-text">Draft</span>
        </span>
      </div>
      <div class="h-6 w-px bg-audio-border mx-2"></div>
      <div class="flex flex-col">
        <span class="text-sm font-medium text-audio-text truncate max-w-[200px]">
          {{ roomStore.projectName }}
        </span>
        <span v-if="roomStore.venueName" class="text-xs text-audio-muted truncate max-w-[200px]">
          {{ roomStore.venueName }}
        </span>
      </div>
    </div>

    <!-- Center Stats -->
    <div class="hidden md:flex items-center gap-6">
      <!-- Center Stage SPL -->
      <div class="flex flex-col items-center">
        <span class="text-xs text-audio-muted uppercase tracking-wide">Center Stage</span>
        <span class="text-lg font-mono font-semibold text-neon-green">
          {{ speakerStore.centerStageSPL }}
        </span>
      </div>

      <!-- Total Cost -->
      <div class="flex flex-col items-center">
        <span class="text-xs text-audio-muted uppercase tracking-wide">Est. Cost</span>
        <span class="text-lg font-mono font-semibold text-neon-blue">
          {{ speakerStore.formattedTotalCost }}
        </span>
      </div>

      <!-- Coverage Warning -->
      <div v-if="hasCeilingWarning" class="flex items-center gap-2 px-3 py-1 bg-neon-orange/10 border border-neon-orange/30 rounded-md">
        <span class="w-2 h-2 bg-neon-orange rounded-full animate-pulse"></span>
        <span class="text-xs text-neon-orange font-medium">Ceiling Reflection</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button
        class="btn-icon"
        title="Settings"
        @click="settingsStore.toggleSidebar()"
      >
        <Settings class="w-5 h-5" />
      </button>
      <button
        class="btn-icon"
        title="Help"
      >
        <HelpCircle class="w-5 h-5" />
      </button>
      <a
        href="https://github.com/anxuanzi/sonic-draft"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-icon"
        title="View on GitHub"
      >
        <Github class="w-5 h-5" />
      </a>
    </div>
  </header>
</template>
