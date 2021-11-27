<template>
  <div class="base-card">
    <slot />
  </div>
</template>

<style scoped lang="postcss">
.base-card {
  @apply bg-white rounded-lg transition hover:shadow-xl
}
</style>
