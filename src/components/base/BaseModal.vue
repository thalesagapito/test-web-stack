<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { onKeyUp, set } from '@vueuse/core'

const props = withDefaults(
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

const isModalVisible = ref(false)
const showModal = () => set(isModalVisible, true)
const hideModal = () => set(isModalVisible, false)

const isOverlayVisible = ref(false)
const showOverlay = () => set(isOverlayVisible, true)
const hideOverlay = () => set(isOverlayVisible, false)

const isComponentVisible = ref(false)
const showComponent = () => set(isComponentVisible, true)
const hideComponent = () => set(isComponentVisible, false)

watch(() => props.isOpen, isOpen => isOpen ? showComponent() : hideModal())

const emitClose = () => emit('update:isOpen', false)
const slotProps = reactive({ close: hideModal })
onKeyUp('Escape', hideModal)
</script>

<template>
  <teleport to="body">
    <transition @enter="showOverlay" @leave="emitClose">
      <div v-if="isComponentVisible" class="base-modal-wrapper">
        <transition name="fade" @enter="showModal" @after-leave="hideComponent">
          <div v-show="isOverlayVisible" class="overlay" @click.self="hideModal" />
        </transition>

        <transition name="fade-expand" @leave="hideOverlay">
          <div v-show="isModalVisible" :class="[$attrs.class, 'card']">
            <h1 v-if="title" class="title">
              {{ title }}
            </h1>

            <div class="content">
              <slot v-bind="slotProps" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="postcss">
.base-modal-wrapper {
  @apply fixed inset-0 overflow-hidden z-30 flex justify-center items-center p-2 m-0;

  .overlay {
    @apply absolute inset-0 w-full h-full bg-black bg-opacity-30;
  }

  .card {
    @apply relative flex flex-col bg-gray-100 rounded-xl shadow-xl mx-auto;

    .title {
      @apply text-left px-8 pt-8;
    }

    .content {
      @apply overflow-y-auto;
      max-height: calc(100vh - theme('spacing.44'));
    }
  }
}
</style>
