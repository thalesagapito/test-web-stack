import { computed, ref } from 'vue'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import { CreateUserMutation, CreateUserMutationVariables, UpdateUserMutation, UpdateUserMutationVariables } from '../../API'
import { createUser, updateUser } from '../../graphql/mutations'
import { SearchedUser } from '../queries/useSearchUsersQuery'
import { GraphQLError, OptionalRef } from '../../types'
import { useMutation } from '../useMutation'

type CreatedUser = CreateUserMutation['createUser']
type UpdatedUser = UpdateUserMutation['updateUser']
export type CreatedOrUpdatedUser = NonNullable<CreatedUser | UpdatedUser>

type CreateOrUpdateUserMutation = CreateUserMutation | UpdateUserMutation
type CreateOrUpdateUserMutationVariables = CreateUserMutationVariables | UpdateUserMutationVariables

export type Mode = 'create' | 'edit'

type UseUserCreateOrUpdateMutationArgs = {
  user: OptionalRef<SearchedUser>
  onSuccess: (user: CreatedOrUpdatedUser, mode: Mode) => void
  onError: (errorMessage: string) => void
}

export function useUserCreateOrUpdateMutation({ user, ...args }: UseUserCreateOrUpdateMutationArgs) {
  const name = ref('')
  const address = ref('')
  const description = ref('')

  const mode = computed<Mode>(() => user.value ? 'edit' : 'create')

  function onSuccess({ data = {} }: GraphQLResult<CreateOrUpdateUserMutation>) {
    const user = (() => {
      if ('createUser' in data) return data.createUser
      if ('updateUser' in data) return data.updateUser
    })() as CreatedOrUpdatedUser

    args.onSuccess(user, mode.value)
  }

  function onError({ message }: GraphQLError) {
    // todo log error message here
    args.onError(`An error occurred while trying to ${mode.value} the user`)
  }

  const mutation = computed(() => mode.value === 'create' ? createUser : updateUser)
  const { execute, isExecuting } = useMutation<CreateOrUpdateUserMutation, CreateOrUpdateUserMutationVariables>({ mutation, onSuccess, onError })

  const variables = computed<CreateOrUpdateUserMutationVariables>(() => ({
    input: {
      id: user.value?.id,
      name: name.value,
      address: address.value,
      description: description.value,
    },
  }))

  function submit() {
    execute(variables.value)
  }

  return {
    mode,
    name,
    address,
    description,
    submit,
    isExecuting,
  }
}
