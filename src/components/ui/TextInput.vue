<script setup lang="ts">
/**
 * TextInput Component
 *
 * Styled text input field.
 */

interface Props {
  modelValue: string
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'url'
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-1">
    <label class="text-xs text-audio-muted">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="input-field"
      @input="handleInput"
    />
  </div>
</template>
