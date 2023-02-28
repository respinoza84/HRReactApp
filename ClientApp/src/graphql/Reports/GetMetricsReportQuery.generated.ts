/* eslint-disable */
import * as Types from 'graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetMetricsReportAsyncQueryVariables = Types.Exact<{
  filter: Types.MetricsFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
}>

export type GetMetricsReportAsyncQuery = {
  __typename?: 'Query'
  metricsReport?: {
    __typename?: 'MetricsReportCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'MetricsReport'
      candidateName?: string | null
      candidateSource?: string | null
      jobName?: string | null 
      stage?: string | null
      applicationDate?: any | null
      preScreenDate?: any | null
      gapPreScreenDays?: number | null
      managerRepliesDate?: any | null
      gapManagerRepliesDays?: number | null
      hirevueInterviewDate?: any | null
      gapHirevueInterviewDays?: number | null
      offerDate?: any | null
      offerStatus?: string | null
      gapOfferDays?: number | null
      hireDate?: any | null
      gapHireDays?: number | null
      timeFill?: number | null
      timeStart?: number | null
      nonSelectionReason?: string | null
      notes?: string | null
    }> | null
  } | null
}

export const GetMetricsReportAsyncDocument = `
    query GetMetricsReportAsync($filter: MetricsFilterInput!) {
  metricsReport(filter: $filter) {
    items {
      candidateName
      candidateSource
      jobName
      stage
      applicationDate
      preScreenDate
      gapPreScreenDays
      managerRepliesDate
      gapManagerRepliesDays
      hirevueInterviewDate
      gapHirevueInterviewDays
      offerDate
      offerStatus
      gapOfferDays
      hireDate
      gapHireDays
      timeFill
      timeStart
      nonSelectionReason
      notes
    }
    totalCount
  }
}
    `
export const useGetMetricsReportAsyncQuery = <TData = GetMetricsReportAsyncQuery, TError = unknown>(
  variables: GetMetricsReportAsyncQueryVariables,
  options?: UseQueryOptions<GetMetricsReportAsyncQuery, TError, TData>
) =>
  useQuery<GetMetricsReportAsyncQuery, TError, TData>(
    ['GetMetricsReportAsync', variables],
    fetchData<GetMetricsReportAsyncQuery, GetMetricsReportAsyncQueryVariables>(
      GetMetricsReportAsyncDocument,
      variables
    ),
    options
  )
