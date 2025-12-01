<script setup lang="ts">
/**
 * SpeakerSelectModal Component
 *
 * Full-screen modal for speaker selection with search, filtering, and detailed speaker cards.
 * Provides a better UX than cramped sidebar dropdowns.
 */

import { ref, computed, watch, nextTick } from 'vue'
import { Search, X, ChevronRight, Check, Zap, Ruler, Volume2 } from 'lucide-vue-next'
import { SpeakerType, type SpeakerModel } from '@/data/speakers'

interface Props {
  modelValue: string
  speakers: SpeakerModel[]
  brands: string[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Select Speaker',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Modal state
const isOpen = ref(false)
const searchQuery = ref('')
const selectedBrands = ref<string[]>([])
const searchInputRef = ref<HTMLInputElement | null>(null)

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
        s.meta.description.toLowerCase().includes(query) ||
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
    [SpeakerType.LineArray]: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    [SpeakerType.PointSource]: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
    [SpeakerType.Column]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    [SpeakerType.Subwoofer]: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  }
  return classes[type] || 'bg-audio-border text-audio-muted border-audio-border'
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

// Open modal
function openModal() {
  isOpen.value = true
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// Close modal
function closeModal() {
  isOpen.value = false
  searchQuery.value = ''
}

// Select a speaker
function selectSpeaker(id: string) {
  emit('update:modelValue', id)
  closeModal()
}

// Handle escape key
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeModal()
  }
}

// Reset filters when modal closes
watch(isOpen, (newVal) => {
  if (!newVal) {
    searchQuery.value = ''
  }
})
</script>

