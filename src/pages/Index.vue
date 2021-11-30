<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'
import { useUserModals } from '../composables/userModals'
import UserCardsGrid from '../components/users/UserCardsGrid.vue'
import BaseIconButton from '../components/base/BaseIconButton.vue'
import UserDeleteModal from '../components/users/UserDeleteModal.vue'
import { useRouteQueryFilters } from '../composables/useRouteQueryFilters'
import { useSearchUsersQuery } from '../composables/queries/useSearchUsersQuery'
import UserCreateOrEditModal from '../components/users/UserCreateOrEditModal.vue'

const { textSearch, limit } = useRouteQueryFilters()
fetch()

const {
  userToDelete,
  isUserDeleteModalOpen,
  openUserDeleteModal,

  userToEdit,
  isUserCreateOrEditModalOpen,
  openUserCreateOrEditModal,
} = useUserModals()

</script>

<template>
  <div class="users-list">
    <h1 class="flex items-center">
      Users list
      <BaseIconButton
        icon="create"
        class="mt-2 ml-4"
        @click="openUserCreateOrEditModal"
      />
    </h1>

    <BaseInput
      v-model="textSearch"
      placeholder="Search..."
      class="text-search-input"
    />

    <UserCardsGrid
      :users="users"
      :has-errors="hasErrors"
      :is-fetching="isFetching"
      :can-fetch-more="canFetchMore"
      @edit-user="openUserCreateOrEditModal"
      @delete-user="openUserDeleteModal"
      @fetch-more="fetchMore"
    />
  </div>

  <UserCreateOrEditModal
    v-model:isOpen="isUserCreateOrEditModalOpen"
    :user="userToEdit"
    @submit="fetch"
  />

  <UserDeleteModal
    v-model:isOpen="isUserDeleteModalOpen"
    :user="userToDelete"
    @submit="fetch"
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
