<script setup lang="ts">
import { ref } from 'vue'
import { set } from '@vueuse/core'
import { useRouteQueryFilters } from '../composables/useRouteQueryFilters'
import UserCreateModal from '../components/users/UserCreateModal.vue'
import BaseIconButton from '../components/base/BaseIconButton.vue'
import UserCardsGrid from '../components/users/UserCardsGrid.vue'
import BaseInput from '../components/base/BaseInput.vue'

const isUserCreateModalOpen = ref(false)
function openUserCreateModal() {
  set(isUserCreateModalOpen, true)
}

const { textSearch, initialLimit } = useRouteQueryFilters()
</script>

<template>
  <div class="users-list">
    <h1 class="flex items-center">
      Users list
      <BaseIconButton
        icon="create"
        class="mt-2 ml-4"
        @click="openUserCreateModal"
      />
    </h1>
    <BaseInput
      v-model="textSearch"
      placeholder="Search..."
      class="text-search-input"
    />

    <UserCardsGrid
      v-model:initial-limit="initialLimit"
      :text-search="textSearch"
    />
  </div>

  <UserCreateModal
    v-model:isOpen="isUserCreateModalOpen"
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
