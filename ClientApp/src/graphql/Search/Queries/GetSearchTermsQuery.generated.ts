/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetSearchTermsAsyncQueryVariables = Types.Exact<{
  filter: Types.SearchQueryFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.SearchResultSortInput> | Types.SearchResultSortInput>
}>

export type GetSearchTermsAsyncQuery = {
  __typename?: 'SearchQuery'
  searchTerms?: {
    __typename?: 'SearchResultCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'SearchResult'
      id?: number | null
      name?: string | null
      entityType?: string | null
      jobType?: string | null
      jobOwnerShip?: string | null
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetSearchTermsAsyncDocument = `
    query GetSearchTermsAsync($filter: SearchQueryFilterInput!, $skip: Int!, $take: Int!, $order: [SearchResultSortInput!]) {
  searchTerms(filter: $filter, skip: $skip, take: $take, order: $order) {
    items {
      id
      name
      entityType
      jobType
      jobOwnerShip
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `
export const useGetSearchTermsAsyncQuery = <TData = GetSearchTermsAsyncQuery, TError = unknown>(
  variables: GetSearchTermsAsyncQueryVariables,
  options?: UseQueryOptions<GetSearchTermsAsyncQuery, TError, TData>
) =>
  useQuery<GetSearchTermsAsyncQuery, TError, TData>(
    ['GetSearchTermsAsync', variables],
    fetchData<GetSearchTermsAsyncQuery, GetSearchTermsAsyncQueryVariables>(GetSearchTermsAsyncDocument, variables),
    options
  )
