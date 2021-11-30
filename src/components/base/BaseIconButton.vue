<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: 'create' | 'edit' | 'delete'
  }>(),
  {
    icon: undefined,
  },
)

defineEmits<{
  (event: 'click'): void
}>()
</script>

<template>
  <button class="base-icon-button" @click="$emit('click')">
    <svg
      v-if="icon === 'create'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 4v16m8-8H4"
      />
    </svg>

    <svg
      v-else-if="icon === 'edit'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>

    <svg
      v-else-if="icon === 'delete'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  </button>
</template>

<style scoped lang="postcss">
.base-icon-button {
  @apply p-4 bg-transparent rounded-xl transition text-gray-200
  outline-none hover:text-black focus:text-black;

  svg {
    @apply w-5 h-5;
  }
}
</style>
