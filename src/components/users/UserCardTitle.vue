<script setup lang="ts">
import { computed } from 'vue'

const dateFormatter = Intl.DateTimeFormat(
  'en-US',
  {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },
)

const props = withDefaults(
  defineProps<{
    name: string
    createdAt: string
  }>(),
  {
    name: undefined,
    createdAt: undefined,
  },
)

const formattedCreatedAt = computed(() => dateFormatter.format(new Date(props.createdAt)))
</script>

<template>
  <div class="user-card-title">
    <h2 class="name">
      {{ name }}
    </h2>

    <div class="created-at">
      created
      <span>{{ formattedCreatedAt }}</span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.user-card-title {
  @apply w-full flex justify-between items-center space-x-4;

  .name {
    @apply text-left;
  }

  .created-at {
    @apply text-right;
    span {
      @apply text-red font-regular;
    }
  }
}
</style>
