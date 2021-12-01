<script setup lang="ts">
import { ref } from 'vue'
import { set, useVModel } from '@vueuse/core'
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'
import { deleteUser } from '../../graphql/mutations'
import { useMutation } from '../../composables/useMutation'
import { SearchedUser } from '../../composables/queries/useSearchUsersQuery'
import { DeleteUserMutation, DeleteUserMutationVariables } from '../../API'

const props = withDefaults(
  defineProps<{
    user?: SearchedUser
    isOpen: boolean
  }>(),
  {
    isOpen: false,
    user: undefined,
  },
)

const emit = defineEmits<{
  (event: 'success', deletedUser: SearchedUser): void
  (event: 'update:isOpen', value: boolean): void
}>()

const errorMessage = ref<string>()
function onSuccess() {
  emit('success', props.user)
  close()
}
function onError() {
  set(errorMessage, 'An error occurred while trying to delete the user')
}

const mutation = deleteUser
const { execute, isExecuting } = useMutation<DeleteUserMutation, DeleteUserMutationVariables>({ mutation, onSuccess, onError })
function submit() {
  execute({ input: { id: props.user.id } })
}

const writableIsOpen = useVModel(props, 'isOpen')
function close() {
  set(writableIsOpen, false)
  set(errorMessage, undefined)
}
</script>

<template>
  <BaseModal v-model:is-open="writableIsOpen" title="Delete user">
    <div class="user-delete-modal-content" data-cy="deleteUserModal">
      <h2>Are you sure you want to delete "{{ user?.name }}"?</h2>

      <div class="buttons">
        <BaseButton
          label="Delete"
          type="primary"
          data-cy="submitDeleteUser"
          :disabled="isExecuting"
          :loading="isExecuting"
          @click="submit"
        />
        <BaseButton
          label="Cancel"
          :disabled="isExecuting"
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
