<script setup lang="ts">
import { API } from 'aws-amplify'
import { listUsers } from '../graphql/queries'

const users = await API.graphql({ query: listUsers })
</script>

<template>
  <pre>
    {{ users }}
  </pre>
</template>

<style scoped lang="postcss">
</style>
