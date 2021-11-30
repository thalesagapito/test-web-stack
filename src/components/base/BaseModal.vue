<script setup lang="ts">
import { onKeyUp } from '@vueuse/core'

withDefaults(
  defineProps<{
    title: string
    isOpen: boolean
  }>(),
  {
    title: '',
    isOpen: false,
  },
)

const emit = defineEmits<{
  (event: 'update:isOpen', value: boolean): void
}>()

const close = () => emit('update:isOpen', false)

onKeyUp('Escape', close)
</script>

<template>
  <teleport to="body">
    <transition name="fade-expand">
      <div v-if="isOpen" class="base-modal-wrapper">
        <div class="overlay" @click.self="close" />

        <div class="card">
          <h1 v-if="title" class="title">
            {{ title }}
          </h1>

          <div class="content">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="postcss">
.base-modal-wrapper {
  @apply fixed inset-0 z-30 flex justify-center items-center p-2 m-0;

  .overlay {
    @apply fixed -inset-full bg-black bg-opacity-30;
  }

  .card {
    @apply relative flex flex-col bg-gray-100 rounded-xl shadow-xl mx-auto;

    .title {
      @apply text-left px-8 pt-8;
    }

    .content {
      @apply overflow-y-auto;
      max-height: calc(100vh - theme('spacing.36'));
    }
  }
}
</style>
