<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    type: 'primary' | 'secondary'
  }>(),
  {
    label: '',
    type: 'primary',
  },
)
</script>

<template>
  <button :class="['base-button', type]">
    {{ label }}
  </button>
</template>

<style scoped lang="postcss">
.base-button {
  @apply flex justify-center items-center text-center px-6 py-2 rounded
  uppercase border-2 border-gray-300 font-semibold
  hover:border-gray-500 focus:border-gray-600 disabled:border-gray-200;

  &.primary {
    @apply bg-white;
  }

  &.secondary {
    @apply bg-gray-200;
  }
}
</style>
