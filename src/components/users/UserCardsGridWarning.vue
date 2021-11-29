<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="w-full flex flex-col justify-center items-center text-center text-gray-200 text-xl">
    <div class="text-2xl my-8">
      :(
    </div>
    {{ message }}
  </div>
</template>
