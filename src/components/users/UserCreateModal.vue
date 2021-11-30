<script setup lang="ts">
import { ref } from 'vue'
import { useVModel } from '@vueuse/core'
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
  }>(),
  {
    isOpen: false,
  },
)

const writableIsOpen = useVModel(props, 'isOpen')

const userName = ref('')
const userAddress = ref('')
const userDescription = ref('')

function cancel() {
  userName.value = ''
  userAddress.value = ''
  userDescription.value = ''

  writableIsOpen.value = false
}
</script>

<template>
  <BaseModal
    v-model:is-open="writableIsOpen"
    title="Create user"
  >
    <div class="user-create-modal-content">
      inside the modal
      <div class="buttons">
        <BaseButton label="Save" type="primary" />
        <BaseButton label="Cancel" type="secondary" @click="cancel" />
      </div>
    </div>
  </BaseModal>
</template>

<style scoped lang="postcss">
.user-create-modal-content {
  @apply grid grid-cols-1 gap-12 lg:grid-cols-2 p-8;

  .buttons {
    @apply grid grid-cols-2 gap-8 py-2 lg:gap-12;
    grid-column: -2;
  }
}
</style>
