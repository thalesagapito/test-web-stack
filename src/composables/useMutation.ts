import { ref } from 'vue'
import { get, set, MaybeRef } from '@vueuse/core'
import { GraphQLAPI, GraphQLResult } from '@aws-amplify/api-graphql'
import { GraphQLError } from '../types'

type UseMutationArgs = {
  mutation: MaybeRef<string>
  onError: (error: GraphQLError) => void
  onSuccess: (result: GraphQLResult) => void
}

export function useMutation<Mutation extends object, MutationVariables extends object>(args: UseMutationArgs) {
  const { mutation, onError, onSuccess } = args
  const isExecuting = ref(false)

  function handleResult(result: GraphQLResult<Mutation>) {
    const error = result.errors ? result.errors[0] : undefined
    error ? onError(error) : onSuccess(result)
  }

  async function execute(variables: MutationVariables) {
    set(isExecuting, true)
    const result = GraphQLAPI.graphql({ query: get(mutation), variables }) as Promise<GraphQLResult<Mutation>>
    await result.then(handleResult).catch(handleResult)
    set(isExecuting, false)
  }

  return {
    execute,
    isExecuting,
  }
}
