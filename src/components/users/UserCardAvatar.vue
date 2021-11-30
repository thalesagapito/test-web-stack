<script setup lang="ts">
import { useUnsplashRandomImage } from '../../composables/external/unsplash'

const props = withDefaults(
  defineProps<{ preventFetch?: boolean }>(),
  { preventFetch: false },
)

const { src, status } = useUnsplashRandomImage('profile', props.preventFetch)
</script>

<template>
  <img v-if="status === 'success'" :src="src" alt="User avatar." class="user-card-avatar">
  <div v-else class="user-card-avatar unavailable" aria-hidden="true" />
</template>

<style scoped lang="postcss">
.user-card-avatar {
  @apply w-40 h-40 rounded-full object-cover transition;
  &.unavailable {
    @apply bg-gray-100;
  }
}
</style>
