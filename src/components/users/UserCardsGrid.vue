<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { set, useVModel } from '@vueuse/core'
import BaseButton from '../base/BaseButton.vue'
import { DEFAULT_LIMIT, useListUsersQuery, User } from '../../composables/queries/useListUsersQuery'
import UserCardsGridWarning from './UserCardsGridWarning.vue'
import UserDeleteModal from './UserDeleteModal.vue'
import UserCard from './UserCard.vue'

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

defineEmits<{
  (event: 'update:initialLimit', value: number): void
}>()

const { textSearch } = toRefs(props)
const writableInitialLimit = useVModel(props, 'initialLimit')
const { canFetchMore, fetchMore, hasErrors, isFetching, users, fetch } = useListUsersQuery(textSearch, writableInitialLimit)
fetch({ limit: writableInitialLimit.value || DEFAULT_LIMIT })

const userToDelete = ref<User>()
const isUserDeleteModalOpen = ref(false)
function openUserDeleteModal(user: User) {
  set(userToDelete, user)
  set(isUserDeleteModalOpen, true)
}

const userToEdit = ref<User>()
const isUserEditModalOpen = ref(false)
function openUserEditModal(user: User) {
  set(userToEdit, user)
  set(isUserEditModalOpen, true)
}

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
    message="we didn't find any users with the specified query"
  />

  <template v-else>
    <UserCard
      v-for="user in users"
      :key="user.id"
      :user="user"
      :loading="isFetching"
      @edit="() => openUserEditModal(user)"
      @delete="() => openUserDeleteModal(user)"
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

  <UserDeleteModal
    v-model:isOpen="isUserDeleteModalOpen"
    :user="userToDelete"
    @delete="fetch"
  />
</template>

<style scoped lang="postcss">
.fetch-more-button {
  @apply w-auto justify-self-center place-self-start lg:col-span-3;
}
</style>
