<script setup lang="ts">
/**
 * SliderInput Component
 *
 * Labeled slider with value display and optional unit.
 */

import { computed } from 'vue'

interface Props {
  modelValue: number
  min: number
  max: number
  step?: number
  label: string
  unit?: string
  precision?: number
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  unit: '',
  precision: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const displayValue = computed(() => {
  return props.modelValue.toFixed(props.precision)
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', parseFloat(target.value))
}
</script>

<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between">
      <label class="text-xs text-audio-muted">{{ label }}</label>
      <span class="text-xs font-mono text-audio-text">
        {{ displayValue }}<span v-if="unit" class="text-audio-muted ml-0.5">{{ unit }}</span>
      </span>
    </div>
    <input
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      class="w-full"
      @input="handleInput"
    />
  </div>
</template>
