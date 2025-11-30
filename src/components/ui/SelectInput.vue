<script setup lang="ts">
/**
 * SelectInput Component
 *
 * Styled select dropdown.
 */

interface Option {
  value: string
  label: string
  sublabel?: string
}

interface Props {
  modelValue: string
  options: Option[]
  label: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Select...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-1">
    <label class="text-xs text-audio-muted">{{ label }}</label>
    <select
      :value="modelValue"
      class="input-field appearance-none cursor-pointer"
      @change="handleChange"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
        <template v-if="option.sublabel"> - {{ option.sublabel }}</template>
      </option>
    </select>
  </div>
</template>
