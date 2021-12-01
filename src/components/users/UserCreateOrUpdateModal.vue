<script setup lang="ts">
import { computed, ref, toRef, watch, Ref } from 'vue'
import { set, templateRef, useVModel } from '@vueuse/core'
import BaseModal from '../base/BaseModal.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import { useGoogleMaps } from '../../composables/external/googleMaps'
import { useLocationFromIP } from '../../composables/useLocationFromIP'
import { SearchedUser } from '../../composables/queries/useSearchUsersQuery'
import { Mode, CreatedOrUpdatedUser, useUserCreateOrUpdateMutation } from '../../composables/mutations/useUserCreateOrUpdateMutation'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    user?: SearchedUser
  }>(),
  {
    isOpen: false,
    user: undefined,
  },
)

const emit = defineEmits<{
  (event: 'success', user: CreatedOrUpdatedUser, mode: Mode): void
  (event: 'update:isOpen', value: boolean): void
}>()

const user = toRef(props, 'user') as Ref<SearchedUser | undefined>
const errorMessage = ref<string>()

const {
  mode,
  name,
  address,
  description,
  submit,
  isExecuting,
} = useUserCreateOrUpdateMutation({
  user,
  onSuccess(user, mode) {
    emit('success', user, mode)
    close()
  },
  onError(message) {
    set(errorMessage, message)
  },
})

function setModalFieldsValues(args: { name?: string | null; address?: string | null; description?: string | null }) {
  set(name, args.name)
  set(address, args.address)
  set(description, args.description)
}

const title = computed(() => mode.value === 'create' ? 'Create user' : 'Edit user')
const writableIsOpen = useVModel(props, 'isOpen')
function close() {
  set(writableIsOpen, false)
}

const { getUserLocationFromIP, userLocationFromIP } = useLocationFromIP()
getUserLocationFromIP()

const mapElementRef = templateRef<HTMLElement>('map')
const { initMap, destroyMap } = useGoogleMaps(mapElementRef, address)

watch(
  writableIsOpen,
  (isOpen) => {
    if (isOpen) initMap()
    else destroyMap()

    if (isOpen) {
      const address = mode.value === 'create' ? userLocationFromIP.value : user.value?.address
      setModalFieldsValues({
        address,
        name: user.value?.name,
        description: user.value?.description,
      })
    }
    else {
      setModalFieldsValues({
        address: undefined,
        name: undefined,
        description: undefined,
      })
      set(errorMessage, undefined)
    }
  },
  { flush: 'post' },
)

// click create
// set user as undefined
// watch isOpen, copy user
</script>

<template>
  <BaseModal v-model:is-open="writableIsOpen" :title="title">
    <div class="user-create-or-update-modal-content" data-cy="createOrUpdateUserModal">
      <div ref="map" class="map" />

      <div class="form">
        <BaseInput v-model="name" label="Name" data-cy="nameInput" />
        <BaseInput v-model="address" label="Address" data-cy="addressInput" />
        <BaseInput v-model="description" label="Description" data-cy="descriptionInput" />
      </div>

      <div class="buttons">
        <BaseButton
          label="Save"
          type="primary"
          data-cy="submitCreateOrUpdateUser"
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

  .map, &:deep(.gm-err-content) {
    @apply w-full h-full flex flex-col justify-center items-center;
    min-height: 12rem;
  }

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
