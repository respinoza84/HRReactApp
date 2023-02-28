/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetHiringManagersQueryVariables = Types.Exact<{
  skip?: Types.InputMaybe<Types.Scalars['Int']>
  take?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetHiringManagersQuery = {
  __typename?: 'CompanyQuery'
  hiringManagers?: {
    __typename?: 'HiringManagerCollectionSegment'
    totalCount: number
    items?: Array<{__typename?: 'HiringManager'; id: number; hiringManagerName?: string | undefined}> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetHiringManagersDocument = `
    query GetHiringManagers($skip: Int, $take: Int) {
  hiringManagers(skip: $skip, take: $take) {
    items {
      id
      hiringManagerName
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `
export const useGetHiringManagersQuery = <TData = GetHiringManagersQuery, TError = unknown>(
  variables?: GetHiringManagersQueryVariables,
  options?: UseQueryOptions<GetHiringManagersQuery, TError, TData>
) =>
  useQuery<GetHiringManagersQuery, TError, TData>(
    variables === undefined ? ['GetHiringManagers'] : ['GetHiringManagers', variables],
    fetchData<GetHiringManagersQuery, GetHiringManagersQueryVariables>(GetHiringManagersDocument, variables),
    options
  )
