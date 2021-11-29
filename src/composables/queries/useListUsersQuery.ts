import { set } from '@vueuse/core'
import { computed, Ref } from 'vue'
import { ListUsersQuery, ListUsersQueryVariables } from '../../API'
import { listUsers } from '../../graphql/queries'
import { useQuery } from '../useQuery'

export function useListUsersQuery(textSearchRef: Ref<string>) {
  const query = listUsers
  const variables = computed<ListUsersQueryVariables>(() => ({
    filter: textSearchRef.value
      ? { name: { contains: textSearchRef.value } }
      : null,
    limit: 3,
  }))

  const { data, fetch, isFetching, graphQLErrors, hasErrors } = useQuery<ListUsersQuery, ListUsersQueryVariables>({
    query,
    variables,
    watchVariables: true,
    watchVariablesDebounceInMs: 200,
  })

  const users = computed(() => data.value?.listUsers?.items)
  const canFetchMore = computed(() => !!data.value?.listUsers?.nextToken)

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
            ...data.value!.listUsers!,
            ...response.data?.listUsers,
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
