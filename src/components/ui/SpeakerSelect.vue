<script setup lang="ts">
/**
 * SpeakerSelect Component
 *
 * Advanced speaker selection dropdown with search and brand filtering.
 * Designed to scale for large speaker databases.
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Search, X, ChevronDown } from 'lucide-vue-next'
import { SpeakerType, type SpeakerModel } from '@/data/speakers'

interface Props {
  modelValue: string
  speakers: SpeakerModel[]
  brands: string[]
  label: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select speaker...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Local state
const isOpen = ref(false)
const searchQuery = ref('')
const selectedBrands = ref<string[]>([])
const dropdownRef = ref<HTMLElement | null>(null)

// Get selected speaker for display
const selectedSpeaker = computed(() =>
  props.speakers.find((s) => s.id === props.modelValue)
)

// Filter speakers based on search and brand selection
const filteredSpeakers = computed(() => {
  let result = props.speakers

  // Filter by selected brands
  if (selectedBrands.value.length > 0) {
    result = result.filter((s) => selectedBrands.value.includes(s.brand))
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (s) =>
        s.brand.toLowerCase().includes(query) ||
        s.model.toLowerCase().includes(query) ||
        `${s.brand} ${s.model}`.toLowerCase().includes(query)
    )
  }

  return result
})

// Group speakers by brand for display
const groupedSpeakers = computed(() => {
  const groups: Record<string, SpeakerModel[]> = {}
  for (const speaker of filteredSpeakers.value) {
    const brand = speaker.brand
    if (!groups[brand]) {
      groups[brand] = []
    }
    groups[brand]!.push(speaker)
  }
  return groups
})

// Get speaker type label
function getSpeakerTypeLabel(type: SpeakerType): string {
  const labels: Record<SpeakerType, string> = {
    [SpeakerType.LineArray]: 'Line Array',
    [SpeakerType.PointSource]: 'Point Source',
    [SpeakerType.Column]: 'Column',
    [SpeakerType.Subwoofer]: 'Subwoofer',
  }
  return labels[type] || type
}

// Get type badge color
function getTypeBadgeClass(type: SpeakerType): string {
  const classes: Record<SpeakerType, string> = {
    [SpeakerType.LineArray]: 'bg-neon-green/20 text-neon-green',
    [SpeakerType.PointSource]: 'bg-neon-blue/20 text-neon-blue',
    [SpeakerType.Column]: 'bg-purple-500/20 text-purple-400',
    [SpeakerType.Subwoofer]: 'bg-orange-500/20 text-orange-400',
  }
  return classes[type] || 'bg-audio-border text-audio-muted'
}

// Toggle brand filter
function toggleBrand(brand: string) {
  const index = selectedBrands.value.indexOf(brand)
  if (index === -1) {
    selectedBrands.value.push(brand)
  } else {
    selectedBrands.value.splice(index, 1)
  }
}

// Clear all filters
function clearFilters() {
  searchQuery.value = ''
  selectedBrands.value = []
}

// Select a speaker
function selectSpeaker(id: string) {
  emit('update:modelValue', id)
  isOpen.value = false
  searchQuery.value = ''
}

// Handle click outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Setup click outside listener
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// Reset search when closing
watch(isOpen, (newVal) => {
  if (!newVal) {
    searchQuery.value = ''
  }
})
</script>

<template>
  <div ref="dropdownRef" class="space-y-1 relative">
    <label class="text-xs text-audio-muted">{{ label }}</label>

    <!-- Selected Display / Trigger -->
    <button
      type="button"
      class="input-field w-full flex items-center justify-between gap-2 cursor-pointer text-left"
      @click="isOpen = !isOpen"
    >
      <div v-if="selectedSpeaker" class="flex items-center gap-2 min-w-0">
        <span class="truncate">{{ selectedSpeaker.brand }} {{ selectedSpeaker.model }}</span>
        <span
          class="flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded"
          :class="getTypeBadgeClass(selectedSpeaker.type)"
        >
          {{ getSpeakerTypeLabel(selectedSpeaker.type) }}
        </span>
      </div>
      <span v-else class="text-audio-muted">{{ placeholder }}</span>
      <ChevronDown
        class="w-4 h-4 flex-shrink-0 text-audio-muted transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Panel -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 left-0 right-0 mt-1 bg-audio-panel border border-audio-border rounded-md shadow-xl overflow-hidden"
      >
        <!-- Search Input -->
        <div class="p-2 border-b border-audio-border">
          <div class="relative">
            <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-audio-muted" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search speakers..."
              class="w-full pl-8 pr-8 py-1.5 text-sm bg-audio-surface border border-audio-border rounded focus:border-neon-green/50 focus:outline-none text-audio-text"
            />
            <button
              v-if="searchQuery || selectedBrands.length > 0"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-audio-muted hover:text-audio-text"
              @click="clearFilters"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Brand Filters -->
        <div v-if="brands.length > 1" class="p-2 border-b border-audio-border">
          <div class="flex flex-wrap gap-1">
            <button
              v-for="brand in brands"
              :key="brand"
              class="px-2 py-0.5 text-xs rounded-full transition-colors"
              :class="
                selectedBrands.includes(brand)
                  ? 'bg-neon-green text-audio-dark'
                  : 'bg-audio-surface text-audio-muted hover:text-audio-text'
              "
              @click="toggleBrand(brand)"
            >
              {{ brand }}
            </button>
          </div>
        </div>

        <!-- Speaker List -->
        <div class="max-h-64 overflow-y-auto">
          <template v-if="filteredSpeakers.length > 0">
            <div v-for="(speakers, brand) in groupedSpeakers" :key="brand">
              <!-- Brand Header -->
              <div class="px-3 py-1 text-xs font-medium text-audio-muted bg-audio-surface/50 sticky top-0">
                {{ brand }}
              </div>
              <!-- Speakers in brand -->
              <button
                v-for="speaker in speakers"
                :key="speaker.id"
                class="w-full px-3 py-2 flex items-center justify-between gap-2 text-left hover:bg-audio-surface transition-colors"
                :class="{ 'bg-neon-green/10': speaker.id === modelValue }"
                @click="selectSpeaker(speaker.id)"
              >
                <div class="min-w-0">
                  <div class="text-sm text-audio-text truncate">{{ speaker.model }}</div>
                  <div class="text-xs text-audio-muted">
                    {{ speaker.specs.maxSPL }} dB &middot;
                    {{ speaker.specs.horzDispersion }}°×{{ speaker.specs.vertDispersion }}°
                  </div>
                </div>
                <span
                  class="flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded"
                  :class="getTypeBadgeClass(speaker.type)"
                >
                  {{ getSpeakerTypeLabel(speaker.type) }}
                </span>
              </button>
            </div>
          </template>

          <!-- No Results -->
          <div v-else class="px-3 py-6 text-center text-sm text-audio-muted">
            No speakers match your search
          </div>
        </div>

        <!-- Results Count -->
        <div class="px-3 py-1.5 text-xs text-audio-muted border-t border-audio-border bg-audio-surface/50">
          {{ filteredSpeakers.length }} of {{ speakers.length }} speakers
        </div>
      </div>
    </Transition>
  </div>
</template>
