/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetBillingReportSortQueryVariables = Types.Exact<{
  filter: Types.BillingFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.BillingReportSortInput> | Types.BillingReportSortInput>
}>

export type GetBillingReportSortQuery = {
  __typename?: 'Query'
  billingReportSort?: {
    __typename?: 'BillingReportCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'BillingReportSort'
      companyId: string
      invoiceNumber?: string | null
      billingNumber: string
      companyName: string
      jobName: string
      candidate: string
      createdDate?: any | null
      invoiced: boolean
      paid: boolean
      jobType: string
      jobVertical: string
      companyContact: string
      total: number
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetBillingReportSortAsyncDocument = `
    query GetBillingReportSortAsync($filter: BillingFilterInput!, $skip: Int!, $take: Int!, $order: [BillingReportSortInput!]) {  
  billingReportSort(filter: $filter, skip: $skip, take: $take, order: $order){
    items {
      companyId
      invoiceNumber
      billingNumber
      companyName
      jobName
      candidate
      createdDate
      invoiced
      paid
      jobType
      jobVertical
      companyContact
      total
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `
export const useGetBillingReportSortQuery = <TData = GetBillingReportSortQuery, TError = unknown>(
  variables: GetBillingReportSortQueryVariables,
  options?: UseQueryOptions<GetBillingReportSortQuery, TError, TData>
) =>
  useQuery<GetBillingReportSortQuery, TError, TData>(
    ['GetBillingReportSort', variables],
    fetchData<GetBillingReportSortQuery, GetBillingReportSortQueryVariables>(
      GetBillingReportSortAsyncDocument,
      variables
    ),
    options
  )