<template>
  <div>
    <!-- Trigger Button -->
    <div class="space-y-1">
      <label class="text-xs text-audio-muted">Main Speaker</label>
      <button
        type="button"
        class="input-field w-full flex items-center justify-between gap-2 cursor-pointer text-left group"
        @click="openModal"
      >
        <div v-if="selectedSpeaker" class="flex items-center gap-2 min-w-0 flex-1">
          <span class="truncate font-medium">{{ selectedSpeaker.brand }} {{ selectedSpeaker.model }}</span>
          <span
            class="flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded border"
            :class="getTypeBadgeClass(selectedSpeaker.type)"
          >
            {{ getSpeakerTypeLabel(selectedSpeaker.type) }}
          </span>
        </div>
        <span v-else class="text-audio-muted">Select speaker...</span>
        <ChevronRight
          class="w-4 h-4 flex-shrink-0 text-audio-muted group-hover:text-neon-green transition-colors"
        />
      </button>
    </div>

    <!-- Modal Backdrop -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="closeModal"
          @keydown="handleKeydown"
        >
          <!-- Modal Content -->
          <div
            class="bg-audio-panel border border-audio-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-audio-border">
              <h2 class="text-lg font-semibold text-audio-text">{{ title }}</h2>
              <button
                type="button"
                class="p-1 rounded-md text-audio-muted hover:text-audio-text hover:bg-audio-surface transition-colors"
                @click="closeModal"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Search & Filters -->
            <div class="px-4 py-3 border-b border-audio-border space-y-3">
              <!-- Search Input -->
              <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-audio-muted" />
                <input
                  ref="searchInputRef"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by name, brand, or description..."
                  class="w-full pl-10 pr-10 py-2 bg-audio-surface border border-audio-border rounded-lg focus:border-neon-green/50 focus:outline-none text-audio-text"
                />
                <button
                  v-if="searchQuery || selectedBrands.length > 0"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-audio-muted hover:text-audio-text"
                  @click="clearFilters"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <!-- Brand Filters -->
              <div v-if="brands.length > 1" class="flex flex-wrap gap-1.5">
                <button
                  v-for="brand in brands"
                  :key="brand"
                  class="px-2.5 py-1 text-xs rounded-full border transition-all"
                  :class="
                    selectedBrands.includes(brand)
                      ? 'bg-neon-green text-audio-dark border-neon-green'
                      : 'bg-audio-surface text-audio-muted border-audio-border hover:border-audio-text/30 hover:text-audio-text'
                  "
                  @click="toggleBrand(brand)"
                >
                  {{ brand }}
                </button>
              </div>
            </div>

            <!-- Speaker List -->
            <div class="flex-1 overflow-y-auto">
              <template v-if="filteredSpeakers.length > 0">
                <div v-for="(speakers, brand) in groupedSpeakers" :key="brand">
                  <!-- Brand Header -->
                  <div class="px-4 py-2 text-xs font-semibold text-audio-muted uppercase tracking-wide bg-audio-surface/50 sticky top-0 border-b border-audio-border/50">
                    {{ brand }}
                    <span class="font-normal">({{ speakers.length }})</span>
                  </div>

                  <!-- Speaker Cards -->
                  <div class="p-2 space-y-2">
                    <button
                      v-for="speaker in speakers"
                      :key="speaker.id"
                      class="w-full text-left p-3 rounded-lg border transition-all duration-150 cursor-pointer"
                      :class="[
                        speaker.id === modelValue
                          ? 'border-neon-green/50 bg-neon-green/5 hover:border-neon-green hover:bg-neon-green/10'
                          : 'border-audio-border bg-audio-surface/50 hover:border-audio-text/30 hover:bg-audio-surface'
                      ]"
                      @click="selectSpeaker(speaker.id)"
                    >
                      <!-- Card Content -->
                      <div class="flex items-start gap-3">
                        <!-- Selection Indicator -->
                        <div
                          class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5"
                          :class="
                            speaker.id === modelValue
                              ? 'border-neon-green bg-neon-green'
                              : 'border-audio-border'
                          "
                        >
                          <Check
                            v-if="speaker.id === modelValue"
                            class="w-3 h-3 text-audio-dark"
                          />
                        </div>

                        <!-- Speaker Info -->
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium text-audio-text">{{ speaker.model }}</span>
                            <span
                              class="px-1.5 py-0.5 text-[10px] rounded border"
                              :class="getTypeBadgeClass(speaker.type)"
                            >
                              {{ getSpeakerTypeLabel(speaker.type) }}
                            </span>
                          </div>

                          <p class="text-xs text-audio-muted mb-2 line-clamp-1">
                            {{ speaker.meta.description }}
                          </p>

                          <!-- Specs Grid -->
                          <div class="flex flex-wrap gap-3 text-xs">
                            <div class="flex items-center gap-1 text-audio-muted">
                              <Volume2 class="w-3 h-3" />
                              <span>{{ speaker.specs.maxSPL }} dB</span>
                            </div>
                            <div class="flex items-center gap-1 text-audio-muted">
                              <Zap class="w-3 h-3" />
                              <span>{{ speaker.specs.horzDispersion }}° × {{ speaker.specs.vertDispersion }}°</span>
                            </div>
                            <div class="flex items-center gap-1 text-audio-muted">
                              <Ruler class="w-3 h-3" />
                              <span>{{ speaker.meta.weight }} kg</span>
                            </div>
                          </div>
                        </div>

                        <!-- Price -->
                        <div class="flex-shrink-0 text-right">
                          <div class="text-sm font-mono text-neon-green">
                            ${{ speaker.pricing.perUnit.toLocaleString() }}
                          </div>
                          <div class="text-[10px] text-audio-muted">per unit</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </template>

              <!-- No Results -->
              <div v-else class="px-4 py-12 text-center">
                <Search class="w-12 h-12 mx-auto text-audio-border mb-3" />
                <p class="text-audio-muted">No speakers match your search</p>
                <button
                  v-if="searchQuery || selectedBrands.length > 0"
                  class="mt-2 text-sm text-neon-green hover:underline"
                  @click="clearFilters"
                >
                  Clear filters
                </button>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-4 py-3 border-t border-audio-border bg-audio-surface/50 flex items-center justify-between">
              <span class="text-xs text-audio-muted">
                {{ filteredSpeakers.length }} of {{ speakers.length }} speakers
              </span>
              <button
                type="button"
                class="px-4 py-1.5 text-sm bg-audio-surface border border-audio-border rounded-md hover:border-audio-text/30 text-audio-text transition-colors"
                @click="closeModal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
