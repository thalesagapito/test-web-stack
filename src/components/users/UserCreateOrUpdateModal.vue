<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
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

const user = toRef(props, 'user')
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

const title = computed(() => mode.value === 'create' ? 'Create user' : 'Edit user')
const writableIsOpen = useVModel(props, 'isOpen')
function close() {
  set(writableIsOpen, false)
  set(errorMessage, undefined)
}

const { getUserLocationFromIP, userLocationFromIP } = useLocationFromIP()
watch(userLocationFromIP, (location) => {
  if (location && mode.value === 'create' && !address.value) set(address, location)
})

getUserLocationFromIP()

const mapElementRef = templateRef<HTMLElement>('map')
const { initMap, destroyMap } = useGoogleMaps(mapElementRef, address)

watch(
  writableIsOpen,
  (isOpen) => {
    if (isOpen) initMap()
    else destroyMap()

    if (isOpen && mode.value === 'create')
      set(address, userLocationFromIP.value)
  },
  { flush: 'post' },
)
</script>

<template>
  <BaseModal v-model:is-open="writableIsOpen" :title="title">
    <div class="user-create-or-update-modal-content">
      <div ref="map" class="map" />

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

  .map, &:deep(.gm-err-content) {
    @apply w-full h-full flex flex-col justify-center items-center;
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
