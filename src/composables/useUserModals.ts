import { ref } from 'vue'
import { set } from '@vueuse/core'
import { SearchedUser } from './queries/useSearchUsersQuery'

export function useUserModals() {
  const userToDelete = ref<SearchedUser>()
  const isUserDeleteModalOpen = ref(false)
  function openUserDeleteModal(user: SearchedUser) {
    set(userToDelete, user)
    set(isUserDeleteModalOpen, true)
  }

  const userToEdit = ref<SearchedUser>()
  const isUserCreateOrUpdateModalOpen = ref(false)
  function openUserCreateOrUpdateModal(user?: SearchedUser) {
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
