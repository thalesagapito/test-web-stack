import { ref, Ref } from 'vue'
import { set, debouncedWatch } from '@vueuse/core'
import { GraphQLError } from 'graphql/error/GraphQLError'
import { GraphQLAPI, GraphQLResult } from '@aws-amplify/api-graphql'

export function useQuery<Query, QueryVariables extends object>({
  query,
  variables,
  watchVariables,
  watchVariablesDebounceInMs = 0,
}: {
  query: string
  variables: Ref<QueryVariables>
  watchVariables?: boolean
  watchVariablesDebounceInMs?: number
}) {
  const data = ref<Query>()
  const errors = ref<GraphQLError[]>()
  const isFetching = ref(false)

  const execute = async() => {
    set(isFetching, true)
    try {
      const response = await GraphQLAPI.graphql({ query, variables }) as GraphQLResult<Query>
      set(data, response.data)
      set(errors, response.errors)
    }
    catch (error) {
      // todo handle
    }
    set(isFetching, false)
  }

  if (watchVariables)
    debouncedWatch(variables, execute, { debounce: watchVariablesDebounceInMs })

  return {
    data,
    errors,
    execute,
    isFetching,
  }
}
