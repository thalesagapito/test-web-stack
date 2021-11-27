<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from './components/base/BaseInput.vue'
import UserCardsGrid from './components/users/UserCardsGrid.vue'

const textSearch = ref()
</script>

<template>
  <div class="users-list">
    <h1>Users list</h1>
    <BaseInput
      v-model="textSearch"
      placeholder="Search..."
      class="text-search-input"
    />

    <UserCardsGrid :text-search="textSearch" />
  </div>
</template>

<style lang="postcss">
#app {
  @apply antialiased flex flex-col container p-8 space-y-6;
}
</style>

<style scoped lang="postcss">
.users-list {
  @apply grid items-center gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4;
  h1 {
    @apply leading-none;
  }
  .text-search-input {
    grid-column: -2;
  }
}
</style>
