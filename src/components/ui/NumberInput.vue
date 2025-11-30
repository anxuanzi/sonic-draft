<script setup lang="ts">
/**
 * NumberInput Component
 *
 * Styled number input with increment/decrement buttons.
 */

import { Minus, Plus } from 'lucide-vue-next'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  label: string
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  unit: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function increment() {
  const newValue = Math.min(props.max, props.modelValue + props.step)
  emit('update:modelValue', newValue)
}

function decrement() {
  const newValue = Math.max(props.min, props.modelValue - props.step)
  emit('update:modelValue', newValue)
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = parseFloat(target.value)
  if (isNaN(value)) value = props.min
  value = Math.max(props.min, Math.min(props.max, value))
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="space-y-1">
    <label class="text-xs text-audio-muted">{{ label }}</label>
    <div class="flex items-center gap-1">
      <button
        type="button"
        class="w-8 h-8 flex items-center justify-center bg-audio-surface border border-audio-border rounded hover:bg-audio-border transition-colors"
        :disabled="modelValue <= min"
        @click="decrement"
      >
        <Minus class="w-3 h-3" />
      </button>
      <div class="relative flex-1">
        <input
          type="number"
          :value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          class="input-field text-center pr-8"
          @input="handleInput"
        />
        <span
          v-if="unit"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-audio-muted pointer-events-none"
        >
          {{ unit }}
        </span>
      </div>
      <button
        type="button"
        class="w-8 h-8 flex items-center justify-center bg-audio-surface border border-audio-border rounded hover:bg-audio-border transition-colors"
        :disabled="modelValue >= max"
        @click="increment"
      >
        <Plus class="w-3 h-3" />
      </button>
    </div>
  </div>
</template>
