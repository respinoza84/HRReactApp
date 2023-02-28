/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetBillingItemsByJobAsyncQueryVariables = Types.Exact<{
  filter: Types.BillingItemFilterInput
}>

export type GetBillingItemsByJobAsyncQuery = {
  __typename?: 'BillingQuery'
  billingItemsByJob?: {
    __typename?: 'BillingItemCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'BillingItem'
      id?: number | null
      companyId: number
      adExp: any
      billingNumber?: string | null
      invoiceNumber?: string | null
      costCenter?: string | null
      sharedRiskMonthly: any
      perPerson: any
      directHire: any
      hourly: any
      lineTotal?: any | null
      createdDate?: any | null
      modifiedDate?: any | null
      units: any
      hoursWorked: any
      reqNumber?: string | null
      startDate?: string | null
      description?: string | null
      isDeleted: boolean
      candidateName?: string | null
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetBillingItemsByJobAsyncDocument = `
    query GetBillingItemsByJobAsync($filter: BillingItemFilterInput!) {
  billingItemsByJob(filter: $filter) {
    items {
      id
      companyId
      adExp
      billingNumber
      invoiceNumber
      costCenter
      sharedRiskMonthly
      perPerson
      directHire
      hourly
      lineTotal
      createdDate
      modifiedDate
      units
      hoursWorked
      reqNumber
      startDate
      description
      isDeleted
      candidateName
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `
export const useGetBillingItemsByJobAsyncQuery = <TData = GetBillingItemsByJobAsyncQuery, TError = unknown>(
  variables: GetBillingItemsByJobAsyncQueryVariables,
  options?: UseQueryOptions<GetBillingItemsByJobAsyncQuery, TError, TData>
) =>
  useQuery<GetBillingItemsByJobAsyncQuery, TError, TData>(
    ['GetBillingItemsByJobAsync', variables],
    fetchData<GetBillingItemsByJobAsyncQuery, GetBillingItemsByJobAsyncQueryVariables>(
      GetBillingItemsByJobAsyncDocument,
      variables
    ),
    options
  )
