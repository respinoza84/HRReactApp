/* eslint-disable */
import * as Types from 'graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetApplicantsReportAsyncQueryVariables = Types.Exact<{
  filter: Types.CandidateFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
}>

export type GetApplicantsReportAsyncQuery = {
  __typename?: 'ReportQuery'
  applicantsReport?: {
    __typename?: 'ApplicantReportCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'ApplicantReport'
      jobName?: string | null
      companyName?: string | null
      state?: string | null
      startDate?: any | null
      endDate?: any | null
      fullName?: string | null
      contactEmail?: string | null
      contactName?: string | null
      lastActivity?: any | null
      modifiedDate: string | null
    }> | null
  } | null
}

export const GetApplicantsReportAsyncDocument = `
    query GetApplicantsReportAsync($filter: CandidateFilterInput!) {
  applicantsReport(filter: $filter) {
    items {
      jobName
      companyName
      state
      startDate
      endDate
      fullName
      contactEmail
      contactName
      lastActivity
      modifiedDate
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `
export const useGetApplicantsReportAsyncQuery = <TData = GetApplicantsReportAsyncQuery, TError = unknown>(
  variables: GetApplicantsReportAsyncQueryVariables,
  options?: UseQueryOptions<GetApplicantsReportAsyncQuery, TError, TData>
) =>
  useQuery<GetApplicantsReportAsyncQuery, TError, TData>(
    ['GetApplicantsReportAsync', variables],
    fetchData<GetApplicantsReportAsyncQuery, GetApplicantsReportAsyncQueryVariables>(
      GetApplicantsReportAsyncDocument,
      variables
    ),
    options
  )
