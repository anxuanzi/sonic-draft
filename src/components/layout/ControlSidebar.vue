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
  Radio,
} from 'lucide-vue-next'
import { useRoomStore, useSpeakerStore } from '@/stores'
import { SpeakerType, type DeploymentMode } from '@/data/speakers'
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

// Deployment mode options
const deploymentModeOptions = [
  { value: 'L/R Stereo', label: 'L/R Stereo', sublabel: 'Standard stereo' },
  { value: 'Center Mono', label: 'Center Mono', sublabel: 'Single array' },
]

// Format center fill speaker options
const centerFillOptions = computed(() =>
  speakerStore.availableCenterFillSpeakers.map((s) => ({
    value: s.id,
    label: `${s.brand} ${s.model}`,
    sublabel: getSpeakerTypeLabel(s.type),
  }))
)

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

function handleDeploymentModeChange(mode: string) {
  speakerStore.setDeploymentMode(mode as DeploymentMode)
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
          <!-- Deployment Mode -->
          <SelectInput
            :model-value="speakerStore.deploymentMode"
            :options="deploymentModeOptions"
            label="Mode"
            @update:model-value="handleDeploymentModeChange"
          />

          <!-- Array Spread (only in L/R Stereo mode) -->
          <SliderInput
            v-if="speakerStore.deploymentMode === 'L/R Stereo'"
            :model-value="speakerStore.arraySpread"
            :min="0"
            :max="Math.max(2, roomStore.width - 2)"
            :step="0.5"
            label="Array Spread (L/R)"
            unit="m"
            @update:model-value="speakerStore.setArraySpread"
          />

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
            :label="speakerStore.deploymentMode === 'L/R Stereo' ? 'Toe-In Angle' : 'Horizontal Aim'"
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
            <div v-if="speakerStore.deploymentMode === 'L/R Stereo'" class="flex justify-between mt-1 pt-1 border-t border-audio-border">
              <span class="text-audio-muted">L/R Separation:</span>
              <span class="font-mono text-audio-text">{{ speakerStore.arraySpread.toFixed(1) }} m</span>
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

      <!-- Center Fill (only in L/R Stereo mode) -->
      <Accordion v-if="speakerStore.deploymentMode === 'L/R Stereo'" title="Center Fill" :icon="Radio">
        <div class="space-y-3">
          <!-- Enable Toggle -->
          <div class="flex items-center justify-between">
            <label class="text-xs text-audio-muted">Enable Center Fill</label>
            <button
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              :class="speakerStore.centerFill.enabled ? 'bg-neon-green' : 'bg-audio-border'"
              @click="speakerStore.setCenterFillEnabled(!speakerStore.centerFill.enabled)"
            >
              <span
                class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                :class="speakerStore.centerFill.enabled ? 'translate-x-4.5' : 'translate-x-1'"
              />
            </button>
          </div>

          <!-- Center Fill Options (only when enabled) -->
          <template v-if="speakerStore.centerFill.enabled">
            <SelectInput
              :model-value="speakerStore.centerFill.modelId"
              :options="centerFillOptions"
              label="Fill Speaker"
              @update:model-value="speakerStore.setCenterFillModel"
            />

            <SliderInput
              :model-value="speakerStore.centerFill.gain"
              :min="-12"
              :max="6"
              :step="1"
              label="Gain Adjust"
              unit="dB"
              @update:model-value="speakerStore.setCenterFillGain"
            />

            <!-- Center Fill Info -->
            <div v-if="speakerStore.selectedCenterFillSpeaker" class="p-2 bg-audio-surface rounded-md text-xs">
              <div class="flex items-center justify-between mb-1">
                <span class="text-neon-blue font-medium">
                  {{ getSpeakerTypeLabel(speakerStore.selectedCenterFillSpeaker.type) }}
                </span>
                <span class="text-audio-muted">
                  {{ speakerStore.selectedCenterFillSpeaker.specs.maxSPL }} dB
                </span>
              </div>
              <div class="text-audio-muted">
                Coverage: {{ speakerStore.selectedCenterFillSpeaker.specs.horzDispersion }}° H × {{ speakerStore.selectedCenterFillSpeaker.specs.vertDispersion }}° V
              </div>
            </div>
          </template>

          <!-- Info when disabled -->
          <div v-else class="p-2 bg-audio-surface rounded-md text-xs text-audio-muted">
            Center fills help cover the "power alley" gap between L/R arrays for front row listeners.
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
