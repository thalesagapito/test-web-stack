<script setup lang="ts">
import UsersList from './components/users/UsersList.vue'
</script>

<template>
  <Suspense>
    <UsersList />
    <template #fallback>
      loading...
    </template>
  </Suspense>
</template>
