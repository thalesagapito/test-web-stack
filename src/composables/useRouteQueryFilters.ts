
import { computed } from 'vue'
import { set } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'

function maybeArrayToString(value: string | string[] | null) {
  return [value].flat()[0]
}

function maybeArrayToNumber(value: string | string[] | null) {
  const firstQueryValue = [value].flat()[0] || ''
  return Number.parseInt(firstQueryValue, 10) || null
}

export function useRouteQueryFilters() {
  const maybeArrayTextSearch = useRouteQuery('text-search')
  const textSearch = computed({
    get: () => maybeArrayToString(maybeArrayTextSearch.value),
    set: value => set(maybeArrayTextSearch, value),
  })

  const maybeArrayInitialLimit = useRouteQuery('initial-limit')
  const initialLimit = computed({
    get: () => maybeArrayToNumber(maybeArrayInitialLimit.value),
    set: value => set(maybeArrayInitialLimit, value?.toString()),
  })

  return {
    textSearch,
    initialLimit,
  }
}
