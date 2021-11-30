import { ref } from 'vue'
import { set } from '@vueuse/core'
import { User } from './queries/useListUsersQuery'

export function useUserModals() {
  const userToDelete = ref<User>()
  const isUserDeleteModalOpen = ref(false)
  function openUserDeleteModal(user: User) {
    set(userToDelete, user)
    set(isUserDeleteModalOpen, true)
  }

  const userToEdit = ref<User>()
  const isUserCreateOrEditModalOpen = ref(false)
  function openUserCreateOrEditModal(user?: User) {
    set(userToEdit, user)
    set(isUserCreateOrEditModalOpen, true)
  }

  return {
    userToDelete,
    isUserDeleteModalOpen,
    openUserDeleteModal,

    userToEdit,
    isUserCreateOrEditModalOpen,
    openUserCreateOrEditModal,
  }
}
