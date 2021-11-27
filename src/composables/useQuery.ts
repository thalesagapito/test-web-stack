import { ref, Ref } from 'vue'
import { set, debouncedWatch } from '@vueuse/core'
import { GraphQLAPI, GraphQLResult } from '@aws-amplify/api-graphql'

export function useQuery<Query, QueryVariables extends object>({
  query,
  watchVariables,
  variables: variablesRef,
  watchVariablesDebounceInMs = 0,
}: {
  query: string
  variables: Ref<QueryVariables>
  watchVariables?: boolean
  watchVariablesDebounceInMs?: number
}) {
  const data = ref<GraphQLResult<Query>['data']>()
  const errors = ref<GraphQLResult<Query>['errors']>()
  const isFetching = ref(false)

  async function runQuery(variables: QueryVariables) {
    set(isFetching, true)
    return GraphQLAPI.graphql({ query, variables }) as GraphQLResult<Query>
  }

  function defaultResponseHandler(response: GraphQLResult<Query>) {
    set(data, response.data)
    set(errors, response.errors)
  }

  async function fetch(variablesOverride?: QueryVariables, responseHandlerOverride?: (response: GraphQLResult<Query>) => void) {
    const variables = variablesOverride ?? variablesRef.value
    const responseHandler = responseHandlerOverride ?? defaultResponseHandler
    try {
      responseHandler(await runQuery(variables))
    }
    catch (error) {
      // todo handle
    }
    finally {
      set(isFetching, false)
    }
  }

  if (watchVariables) {
    debouncedWatch(
      variablesRef,
      variables => fetch(variables),
      { debounce: watchVariablesDebounceInMs },
    )
  }

  return {
    data,
    errors,
    fetch,
    isFetching,
  }
}
