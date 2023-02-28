/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCurrentCandidatesByCompanyIdQueryVariables = Types.Exact<{
  companyId: Types.Scalars['Int']
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.CandidateSortInput> | Types.CandidateSortInput>
}>

export type GetCurrentCandidatesByCompanyIdQuery = {
  __typename?: 'CandidateQuery'
  currentCandidatesByCompanyId?: {
    __typename?: 'CandidateCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Candidate'
      firstName: string
      lastName: string
      email: string
      jobTitle: string
      jobName: string
      marketing: string
      dateLastContacted: any
      createdDate: any
      department: string
      lastActivity: string
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetCurrentCandidatesByCompanyIdAsyncDocument = `
query GetCurrentCandidatesByCompanyIdAsync(  
  $companyId: Int!
  $skip: Int!
  $take: Int!
  $order: [CandidateSortInput!]){
  currentCandidatesByCompanyId(
    companyId: $companyId
    skip: $skip
    take: $take
    order: $order
  ){
    items{
      firstName
      lastName
      email
      jobTitle
      jobName
      dateLastContacted
      createdDate
      department   
      lastActivity
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}`

export const useGetCandidatesAsyncQuery = <TData = GetCurrentCandidatesByCompanyIdQuery, TError = unknown>(
  variables: GetCurrentCandidatesByCompanyIdQueryVariables,
  options?: UseQueryOptions<GetCurrentCandidatesByCompanyIdQuery, TError, TData>
) =>
  useQuery<GetCurrentCandidatesByCompanyIdQuery, TError, TData>(
    ['GetCurrentCandidatesByCompanyIdAsync', variables],
    fetchData<GetCurrentCandidatesByCompanyIdQuery, GetCurrentCandidatesByCompanyIdQueryVariables>(
      GetCurrentCandidatesByCompanyIdAsyncDocument,
      variables
    ),
    options
  )
