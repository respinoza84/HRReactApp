/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetBillingItemDetailByIdAsyncQueryVariables = Types.Exact<{
  itemId: Types.Scalars['Int']
}>

export type GetBillingItemDetailByIdAsyncQuery = {
  __typename?: 'BillingQuery'
  billingItemDetailById: {
    __typename?: 'BillingItem'
    id?: number | null
    companyId: number
    jobId: number
    adExp: number | undefined
    billingNumber?: string | null
    invoiceNumber?: string | null
    costCenter?: string | null
    sharedRiskMonthly: number | undefined
    perPerson: any
    directHire: number | undefined
    hourly: number | undefined
    lineTotal?: any | null
    createdDate?: any | null
    modifiedDate?: any | null
    units: number | undefined
    hoursWorked: number | undefined
    reqNumber?: string | null
    startDate?: string | null
    description?: string | null
    supervisor?: string | null
  }
}

export const GetBillingItemDetailByIdAsyncDocument = `
    query GetBillingItemDetailByIdAsync($itemId: Int!) {
  billingItemDetailById(itemId: $itemId) {
    id
    companyId
    jobId
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
    supervisor
    description
  }
}
    `
export const useGetBillingItemDetailByIdAsyncQuery = <TData = GetBillingItemDetailByIdAsyncQuery, TError = unknown>(
  variables: GetBillingItemDetailByIdAsyncQueryVariables,
  options?: UseQueryOptions<GetBillingItemDetailByIdAsyncQuery, TError, TData>
) =>
  useQuery<GetBillingItemDetailByIdAsyncQuery, TError, TData>(
    ['GetBillingItemDetailByIdAsync', variables],
    fetchData<GetBillingItemDetailByIdAsyncQuery, GetBillingItemDetailByIdAsyncQueryVariables>(
      GetBillingItemDetailByIdAsyncDocument,
      variables
    ),
    options
  )
