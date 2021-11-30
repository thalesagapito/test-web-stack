import { Ref } from 'vue'
import { GraphQLResult } from '@aws-amplify/api-graphql'

export type OptionalRef<T> = Ref<T | null | undefined>

export type GraphQLError = NonNullable<GraphQLResult['errors']>[number]
