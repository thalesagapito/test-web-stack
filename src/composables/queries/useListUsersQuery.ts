import { set } from '@vueuse/core'
import { computed, Ref, watch } from 'vue'
import { ListUsersQuery, ListUsersQueryVariables } from '../../API'
import { listUsers } from '../../graphql/queries'
import { useQuery } from '../useQuery'

type OptionalRef<T> = Ref<T | null | undefined>

export type User = NonNullable<ListUsersQuery['listUsers']>['items'][number]
export const DEFAULT_LIMIT = 3

export function useListUsersQuery(textSearchRef: OptionalRef<string>, initialLimit: OptionalRef<number>) {
  const query = listUsers
  const variables = computed<ListUsersQueryVariables>(() => ({
    filter: textSearchRef.value
      ? { name: { contains: textSearchRef.value } }
      : null,
    limit: DEFAULT_LIMIT,
  }))

  const { data, fetch, isFetching, graphQLErrors, hasErrors } = useQuery<ListUsersQuery, ListUsersQueryVariables>({
    query,
    variables,
    watchVariables: true,
    watchVariablesDebounceInMs: 200,
  })

  const users = computed(() => data.value?.listUsers?.items)
  const canFetchMore = computed(() => !!data.value?.listUsers?.nextToken)
  watch(users, users => set(initialLimit, Math.max(DEFAULT_LIMIT, users?.length || 0)))

  function fetchMore() {
    fetch(
      {
        ...variables.value,
        nextToken: data.value?.listUsers?.nextToken,
      },
      (response) => {
        const previousItems = data.value?.listUsers?.items || []
        const newItems = response.data?.listUsers?.items || []
        const items = [...previousItems, ...newItems]
        set(graphQLErrors, response.errors)
        set(data, {
          ...response.data,
          listUsers: {
            ...response.data!.listUsers!,
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
