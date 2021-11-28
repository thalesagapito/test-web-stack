<script setup lang="ts">
import { ListUsersQuery } from '../../API'
import BaseCard from '../base/BaseCard.vue'
import BaseIconButton from '../base/BaseIconButton.vue'
import UserCardAvatar from './UserCardAvatar.vue'
import UserCardTitle from './UserCardTitle.vue'

type User = NonNullable<ListUsersQuery['listUsers']>['items'][number]

withDefaults(
  defineProps<{
    user?: User
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
</script>

<template>
  <BaseCard :class="{ 'user-card': true, loading }">
    <div class="top-buttons">
      <BaseIconButton icon="edit" @click="$emit('edit')" />
      <BaseIconButton icon="delete" @click="$emit('delete')" />
    </div>

    <UserCardAvatar :prevent-fetch="loading" />

    <template v-if="user">
      <UserCardTitle
        v-if="user.name"
        :name="user.name"
        :created-at="user.createdAt"
      />
      <p v-if="user.description">
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
  @apply relative flex flex-col items-center p-8 space-y-4;

  &.loading {
    @apply animate-pulse pointer-events-none;
  }

  p {
    @apply truncate;
  }

  &:deep(.created-at) {
    @apply invisible opacity-0 transition-all duration-200 ease-in-out;
  }

  .top-buttons {
    @apply absolute inset-x-2 top-2 flex justify-between items-center
    invisible opacity-0 transition-all duration-200 ease-in-out;
  }

  &:hover .top-buttons,
  &:hover:deep(.created-at) {
    @apply visible opacity-100;
  }
}
</style>
