/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetInvoicesByFiltersQueryVariables = Types.Exact<{
  filter: Types.BillingFilterInput
}>

export type GetInvoicesByFiltersQuery = {
  __typename?: 'Query'
  invoicesByFilters?: {
    __typename?: 'InvoiceCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Invoice'
      id?: number | null
      companyId: number
      subTotal?: any | null
      salesTax?: any | null
      total?: any | null
      isPaid: boolean
      invoiced: boolean
      paymentdDate: any
      discount: boolean
      accountManager?: string | null
      invoiceNumber?: string | null
      invoiceStatus?: string | null
      terms?: string | null
      startDate: any
      paymentTerms?: string | null
      createdDate: any
      modifiedDate: any
      items: Array<{
        __typename?: 'BillingItem'
        id?: number | null
        supervisor?: string | null
        costCenter?: string | null
        sharedRiskMonthly: any
        perPerson: any
        directHire: any
        hourly: any
        lineTotal?: any | null
        createdDate?: any | null
        modifiedDate?: any | null
        invoiceNumber?: string | null
        companyId: number
        units: any
        hoursWorked: any
        adExp: any
        reqNumber?: string | null
        startDate?: string | null
        description?: string | null
      }>
    }> | null
  } | null
}

export const GetInvoicesByFiltersDocument = `
    query GetInvoicesByFilters($filter: BillingFilterInput!) {
  invoicesByFilters(filter: $filter) {
    items {
      id
      companyId
      subTotal
      salesTax
      total
      isPaid
      invoiced
      paymentdDate
      discount
      accountManager
      invoiceNumber
      invoiceStatus
      terms
      startDate
      paymentTerms
      createdDate
      modifiedDate
      items {
        id
        supervisor
        costCenter
        sharedRiskMonthly
        perPerson
        directHire
        hourly
        lineTotal
        createdDate
        modifiedDate
        invoiceNumber
        companyId
        units
        hoursWorked
        adExp
        reqNumber
        startDate
        description
      }
    }
    totalCount
  }
}
    `
export const useGetInvoicesByFiltersQuery = <TData = GetInvoicesByFiltersQuery, TError = unknown>(
  variables: GetInvoicesByFiltersQueryVariables,
  options?: UseQueryOptions<GetInvoicesByFiltersQuery, TError, TData>
) =>
  useQuery<GetInvoicesByFiltersQuery, TError, TData>(
    ['GetInvoicesByFilters', variables],
    fetchData<GetInvoicesByFiltersQuery, GetInvoicesByFiltersQueryVariables>(GetInvoicesByFiltersDocument, variables),
    options
  )
