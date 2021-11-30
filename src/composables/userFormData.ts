import { ref } from 'vue'

export function useUserFormData() {
  const name = ref('')
  const description = ref('')
  const address = ref('')

  return {
    name,
    description,
    address,
  }
}
