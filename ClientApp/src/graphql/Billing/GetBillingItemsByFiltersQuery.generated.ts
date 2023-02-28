/*
  @author Oliver Zamora
*/

/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetBillingItemsByFiltersAsyncQueryVariables = Types.Exact<{
  filter: Types.BillingItemFilterInput
}>

export type GetBillingItemsByFiltersAsyncQuery = {
  __typename?: 'BillingQuery'
  billingItemsByFilters?: {
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
      supervisor?: string | null
    }> | null
  } | null
}

export const GetBillingItemsByFiltersAsyncDocument = `
    query GetBillingItemsByFiltersAsync($filter: BillingItemFilterInput!) {
  billingItemsByFilters(filter: $filter) {
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
      supervisor
    }
    totalCount
  }
}
    `
export const useGetBillingItemsByFiltersAsyncQuery = <TData = GetBillingItemsByFiltersAsyncQuery, TError = unknown>(
  variables: GetBillingItemsByFiltersAsyncQueryVariables,
  options?: UseQueryOptions<GetBillingItemsByFiltersAsyncQuery, TError, TData>
) =>
  useQuery<GetBillingItemsByFiltersAsyncQuery, TError, TData>(
    ['GetBillingItemsByFiltersAsync', variables],
    fetchData<GetBillingItemsByFiltersAsyncQuery, GetBillingItemsByFiltersAsyncQueryVariables>(
      GetBillingItemsByFiltersAsyncDocument,
      variables
    ),
    options
  )
