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
  @apply flex justify-center items-center text-center px-16 py-6 rounded-lg
  text-xl uppercase border-4 border-black border-opacity-10 font-semibold transition
  hover:border-opacity-40 focus:border-opacity-50 disabled:text-opacity-50;

  &.primary {
    @apply bg-white;
  }

  &.secondary {
    @apply bg-transparent;
  }
}
</style>
