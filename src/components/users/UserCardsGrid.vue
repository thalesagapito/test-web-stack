<script setup lang="ts">
import { toRef } from 'vue'
import { ListUsersQuery } from '../../API'
import BaseButton from '../base/BaseButton.vue'
import { useListUsersQuery } from '../../composables/queries/useListUsersQuery'
import UserCardsGridError from './UserCardsGridError.vue'
import UserCard from './UserCard.vue'

type User = NonNullable<ListUsersQuery['listUsers']>['items'][number]

const props = withDefaults(
  defineProps<{
    textSearch: string
  }>(),
  {
    textSearch: '',
  },
)

const emit = defineEmits<{
  (event: 'edit-user', user: User): void
  (event: 'delete-user', user: User): void
}>()

const textSearch = toRef(props, 'textSearch')
const { canFetchMore, fetchMore, hasErrors, isFetching, users, fetch } = useListUsersQuery(textSearch)

fetch()
</script>

<template>
  <keep-alive>
    <template v-if="isFetching && !users">
      <UserCard v-for="i in 6" :key="i" :loading="isFetching" />
    </template>

    <UserCardsGridError v-else-if="hasErrors" class="lg:col-span-3" />

    <template v-else>
      <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        :loading="isFetching"
        @edit="() => $emit('edit-user', user)"
        @delete="() => $emit('delete-user', user)"
      />

      <BaseButton
        v-if="canFetchMore"
        label="load more"
        :loading="isFetching"
        :disabled="isFetching"
        class="fetch-more-button"
        @click="fetchMore"
      />
    </template>
  </keep-alive>
</template>

<style scoped lang="postcss">
.fetch-more-button {
  @apply w-auto justify-self-center place-self-start lg:col-span-3;
}
</style>
