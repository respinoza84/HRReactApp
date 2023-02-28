/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetInvoiceDetailByNumberAsyncQueryVariables = Types.Exact<{
  invoiceNumber: Types.Scalars['String']
}>

export type GetInvoiceDetailByNumberAsyncQuery = {
  __typename?: 'BillingQuery'
  invoiceDetailByNumber: {
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
      billingNumber?: string | null
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
  }
}

export const GetInvoiceDetailByNumberAsyncDocument = `
    query GetInvoiceDetailByNumberAsync($invoiceNumber: String!) {
  invoiceDetailByNumber(invoiceNumber: $invoiceNumber) {
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
      billingNumber
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
}
    `
export const useGetInvoiceDetailByNumberAsyncQuery = <TData = GetInvoiceDetailByNumberAsyncQuery, TError = unknown>(
  variables: GetInvoiceDetailByNumberAsyncQueryVariables,
  options?: UseQueryOptions<GetInvoiceDetailByNumberAsyncQuery, TError, TData>
) =>
  useQuery<GetInvoiceDetailByNumberAsyncQuery, TError, TData>(
    ['GetInvoiceDetailByNumberAsync', variables],
    fetchData<GetInvoiceDetailByNumberAsyncQuery, GetInvoiceDetailByNumberAsyncQueryVariables>(
      GetInvoiceDetailByNumberAsyncDocument,
      variables
    ),
    options
  )
