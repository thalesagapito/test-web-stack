<script setup lang="ts">
import { toRefs } from 'vue'
import { useVModel } from '@vueuse/core'
import { ListUsersQuery } from '../../API'
import BaseButton from '../base/BaseButton.vue'
import { DEFAULT_ITEMS_LIMIT, useListUsersQuery } from '../../composables/queries/useListUsersQuery'
import UserCardsGridWarning from './UserCardsGridWarning.vue'
import UserCard from './UserCard.vue'

type User = NonNullable<ListUsersQuery['listUsers']>['items'][number]

const props = withDefaults(
  defineProps<{
    textSearch?: string | null
    initialLimit?: number | null
  }>(),
  {
    textSearch: undefined,
    initialLimit: undefined,
  },
)

const emit = defineEmits<{
  (event: 'edit-user', user: User): void
  (event: 'delete-user', user: User): void
  (event: 'update:initialLimit', value: number): void
}>()

const { textSearch } = toRefs(props)
const writableInitialLimit = useVModel(props, 'initialLimit')
const { canFetchMore, fetchMore, hasErrors, isFetching, users, fetch } = useListUsersQuery(textSearch, writableInitialLimit)

fetch({ limit: writableInitialLimit.value || DEFAULT_ITEMS_LIMIT })
</script>

<template>
  <keep-alive>
    <template v-if="isFetching && !users?.length">
      <UserCard v-for="i in DEFAULT_ITEMS_LIMIT" :key="i" :loading="isFetching" />
    </template>

    <UserCardsGridWarning
      v-else-if="hasErrors"
      class="lg:col-span-3"
      message="an error occurred while fetching the users"
    />

    <UserCardsGridWarning
      v-else-if="!users?.length"
      class="lg:col-span-3"
      message="we didn't find any users with the specified query"
    />

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
