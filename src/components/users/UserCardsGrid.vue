<script setup lang="ts">
import { computed } from 'vue'
import { listUsers } from '../../graphql/queries'
import { useQuery } from '../../composables/useQuery'
import { ListUsersQuery, ListUsersQueryVariables } from '../../API'
import BaseButton from '../base/BaseButton.vue'
import UserCard from './UserCard.vue'

const props = withDefaults(
  defineProps<{
    textSearch: string
  }>(),
  {
    textSearch: '',
  },
)

const query = listUsers
const variables = computed<ListUsersQueryVariables>(() => ({
  filter: {
    name: { contains: props.textSearch },
  },
  limit: 6,
}))

const { data, fetch, isFetching, errors } = useQuery<ListUsersQuery, ListUsersQueryVariables>({
  query,
  variables,
  watchVariables: true,
  watchVariablesDebounceInMs: 200,
})

const users = computed(() => data.value?.listUsers?.items)
const canFetchMore = computed(() => !!data.value?.listUsers?.nextToken)

function fetchMore() {
  fetch(
    {
      ...variables.value,
      nextToken: data.value?.listUsers?.nextToken,
    },
    (response) => {
      if (response.data?.listUsers) {
        const previousItems = data.value?.listUsers?.items || []
        const newItems = response.data.listUsers.items || []
        const items = [...previousItems, ...newItems]
        data.value = {
          ...response.data,
          listUsers: { ...response.data.listUsers, items },
        }
      }
      errors.value = response.errors
    },
  )
}

fetch()
</script>

<template>
  <UserCard
    v-for="user in users"
    :key="user.id"
    :user="user"
    :loading="isFetching"
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

<style scoped lang="postcss">
.fetch-more-button {
  @apply w-auto justify-self-center place-self-start lg:col-span-3;
}
</style>
