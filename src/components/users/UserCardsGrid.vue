<script setup lang="ts">
import BaseButton from '../base/BaseButton.vue'
import { DEFAULT_LIMIT, User } from '../../composables/queries/useSearchUsersQuery'
import UserCardsGridWarning from './UserCardsGridWarning.vue'
import UserCard from './UserCard.vue'

const props = withDefaults(
  defineProps<{
    canFetchMore: boolean
    isFetching: boolean
    hasErrors: boolean
    users: User[]
  }>(),
  {
    canFetchMore: false,
    isFetching: false,
    hasErrors: false,
    users: () => [],
  },
)

defineEmits<{
  (event: 'fetchMore'): void
  (event: 'edit-user', user: User): void
  (event: 'delete-user', user: User): void
}>()

</script>

<template>
  <template v-if="isFetching && !users?.length">
    <UserCard v-for="i in DEFAULT_LIMIT" :key="i" :loading="isFetching" />
  </template>

  <UserCardsGridWarning
    v-else-if="hasErrors"
    class="lg:col-span-3"
    message="an error occurred while fetching the users"
  />

  <UserCardsGridWarning
    v-else-if="!users?.length"
    class="lg:col-span-3"
    message="no users found"
  />

  <template v-else>
    <UserCard
      v-for="user in users"
      :key="user.id"
      :user="user"
      :loading="isFetching"
      @edit="$emit('edit-user', user)"
      @delete="$emit('delete-user', user)"
    />

    <BaseButton
      v-if="canFetchMore"
      label="load more"
      :loading="isFetching"
      :disabled="isFetching"
      class="fetch-more-button"
      @click="$emit('fetchMore')"
    />
  </template>
</template>

<style scoped lang="postcss">
.fetch-more-button {
  @apply w-auto justify-self-center place-self-start lg:col-span-3;
}
</style>
