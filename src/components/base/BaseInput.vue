<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    placeholder?: string
    label?: string
  }>(),
  {
    modelValue: '',
    placeholder: undefined,
    label: undefined,
  },
)

const writableModelValue = useVModel(props, 'modelValue')
</script>

<template>
  <div class="base-input">
    <span v-if="label">
      {{ label }}
    </span>
    <input
      v-model="writableModelValue"
      :placeholder="placeholder"
      :aria-label="label"
      type="text"
    >
  </div>
</template>

<style scoped lang="postcss">
.base-input {
  @apply flex flex-col items-start;

  span {
    @apply font-semibold mb-2;
    font: 1.125rem;
  }

  input {
    @apply rounded-lg placeholder-black placeholder-opacity-40
    border-black text-xl transition font-light py-3 px-4 w-full
    outline-none border-opacity-10 bg-white focus:border-opacity-40;
  }
}
</style>
