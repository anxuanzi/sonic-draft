<script setup lang="ts">
/**
 * ControlSidebar Component
 *
 * Main sidebar with all control panels organized in accordions.
 */

import { computed } from 'vue'
import {
  Box,
  Speaker,
  Sliders,
  FileText,
  RotateCcw,
  Download,
  Wand2,
} from 'lucide-vue-next'
import { useRoomStore, useSpeakerStore } from '@/stores'
import { SpeakerType } from '@/data/speakers'
import Accordion from '@/components/ui/Accordion.vue'
import SliderInput from '@/components/ui/SliderInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import NumberInput from '@/components/ui/NumberInput.vue'
import TextInput from '@/components/ui/TextInput.vue'

const roomStore = useRoomStore()
const speakerStore = useSpeakerStore()

const emit = defineEmits<{
  exportPdf: []
}>()

// Format speaker options for select
const speakerOptions = computed(() =>
  speakerStore.availableSpeakers.map((s) => ({
    value: s.id,
    label: `${s.brand} ${s.model}`,
    sublabel: getSpeakerTypeLabel(s.type),
  }))
)

// Format subwoofer options
const subwooferOptions = computed(() => [
  { value: '', label: 'None', sublabel: '' },
  ...speakerStore.compatibleSubwoofers.map((s) => ({
    value: s.id,
    label: `${s.brand} ${s.model}`,
    sublabel: '',
  })),
])

function getSpeakerTypeLabel(type: SpeakerType): string {
  const labels: Record<SpeakerType, string> = {
    [SpeakerType.LineArray]: 'Line Array',
    [SpeakerType.PointSource]: 'Point Source',
    [SpeakerType.Column]: 'Column',
    [SpeakerType.Subwoofer]: 'Subwoofer',
  }
  return labels[type] || type
}

function handleSpeakerChange(id: string) {
  speakerStore.selectSpeaker(id)
}

function handleSubChange(id: string) {
  speakerStore.selectSubwoofer(id || undefined)
}

function resetAll() {
  roomStore.resetToDefaults()
  speakerStore.resetToDefaults()
}
</script>

