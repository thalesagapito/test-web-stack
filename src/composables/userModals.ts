import { ref } from 'vue'
import { set } from '@vueuse/core'
import { User } from './queries/useSearchUsersQuery'

export function useUserModals() {
  const userToDelete = ref<User>()
  const isUserDeleteModalOpen = ref(false)
  function openUserDeleteModal(user: User) {
    set(userToDelete, user)
    set(isUserDeleteModalOpen, true)
  }

  const userToEdit = ref<User>()
  const isUserCreateOrUpdateModalOpen = ref(false)
  function openUserCreateOrUpdateModal(user?: User) {
    set(userToEdit, user)
    set(isUserCreateOrUpdateModalOpen, true)
  }

  return {
    userToDelete,
    isUserDeleteModalOpen,
    openUserDeleteModal,

    userToEdit,
    isUserCreateOrUpdateModalOpen,
    openUserCreateOrUpdateModal,
  }
}
