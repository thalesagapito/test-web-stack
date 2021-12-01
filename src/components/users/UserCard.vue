<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '../base/BaseCard.vue'
import BaseIconButton from '../base/BaseIconButton.vue'
import { SearchedUser } from '../../composables/queries/useSearchUsersQuery'
import UserCardAvatar from './UserCardAvatar.vue'

const props = withDefaults(
  defineProps<{
    user?: SearchedUser
    loading: boolean
  }>(),
  {
    user: undefined,
    loading: false,
  },
)

defineEmits<{
  (event: 'edit'): void
  (event: 'delete'): void
}>()

const dateFormatter = Intl.DateTimeFormat(
  'en-US',
  {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },
)

const formattedCreatedAt = computed(() => {
  if (props.user.createdAt)
    return dateFormatter.format(new Date(props.user.createdAt))
  return undefined
})
</script>

<template>
  <BaseCard :class="{ 'user-card': true, loading }" data-cy="userCard">
    <div class="top-buttons">
      <BaseIconButton icon="edit" data-cy="editUser" @click="$emit('edit')" />
      <BaseIconButton icon="delete" data-cy="deleteUser" @click="$emit('delete')" />
    </div>

    <UserCardAvatar :prevent-fetch="loading" />

    <template v-if="user">
      <div class="title">
        <h2 class="name" data-cy="userCardName">
          {{ user.name }}
        </h2>

        <div class="created-at">
          created
          <span class="date">{{ formattedCreatedAt }}</span>
        </div>
      </div>

      <p v-if="user.description" class="w-full truncate">
        {{ user.description }}
      </p>
    </template>

    <div v-else-if="loading" class="w-full flex flex-col" aria-hidden="true">
      <div class="w-full h-7 bg-gray-100 rounded-lg mt-4" />
      <div class="w-full h-5 bg-gray-100 rounded-lg mt-4" />
    </div>
  </BaseCard>
</template>

<style scoped lang="postcss">
.user-card {
  @apply relative flex flex-col items-center p-8 space-y-4 self-stretch;

  &.loading {
    @apply animate-pulse pointer-events-none;
  }

  .top-buttons {
    @apply absolute inset-x-2 top-2 flex justify-between items-center opacity-0 transition;
  }

  .title {
    @apply w-full flex justify-between items-center space-x-4;

    .name {
      @apply text-left truncate;
    }

    .created-at {
      @apply  opacity-0 transition text-right whitespace-nowrap;
      .date {
        @apply text-red font-regular;
      }
    }
  }

  &:hover,
  &:focus-within {
    & .top-buttons,
    & .created-at {
      @apply opacity-100;
    }
  }
}
</style>