<template>
  <aside class="w-80 bg-audio-panel border-r border-audio-border flex flex-col h-full overflow-hidden">
    <div class="flex-1 overflow-y-auto">
      <!-- Project Info -->
      <Accordion title="Project Info" :icon="FileText">
        <div class="space-y-3">
          <TextInput
            v-model="roomStore.projectName"
            label="Project Name"
            placeholder="Enter project name..."
          />
          <TextInput
            v-model="roomStore.venueName"
            label="Venue Name"
            placeholder="Enter venue name..."
          />
        </div>
      </Accordion>

      <!-- Room Dimensions -->
      <Accordion title="Room Dimensions" :icon="Box">
        <div class="space-y-3">
          <SliderInput
            :model-value="roomStore.width"
            :min="5"
            :max="100"
            :step="0.5"
            label="Width"
            unit="m"
            @update:model-value="roomStore.setWidth"
          />
          <SliderInput
            :model-value="roomStore.depth"
            :min="5"
            :max="200"
            :step="0.5"
            label="Depth"
            unit="m"
            @update:model-value="roomStore.setDepth"
          />
          <SliderInput
            :model-value="roomStore.height"
            :min="3"
            :max="30"
            :step="0.5"
            label="Ceiling Height"
            unit="m"
            @update:model-value="roomStore.setHeight"
          />

          <!-- Room Stats -->
          <div class="mt-4 p-2 bg-audio-surface rounded-md">
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-audio-muted">Floor Area:</span>
                <span class="ml-1 font-mono text-audio-text">{{ roomStore.floorArea }} m²</span>
              </div>
              <div>
                <span class="text-audio-muted">Capacity:</span>
                <span class="ml-1 font-mono text-audio-text">~{{ roomStore.estimatedCapacity }}</span>
              </div>
            </div>
          </div>

          <!-- Room Presets -->
          <div class="flex gap-2 mt-2">
            <button
              v-for="preset in ['small', 'medium', 'large'] as const"
              :key="preset"
              class="flex-1 px-2 py-1 text-xs bg-audio-surface border border-audio-border rounded hover:border-neon-green/50 transition-colors capitalize"
              @click="roomStore.applyPreset(preset)"
            >
              {{ preset }}
            </button>
          </div>
        </div>
      </Accordion>

      <!-- Speaker Selection -->
      <Accordion title="Speaker System" :icon="Speaker">
        <div class="space-y-3">
          <SelectInput
            :model-value="speakerStore.selectedSpeakerId"
            :options="speakerOptions"
            label="Main Speaker"
            @update:model-value="handleSpeakerChange"
          />

          <!-- Speaker Info Card -->
          <div v-if="speakerStore.selectedSpeaker" class="p-2 bg-audio-surface rounded-md text-xs">
            <div class="flex items-center justify-between mb-2">
              <span class="text-neon-green font-medium">
                {{ getSpeakerTypeLabel(speakerStore.selectedSpeaker.type) }}
              </span>
              <span class="text-audio-muted">
                {{ speakerStore.selectedSpeaker.specs.maxSPL }} dB max
              </span>
            </div>
            <div class="grid grid-cols-2 gap-1 text-audio-muted">
              <span>H: {{ speakerStore.selectedSpeaker.specs.horzDispersion }}°</span>
              <span>V: {{ speakerStore.selectedSpeaker.specs.vertDispersion }}°</span>
              <span>{{ speakerStore.selectedSpeaker.meta.weight }} kg</span>
              <span>{{ speakerStore.selectedSpeaker.specs.frequencyRange.low }}-{{ speakerStore.selectedSpeaker.specs.frequencyRange.high }} Hz</span>
            </div>
          </div>

          <NumberInput
            :model-value="speakerStore.quantity"
            :min="1"
            :max="speakerStore.maxArraySize"
            label="Quantity"
            @update:model-value="speakerStore.setQuantity"
          />

          <SelectInput
            :model-value="speakerStore.selectedSubId || ''"
            :options="subwooferOptions"
            label="Subwoofer"
            @update:model-value="handleSubChange"
          />

          <NumberInput
            v-if="speakerStore.selectedSubId"
            :model-value="speakerStore.subQuantity"
            :min="0"
            :max="12"
            label="Sub Quantity"
            @update:model-value="speakerStore.setSubQuantity"
          />
        </div>
      </Accordion>

      <!-- Deployment -->
      <Accordion title="Deployment" :icon="Sliders">
        <div class="space-y-3">
          <SliderInput
            :model-value="speakerStore.trimHeight"
            :min="2"
            :max="roomStore.height - 1"
            :step="0.1"
            label="Trim Height"
            unit="m"
            @update:model-value="speakerStore.setTrimHeight"
          />
          <SliderInput
            :model-value="speakerStore.tiltAngle"
            :min="-15"
            :max="45"
            :step="0.5"
            label="Tilt Angle"
            unit="°"
            @update:model-value="speakerStore.setTiltAngle"
          />
          <SliderInput
            :model-value="speakerStore.horizontalAim"
            :min="-45"
            :max="45"
            :step="1"
            label="Horizontal Aim"
            unit="°"
            @update:model-value="speakerStore.setHorizontalAim"
          />

          <!-- Array Height Info -->
          <div class="p-2 bg-audio-surface rounded-md text-xs">
            <div class="flex justify-between">
              <span class="text-audio-muted">Array Height:</span>
              <span class="font-mono text-audio-text">{{ speakerStore.arrayHeight.toFixed(2) }} m</span>
            </div>
            <div class="flex justify-between">
              <span class="text-audio-muted">Top of Array:</span>
              <span class="font-mono text-audio-text">{{ speakerStore.topOfArrayHeight.toFixed(2) }} m</span>
            </div>
          </div>

          <!-- Auto-calculate buttons -->
          <div class="flex gap-2">
            <button
              class="flex-1 px-2 py-1.5 text-xs bg-audio-surface border border-audio-border rounded hover:border-neon-blue/50 transition-colors flex items-center justify-center gap-1"
              @click="speakerStore.autoCalculateTilt"
            >
              <Wand2 class="w-3 h-3" />
              Auto Tilt
            </button>
            <button
              class="flex-1 px-2 py-1.5 text-xs bg-audio-surface border border-audio-border rounded hover:border-neon-blue/50 transition-colors flex items-center justify-center gap-1"
              @click="speakerStore.suggestTrimHeight"
            >
              <Wand2 class="w-3 h-3" />
              Suggest Height
            </button>
          </div>
        </div>
      </Accordion>
    </div>

    <!-- Bottom Actions -->
    <div class="p-3 border-t border-audio-border space-y-2">
      <!-- Cost Summary -->
      <div class="p-3 bg-audio-surface rounded-md">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-audio-muted uppercase tracking-wide">Estimated Cost</span>
          <span class="text-lg font-mono font-semibold text-neon-green">
            {{ speakerStore.formattedTotalCost }}
          </span>
        </div>
        <div class="text-xs text-audio-muted">
          {{ speakerStore.quantity }} tops + {{ speakerStore.subQuantity }} subs
        </div>
      </div>

      <button
        class="btn-primary w-full flex items-center justify-center gap-2"
        @click="emit('exportPdf')"
      >
        <Download class="w-4 h-4" />
        Export Proposal
      </button>

      <button
        class="btn-secondary w-full flex items-center justify-center gap-2"
        @click="resetAll"
      >
        <RotateCcw class="w-4 h-4" />
        Reset All
      </button>
    </div>
  </aside>
</template>
