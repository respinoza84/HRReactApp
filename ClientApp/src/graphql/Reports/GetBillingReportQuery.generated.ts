/* eslint-disable */
import * as Types from 'graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetBillingReportAsyncQueryVariables = Types.Exact<{
  filter: Types.BillingFilterInput
}>

export type GetBillingReportAsyncQuery = {
  __typename?: 'Query'
  billingReport?: {
    __typename?: 'BillingReportCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'BillingReport'
      invoiceNumber?: string | null
      billingNumber: string
      companyName: string
      jobName: string
      candidate: string
      createdDate?: any | null
      invoiced: boolean
      paid: boolean
      total: number
    }> | null
  } | null
}

export const GetBillingReportAsyncDocument = `
    query GetBillingReportAsync($filter: BillingFilterInput!) {
  billingReport(filter: $filter) {
    items {
      invoiceNumber
      billingNumber
      companyName
      jobName
      candidate
      createdDate
      invoiced
      paid
      total
    }
    totalCount
  }
}
    `
export const useGetBillingReportAsyncQuery = <TData = GetBillingReportAsyncQuery, TError = unknown>(
  variables: GetBillingReportAsyncQueryVariables,
  options?: UseQueryOptions<GetBillingReportAsyncQuery, TError, TData>
) =>
  useQuery<GetBillingReportAsyncQuery, TError, TData>(
    ['GetBillingReportAsync', variables],
    fetchData<GetBillingReportAsyncQuery, GetBillingReportAsyncQueryVariables>(
      GetBillingReportAsyncDocument,
      variables
    ),
    options
  )
