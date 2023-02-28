/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetResumeHistoryByJobIdAsyncQueryVariables = Types.Exact<{
  jobId: Types.Scalars['Int']
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.ResumeHistorySortInput> | Types.ResumeHistorySortInput>
}>

export type GetResumeHistoryByJobIdAsyncQuery = {
  __typename?: 'CandidateQuery'
  resumeHistoryByJobId?: {
    __typename?: 'ResumeHistoryCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'ResumeHistory'
      jobId: number
      jobTittle: string
      jobDescription: string
      companyName: string
      startDate?: any | null
      endDate?: any | null
      salaryRate: string
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetResumeHistoryByJobIdAsyncDocument = `
      query GetResumeHistoryByJobIdAsync($jobId: Int!, $skip: Int!, $take: Int!, $order: [ResumeHistorySortInput!]) {
    resumeHistoryByJobId(jobId: $jobId, skip: $skip, take: $take, order: $order) {
      items {
        jobId
        jobTittle
        jobDescription
        companyName
        startDate
        endDate
        salaryRate
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }`

export const useGetResumeHistoryByJobIdAsyncQuery = <TData = GetResumeHistoryByJobIdAsyncQuery, TError = unknown>(
  variables: GetResumeHistoryByJobIdAsyncQueryVariables,
  options?: UseQueryOptions<GetResumeHistoryByJobIdAsyncQuery, TError, TData>
) =>
  useQuery<GetResumeHistoryByJobIdAsyncQuery, TError, TData>(
    ['GetResumeHistoryByJobIdAsync', variables],
    fetchData<GetResumeHistoryByJobIdAsyncQuery, GetResumeHistoryByJobIdAsyncQueryVariables>(
      GetResumeHistoryByJobIdAsyncDocument,
      variables
    ),
    options
  )
