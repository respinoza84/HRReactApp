/* eslint-disable */
import * as Types from 'graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetJobsReportAsyncQueryVariables = Types.Exact<{
  filter: Types.JobFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
}>

export type GetJobsReportAsyncQuery = {
  __typename?: 'ReportQuery'
  jobsReport?: {
    __typename?: 'JobReportCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'JobReport'
      companyName?: string | null
      jobName?: string | null
      jobId?: number | null
      contactName?: string | null
      fullName?: string | null
      candidateId?: number | null
      modifiedDate?: any | null
      lastActivity?: string | null
    }> | null
  } | null
}

export const GetJobsReportAsyncDocument = `
    query GetJobsReportAsync($filter: JobFilterInput!) {
  jobsReport(filter: $filter) {
    items {
      companyName
      jobName
      jobId
      contactName
      fullName
      candidateId
      modifiedDate
      lastActivity
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `
export const useGetJobsReportAsyncQuery = <TData = GetJobsReportAsyncQuery, TError = unknown>(
  variables: GetJobsReportAsyncQueryVariables,
  options?: UseQueryOptions<GetJobsReportAsyncQuery, TError, TData>
) =>
  useQuery<GetJobsReportAsyncQuery, TError, TData>(
    ['GetJobsReportAsync', variables],
    fetchData<GetJobsReportAsyncQuery, GetJobsReportAsyncQueryVariables>(GetJobsReportAsyncDocument, variables),
    options
  )
