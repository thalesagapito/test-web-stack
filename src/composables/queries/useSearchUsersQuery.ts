import { set } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { CreatedOrUpdatedUser, Mode } from '../mutations/useUserCreateOrUpdateMutation'
import { SearchUsersQuery, SearchUsersQueryVariables } from '../../API'
import { searchUsers } from '../../graphql/queries'
import { OptionalRef } from '../../types'
import { useQuery } from '../useQuery'

export type SearchedUser = NonNullable<SearchUsersQuery['searchUsers']>['items'][number]
export const DEFAULT_LIMIT = 6

function getVariables(textSearch?: string | null, limit?: number | null): SearchUsersQueryVariables {
  return {
    filter: textSearch
      ? { name: { wildcard: `*${textSearch}*` } }
      : undefined,
    limit: limit || DEFAULT_LIMIT,
  }
}

function deleteUserInArray(items: SearchedUser[], deletedUser: SearchedUser) {
  return items.filter(({ id }) => id !== deletedUser.id) || []
}
function replaceUserInArray(items: SearchedUser[], updatedUser: CreatedOrUpdatedUser) {
  return items.map(user => user.id === updatedUser.id ? updatedUser : user)
}

export function useSearchUsersQuery(textSearchRef: OptionalRef<string>, limitRef: OptionalRef<number>) {
  const query = searchUsers

  const variables = ref<SearchUsersQueryVariables>(getVariables(textSearchRef.value, limitRef.value))

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
  watch(users, users => set(limitRef, users?.length || DEFAULT_LIMIT))

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

  function deleteUserLocally(user: SearchedUser) {
    const currentUsers = data.value?.searchUsers?.items || []
    const items = deleteUserInArray(currentUsers, user)
    set(data, {
      searchUsers: {
        ...data.value?.searchUsers,
        __typename: 'SearchableUserConnection',
        aggregateItems: data.value?.searchUsers?.aggregateItems || [],
        items,
      },
    })
  }

  function createOrUpdateUserLocally(userToCreateOrUpdate: CreatedOrUpdatedUser, mode: Mode) {
    const currentUsers = data.value?.searchUsers?.items || []
    const items = mode === 'create'
      ? [userToCreateOrUpdate, ...currentUsers]
      : replaceUserInArray(currentUsers, userToCreateOrUpdate)

    set(data, {
      searchUsers: {
        ...data.value?.searchUsers,
        __typename: 'SearchableUserConnection',
        aggregateItems: data.value?.searchUsers?.aggregateItems || [],
        items,
      },
    })
  }

  return {
    fetch,
    users,
    hasErrors,
    fetchMore,
    isFetching,
    canFetchMore,
    deleteUserLocally,
    createOrUpdateUserLocally,
  }
}
