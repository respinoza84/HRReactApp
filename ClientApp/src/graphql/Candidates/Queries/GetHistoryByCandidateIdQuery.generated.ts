/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetHistoryByCandidateIdQueryVariables = Types.Exact<{
  candidateId: Types.Scalars['Int']
}>

export type GetHistoryByCandidateIdQuery = {
  __typename?: 'CandidateQuery'
  historyByCandidateId?: {
    __typename?: 'HistoryCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'History'
      id: number
      jobName: string
      workType: string
      companyName: string
      statusAchieved: string
      status: string
      owner: string
      startDate?: any | null
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetHistoryByCandidateIdDocument = `
      query GetHistoryByCandidateId($candidateId: Int!) {
    historyByCandidateId(candidateId: $candidateId) {
      items {
        id
        jobName
        workType
        companyName
        statusAchieved
        status
        owner
        startDate
        startDate
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }`

export const useGetHistoryByCandidateIdQuery = <TData = GetHistoryByCandidateIdQuery, TError = unknown>(
  variables: GetHistoryByCandidateIdQueryVariables,
  options?: UseQueryOptions<GetHistoryByCandidateIdQuery, TError, TData>
) =>
  useQuery<GetHistoryByCandidateIdQuery, TError, TData>(
    ['GetHistoryByCandidateId', variables],
    fetchData<GetHistoryByCandidateIdQuery, GetHistoryByCandidateIdQueryVariables>(
      GetHistoryByCandidateIdDocument,
      variables
    ),
    options
  )
