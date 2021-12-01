<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'
import { useUserModals } from '../composables/useUserModals'
import UserCardsGrid from '../components/users/UserCardsGrid.vue'
import BaseIconButton from '../components/base/BaseIconButton.vue'
import UserDeleteModal from '../components/users/UserDeleteModal.vue'
import { useRouteQueryFilters } from '../composables/useRouteQueryFilters'
import { useSearchUsersQuery } from '../composables/queries/useSearchUsersQuery'
import UserCreateOrUpdateModal from '../components/users/UserCreateOrUpdateModal.vue'

const { textSearch, limit } = useRouteQueryFilters()
const {
  canFetchMore,
  fetchMore,
  hasErrors,
  isFetching,
  users,
  fetch,
  deleteUserLocally,
  createOrUpdateUserLocally,
} = useSearchUsersQuery(textSearch, limit)
fetch()

const {
  userToDelete,
  isUserDeleteModalOpen,
  openUserDeleteModal,

  userToEdit,
  isUserCreateOrUpdateModalOpen,
  openUserCreateOrUpdateModal,
} = useUserModals()
</script>

<template>
  <div class="users-list">
    <h1 class="flex items-center">
      Users list
      <BaseIconButton
        icon="create"
        class="mt-2 ml-4"
        data-cy="openCreateUserModal"
        @click="openUserCreateOrUpdateModal()"
      />
    </h1>

    <BaseInput
      v-model="textSearch"
      data-cy="textSearchInput"
      placeholder="Search..."
      class="text-search-input"
    />

    <UserCardsGrid
      :users="users"
      :has-errors="hasErrors"
      :is-fetching="isFetching"
      :can-fetch-more="canFetchMore"
      @edit-user="openUserCreateOrUpdateModal"
      @delete-user="openUserDeleteModal"
      @fetch-more="fetchMore"
    />
  </div>

  <UserCreateOrUpdateModal
    v-model:isOpen="isUserCreateOrUpdateModalOpen"
    :user="userToEdit"
    @success="createOrUpdateUserLocally"
  />

  <UserDeleteModal
    v-model:isOpen="isUserDeleteModalOpen"
    :user="userToDelete"
    @success="deleteUserLocally"
  />
</template>

<style scoped lang="postcss">
.users-list {
  @apply grid items-center gap-8 grid-cols-1 lg:grid-cols-3;
  h1 {
    @apply leading-none;
  }
  .text-search-input {
    grid-column: -2;
  }
}
</style>
