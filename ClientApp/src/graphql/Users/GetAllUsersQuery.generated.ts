/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetAllUsersAsyncQueryVariables = Types.Exact<{
  filter: Types.UserFilterInput
}>

export type GetAllUsersAsyncQuery = {
  __typename?: 'UserQuery'
  allUsers?: {
    __typename?: 'UserCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'User'
      id?: number | null
      userName?: string | null
      firstName?: string | null
      lastName?: string | null
      email?: string | null
      roles?: Array<number> | null
      displayRoles?: Array<string>
      passwordReset?: boolean
      isAccountClosed?: boolean
    }> | null
  } | null
}

export const GetAllUsersAsyncDocument = `
    query GetAllUsersAsync($filter: UserFilterInput!) {
  allUsers(filter: $filter) {
    items {
      id
      firstName
      lastName
      userName
      email
      roles
      isAccountClosed
    }
    totalCount
  }
}
    `
export const useGetAllUsersAsyncQuery = <TData = GetAllUsersAsyncQuery, TError = unknown>(
  variables: GetAllUsersAsyncQueryVariables,
  options?: UseQueryOptions<GetAllUsersAsyncQuery, TError, TData>
) =>
  useQuery<GetAllUsersAsyncQuery, TError, TData>(
    ['GetAllUsersAsync', variables],
    fetchData<GetAllUsersAsyncQuery, GetAllUsersAsyncQueryVariables>(GetAllUsersAsyncDocument, variables),
    options
  )
