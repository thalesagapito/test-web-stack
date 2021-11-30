<script setup lang="ts">
import { ref } from 'vue'
import { set, useVModel } from '@vueuse/core'
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'
import { deleteUser } from '../../graphql/mutations'
import { User } from '../../composables/queries/useListUsersQuery'
import { GraphQLError, useMutation } from '../../composables/useMutation'
import { DeleteUserMutation, DeleteUserMutationVariables } from '../../API'

const props = withDefaults(
  defineProps<{
    user?: User
    isOpen: boolean
  }>(),
  {
    isOpen: false,
    user: undefined,
  },
)

const emit = defineEmits<{
  (event: 'delete'): void
  (event: 'update:isOpen', value: boolean): void
}>()

const errorMessage = ref<string>()
function onSuccess() {
  emit('delete')
  close()
}
function onError({ message }: GraphQLError) {
  set(errorMessage, 'An error occurred while trying to delete the user')
  // todo log error message here
}

const mutation = deleteUser
const { execute, isExecuting } = useMutation<DeleteUserMutation, DeleteUserMutationVariables>({ mutation, onSuccess, onError })
function executeDelete() {
  execute({ input: { id: props.user.id } })
}

const writableIsOpen = useVModel(props, 'isOpen')
function close() {
  writableIsOpen.value = false
  errorMessage.value = undefined
}
</script>

<template>
  <BaseModal v-model:is-open="writableIsOpen" title="Delete user">
    <div class="user-delete-modal-content">
      <h2>Are you sure you want to delete "{{ user?.name }}"?</h2>

      <div class="buttons">
        <BaseButton
          label="Delete"
          type="primary"
          :loading="isExecuting"
          @click="executeDelete"
        />
        <BaseButton
          label="Cancel"
          :loading="isExecuting"
          type="secondary"
          @click="close"
        />
      </div>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>
  </BaseModal>
</template>

<style scoped lang="postcss">
.user-delete-modal-content {
  @apply flex flex-col p-8 w-full max-w-md;

  .buttons {
    @apply flex justify-between items-center space-x-8 mt-8 w-full;
  }

  .error {
    @apply text-center text-red text-lg mt-8;
  }
}
</style>
