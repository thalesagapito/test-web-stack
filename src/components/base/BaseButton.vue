<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    type?: 'primary' | 'secondary'
    loading?: boolean
  }>(),
  {
    label: '',
    loading: false,
    type: 'primary',
  },
)
</script>

<template>
  <button :class="{'base-button': true, [type]: true, loading }">
    {{ label }}
  </button>
</template>

<style scoped lang="postcss">
.base-button {
  @apply flex justify-center items-center px-10 py-4
  text-center rounded-lg text-xl uppercase border-4
  border-black border-opacity-10 font-semibold transition
  outline-none hover:border-opacity-40 focus:border-opacity-50
  disabled:border-opacity-10 disabled:text-opacity-50 disabled:cursor-not-allowed;

  &.primary {
    @apply bg-white;
  }

  &.secondary {
    @apply bg-transparent;
  }

  &.loading {
    @apply cursor-wait disabled:cursor-wait;
  }
}
</style>
