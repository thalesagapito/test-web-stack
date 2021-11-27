import { ref } from 'vue'
import { set } from '@vueuse/core'
import { createApi } from 'unsplash-js'
import { Random } from 'unsplash-js/dist/methods/photos/types'

const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const unsplash = createApi({ accessKey })

export function useUnsplashRandomImage(query: string) {
  const src = ref<string>()
  const status = ref<'success' | 'loading' | 'error'>('loading')

  unsplash.photos
    .getRandom({ query })
    .then(({ response }) => {
      set(status, 'success')
      set(src, (response as Random).urls.regular)
    })
    .catch(() => set(status, 'error'))

  return { src, status }
}
