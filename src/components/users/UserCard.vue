<script setup lang="ts">
import BaseCard from '../base/BaseCard.vue'
import { ListUsersQuery } from '../../API'
import UserCardAvatar from './UserCardAvatar.vue'
import UserCardTitle from './UserCardTitle.vue'

type User = NonNullable<ListUsersQuery['listUsers']>['items'][number]

withDefaults(
  defineProps<{
    user: User
    loading: boolean
  }>(),
  {
    user: undefined,
    loading: false,
  },
)
</script>

<template>
  <BaseCard :class="{ 'user-card': true, loading }">
    <UserCardAvatar />

    <UserCardTitle :name="user?.name" :created-at="user?.createdAt" />

    <p v-if="user?.description">
      {{ user.description }}
    </p>
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

  &:hover:deep(.created-at) {
    @apply visible opacity-100;
  }
}
</style>
