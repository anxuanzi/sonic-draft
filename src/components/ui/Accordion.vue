<script setup lang="ts">
/**
 * Accordion Component
 *
 * Collapsible section with header and content.
 */

import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface Props {
  title: string
  defaultOpen?: boolean
  icon?: object
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true,
})

const isOpen = ref(props.defaultOpen)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="border-b border-audio-border">
    <button
      class="accordion-trigger"
      :class="{ 'text-neon-green': isOpen }"
      @click="toggle"
    >
      <div class="flex items-center gap-2">
        <component
          v-if="icon"
          :is="icon"
          class="w-4 h-4 text-audio-muted"
        />
        <span class="font-medium text-sm">{{ title }}</span>
      </div>
      <ChevronDown
        class="w-4 h-4 text-audio-muted transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>
    <div
      class="accordion-content"
      :class="isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'"
    >
      <div class="p-3 pt-0">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
