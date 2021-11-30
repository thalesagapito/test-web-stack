<script setup lang="ts">
import { computed, ref } from 'vue'
import { set, useVModel } from '@vueuse/core'
import BaseModal from '../base/BaseModal.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import { createUser, updateUser } from '../../graphql/mutations'
import { useUserFormData } from '../../composables/userFormData'
import { User } from '../../composables/queries/useSearchUsersQuery'
import { GraphQLError, useMutation } from '../../composables/useMutation'
import { CreateUserMutationVariables, UpdateUserMutationVariables } from '../../API'

type Mode = 'create' | 'edit'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    user?: User
  }>(),
  {
    isOpen: false,
    user: undefined,
  },
)

const emit = defineEmits<{
  (event: 'submit'): void
  (event: 'update:isOpen', value: boolean): void
}>()

const mode = computed<Mode>(() => props.user ? 'edit' : 'create')

const { name, address, description } = useUserFormData()

const errorMessage = ref<string>()
function onSuccess() {
  emit('submit')
  close()
}
function onError({ message }: GraphQLError) {
  set(errorMessage, `An error occurred while trying to ${mode.value} the user`)
  // todo log error message here
}

const mutation = mode.value === 'create' ? createUser : updateUser
const { execute, isExecuting } = useMutation({ mutation, onSuccess, onError })

function submit() {
  const variables = mode.value === 'edit' && props.user
    ? {
      input: {
        id: props.user?.id,
        name: name.value,
        address: address.value,
        description: description.value,
      },
    } as UpdateUserMutationVariables
    : {
      input: {
        name: name.value,
        address: address.value,
        description: description.value,
      },
    } as CreateUserMutationVariables

  execute(variables)
}

const writableIsOpen = useVModel(props, 'isOpen')
function close() {
  set(name, '')
  set(address, '')
  set(description, '')
  set(writableIsOpen, false)
  set(errorMessage, undefined)
}
</script>

<template>
  <BaseModal v-model:is-open="writableIsOpen" title="Create user">
    <div class="user-create-modal-content">
      <div class="map">
        teste map
      </div>

      <div class="form">
        <BaseInput v-model="name" label="Name" />
        <BaseInput v-model="address" label="Address" />
        <BaseInput v-model="description" label="Description" />
      </div>

      <div class="buttons">
        <BaseButton
          label="Save"
          type="primary"
          :loading="isExecuting"
          @click="submit"
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
.user-create-modal-content {
  @apply grid grid-cols-1 gap-12 p-8 w-screen container;

  .form {
    @apply flex flex-col space-y-6;
  }

  .buttons {
    @apply grid grid-cols-2 gap-8 py-2 lg:gap-12;
    grid-column: -2;
  }

  .error {
    @apply col-span-1 lg:col-span-2 text-center text-red text-lg mt-8;
  }
}

@screen lg {
  .user-create-modal-content {
    grid-template-columns: 5fr 6fr;
  }
}
</style>
