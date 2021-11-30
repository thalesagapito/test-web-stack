<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { set, useVModel } from '@vueuse/core'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import { CreateUserMutation, CreateUserMutationVariables, UpdateUserMutation, UpdateUserMutationVariables } from '../../API'
import { CreatedOrUpdatedUser, Mode } from '../../composables/mutations/useUserCreateOrUpdateMutation'
import { GraphQLError, useMutation } from '../../composables/useMutation'
import { User } from '../../composables/queries/useSearchUsersQuery'
import { createUser, updateUser } from '../../graphql/mutations'
import { useUserFormData } from '../../composables/userFormData'
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseModal from '../base/BaseModal.vue'

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
  (event: 'submit', user: CreatedOrUpdatedUser, mode: Mode): void
  (event: 'update:isOpen', value: boolean): void
}>()

const user = toRef(props, 'user')
const { name, address, description } = useUserFormData(user)

const mode = computed<Mode>(() => user.value ? 'edit' : 'create')
const title = computed(() => mode.value === 'create' ? 'Create user' : 'Edit user')

const errorMessage = ref<string>()
function onSuccess(result: GraphQLResult) {
  const user = mode.value === 'create'
    ? (result as GraphQLResult<CreateUserMutation>).data?.createUser
    : (result as GraphQLResult<UpdateUserMutation>).data?.updateUser
  emit('submit', user as CreatedOrUpdatedUser, mode.value)
  close()
}
function onError({ message }: GraphQLError) {
  set(errorMessage, `An error occurred while trying to ${mode.value} the user`)
  // todo log error message here
}

const mutation = computed(() => mode.value === 'create' ? createUser : updateUser)
const { execute, isExecuting } = useMutation({ mutation, onSuccess, onError })

function submit() {
  const variables = mode.value === 'edit' && user.value
    ? {
      input: {
        id: user.value.id,
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
  set(writableIsOpen, false)
  set(errorMessage, undefined)
}
</script>

<template>
  <BaseModal v-model:is-open="writableIsOpen" :title="title">
    <div class="user-create-or-update-modal-content">
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
          :disabled="!name || isExecuting"
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
.user-create-or-update-modal-content {
  @apply grid grid-cols-1 gap-12 p-8 w-screen container;

  .form {
    @apply flex flex-col space-y-6;
  }

  .buttons {
    @apply grid grid-cols-2 gap-8 py-2 lg:gap-12;
    grid-column: -2;
  }

  .error {
    @apply col-span-1 lg:col-span-2 text-center text-red text-lg;
  }
}

@screen lg {
  .user-create-or-update-modal-content {
    grid-template-columns: 5fr 6fr;
  }
}
</style>
