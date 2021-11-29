<script setup lang="ts">
import { ref } from 'vue'
import { set } from '@vueuse/core'
import BaseInput from './components/base/BaseInput.vue'
import UserCardsGrid from './components/users/UserCardsGrid.vue'
import BaseIconButton from './components/base/BaseIconButton.vue'
import UserCreateModal from './components/users/UserCreateModal.vue'

const textSearch = ref()

const isUserCreateModalOpen = ref(false)
function openUserCreateModal() {
  set(isUserCreateModalOpen, true)
}
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

    <UserCardsGrid :text-search="textSearch" />
  </div>

  <UserCreateModal
    v-model:isOpen="isUserCreateModalOpen"
  />
</template>

<style lang="postcss">
#app {
  @apply antialiased flex flex-col container p-8 space-y-6;
}
</style>

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
