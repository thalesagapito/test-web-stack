import { set } from '@vueuse/core'
import { ref, Ref, watch } from 'vue'
import { User } from './queries/useSearchUsersQuery'

export function useUserFormData(user: Ref<User | null | undefined>) {
  const name = ref()
  const address = ref()
  const description = ref()

  watch(user, (user) => {
    set(name, user?.name)
    set(address, user?.address)
    set(description, user?.description)
  })

  return {
    name,
    address,
    description,
  }
}
