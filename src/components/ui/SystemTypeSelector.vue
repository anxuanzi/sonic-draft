<script setup lang="ts">
/**
 * SystemTypeSelector Component
 *
 * Visual card-based selector for choosing PA system types.
 * Each card shows the system type name, tagline, and use cases.
 */

import { computed } from 'vue'
import { Speaker, Layers, PanelLeft, Grid3x3 } from 'lucide-vue-next'
import {
  type SystemTypeId,
  type SystemTypeConfig,
  getAllSystemTypeConfigs,
} from '@/data/speakers'

interface Props {
  modelValue: SystemTypeId
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: SystemTypeId]
}>()

// Get all system type configurations
const systemTypes = computed(() => getAllSystemTypeConfigs())

// Map icon names to components
const iconMap: Record<string, typeof Speaker> = {
  Speaker,
  Layers,
  PanelLeft,
  Grid3x3,
}

function getIcon(iconName: string) {
  return iconMap[iconName] || Speaker
}

function selectType(config: SystemTypeConfig) {
  emit('update:modelValue', config.id)
}

function isSelected(config: SystemTypeConfig): boolean {
  return props.modelValue === config.id
}
</script>

<template>
  <div class="space-y-2">
    <label class="text-xs text-audio-muted uppercase tracking-wide">System Type</label>
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="config in systemTypes"
        :key="config.id"
        type="button"
        class="relative flex items-center gap-2 p-2 rounded-lg border transition-all duration-150 cursor-pointer"
        :class="[
          isSelected(config)
            ? 'border-neon-green bg-neon-green/5 hover:border-neon-green hover:bg-neon-green/10'
            : 'border-audio-border bg-audio-surface hover:border-audio-text/30 hover:bg-audio-panel'
        ]"
        @click="selectType(config)"
      >
        <!-- Icon -->
        <div
          class="flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-150"
          :class="[
            isSelected(config)
              ? 'bg-neon-green/20 text-neon-green'
              : 'bg-audio-panel text-audio-muted'
          ]"
        >
          <component :is="getIcon(config.icon)" class="w-5 h-5" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 text-left">
          <div class="font-medium text-sm text-audio-text truncate">
            {{ config.name }}
          </div>
          <div class="text-xs text-audio-muted truncate">
            {{ config.tagline }}
          </div>
        </div>

        <!-- Selection indicator -->
        <div
          v-if="isSelected(config)"
          class="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-green"
        />
      </button>
    </div>

    <!-- Selected type details -->
    <div
      v-if="modelValue"
      class="p-2 bg-audio-surface rounded-md text-xs"
    >
      <div class="flex flex-wrap gap-1">
        <span
          v-for="useCase in systemTypes.find(s => s.id === modelValue)?.useCases || []"
          :key="useCase"
          class="px-1.5 py-0.5 bg-audio-panel rounded text-audio-muted"
        >
          {{ useCase }}
        </span>
      </div>
    </div>
  </div>
</template>
