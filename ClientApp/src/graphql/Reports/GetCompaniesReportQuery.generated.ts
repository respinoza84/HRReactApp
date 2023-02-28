/* eslint-disable */
import * as Types from 'graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCompaniesReportAsyncQueryVariables = Types.Exact<{
  filter: Types.CompanyFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
}>

export type GetCompaniesReportAsyncQuery = {
  __typename?: 'ReportQuery'
  companiesReport?: {
    __typename?: 'CompanyReportCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'CompanyReport'
      companyName?: string | null
      owner?: string | null
      createdDate?: any | null
      contactEmail?: string | null
      contactPhone?: string | null
      modifiedDate?: any | null
      lastActivity?: string | null
      location?: string | null
      taskStatus?: string | null
    }> | null
  } | null
}

export const GetCompaniesReportAsyncDocument = `
    query GetCompaniesReportAsync($filter: CompanyFilterInput!) {
  companiesReport(filter: $filter) {
    items {
      companyName
      owner
      createdDate
      contactEmail
      contactPhone
      modifiedDate
      lastActivity
      location
      taskStatus
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `
export const useGetCompaniesReportAsyncQuery = <TData = GetCompaniesReportAsyncQuery, TError = unknown>(
  variables: GetCompaniesReportAsyncQueryVariables,
  options?: UseQueryOptions<GetCompaniesReportAsyncQuery, TError, TData>
) =>
  useQuery<GetCompaniesReportAsyncQuery, TError, TData>(
    ['GetCompaniesReportAsync', variables],
    fetchData<GetCompaniesReportAsyncQuery, GetCompaniesReportAsyncQueryVariables>(
      GetCompaniesReportAsyncDocument,
      variables
    ),
    options
  )
