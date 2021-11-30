
import { computed } from 'vue'
import { RestAPI } from '@aws-amplify/api-rest'
import { set, useStorage } from '@vueuse/core'

type UserLocation = {
  city: string
  region: string
}

export function useLocationFromIP() {
  const userInfoFromIP = useStorage('userInfoFromIP', {} as UserLocation | null)

  const userLocationFromIP = computed(() => {
    const { region, city } = userInfoFromIP.value || {}
    return [region, city].join(', ')
  })

  async function getUserLocationFromIP() {
    if (userInfoFromIP.value) return
    const response = await RestAPI.get('location', '/location', {})
    set(userInfoFromIP, response)
  }

  return {
    userLocationFromIP,
    getUserLocationFromIP,
  }
}
