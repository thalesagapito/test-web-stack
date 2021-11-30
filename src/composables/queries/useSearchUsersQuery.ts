import { set } from '@vueuse/core'
import { computed, ref, Ref, watch } from 'vue'
import { SearchUsersQuery, SearchUsersQueryVariables } from '../../API'
import { searchUsers } from '../../graphql/queries'
import { useQuery } from '../useQuery'

type OptionalRef<T> = Ref<T | null | undefined>

export type User = NonNullable<SearchUsersQuery['searchUsers']>['items'][number]
export const DEFAULT_LIMIT = 3

function getVariables(textSearch?: string | null): SearchUsersQueryVariables {
  return {
    filter: textSearch
      ? { name: { wildcard: `*${textSearch}*` } }
      : undefined,
    limit: DEFAULT_LIMIT,
  }
}

export function useSearchUsersQuery(textSearchRef: OptionalRef<string>, initialLimit: OptionalRef<number>) {
  const query = searchUsers

  const variables = ref<SearchUsersQueryVariables>(getVariables(textSearchRef.value))

  const { data, fetch, isFetching, graphQLErrors, hasErrors } = useQuery<SearchUsersQuery, SearchUsersQueryVariables>({
    query,
    variables,
    watchVariables: true,
    watchVariablesDebounceInMs: 400,
  })

  const users = computed(() => {
    const currentUsers = data.value?.searchUsers?.items || []
    const lowerCaseSearch = (textSearchRef.value || '').toLowerCase()
    return currentUsers.filter(({ name }) => name.toLowerCase().includes(lowerCaseSearch))
  })
  const canFetchMore = computed(() => Boolean(data.value?.searchUsers?.nextToken))
  watch(users, users => set(initialLimit, users?.length || DEFAULT_LIMIT))

  watch(textSearchRef, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      set(isFetching, true)
      set(variables, getVariables(newValue))
    }
  })

  function fetchMore() {
    fetch(
      {
        ...variables.value,
        nextToken: data.value?.searchUsers?.nextToken,
      },
      (response) => {
        const previousItems = data.value?.searchUsers?.items || []
        const newItems = response.data?.searchUsers?.items || []
        const items = [...previousItems, ...newItems]
        set(graphQLErrors, response.errors)
        set(data, {
          ...response.data,
          searchUsers: {
            ...response.data!.searchUsers!,
            items,
          },
        })
      },
    )
  }

  return {
    fetch,
    users,
    hasErrors,
    fetchMore,
    isFetching,
    canFetchMore,
  }
}
