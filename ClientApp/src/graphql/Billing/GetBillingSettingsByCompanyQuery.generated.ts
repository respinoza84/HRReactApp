/* eslint-disable */
import * as Types from '../../graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetBillingSettingsByCompanyByIdAsyncQueryVariables = Types.Exact<{
  companyId: Types.Scalars['Int']
}>

export type GetBillingSettingsByCompanyByIdAsyncQuery = {
  __typename?: 'BillingQuery'
  billingSettingsByCompanyById: {
    __typename?: 'BillingSettings'
    id?: number | null
    companyId: number
    contractValidalityDate: any
    sharedRiskPerHireFee: any
    contractorHourlyRate: any
    contractorOverridePercentage: any
    contractorOverridePerHour: any
    contractorClientInvoiceAmount: any
    executiveFeeSalary: any
    executiveFeePercentage: any
    executiveFeeOwed: any
    directHireSalary: any
    directHirePercentage: any
    directFeeOwed: any
    sharedRiskMonthlyFee: any
    sharedRiskMonthlyRenewalDate: any
    terms: string | undefined
  }
}

export const GetBillingSettingsByCompanyByIdAsyncDocument = `
    query GetBillingSettingsByCompanyByIdAsync($companyId: Int!) {
  billingSettingsByCompanyById(companyId: $companyId) {
    id
    companyId
    contractValidalityDate
    sharedRiskPerHireFee
    contractorHourlyRate
    contractorOverridePercentage
    contractorOverridePerHour
    contractorClientInvoiceAmount
    executiveFeeSalary
    executiveFeePercentage
    executiveFeeOwed
    directHireSalary
    directHirePercentage
    directFeeOwed
    sharedRiskMonthlyFee
    sharedRiskMonthlyRenewalDate
    terms
  }
}
    `
export const useGetBillingSettingsByCompanyByIdAsyncQuery = <
  TData = GetBillingSettingsByCompanyByIdAsyncQuery,
  TError = unknown
>(
  variables: GetBillingSettingsByCompanyByIdAsyncQueryVariables,
  options?: UseQueryOptions<GetBillingSettingsByCompanyByIdAsyncQuery, TError, TData>
) =>
  useQuery<GetBillingSettingsByCompanyByIdAsyncQuery, TError, TData>(
    ['GetBillingSettingsByCompanyByIdAsync', variables],
    fetchData<GetBillingSettingsByCompanyByIdAsyncQuery, GetBillingSettingsByCompanyByIdAsyncQueryVariables>(
      GetBillingSettingsByCompanyByIdAsyncDocument,
      variables
    ),
    options
  )
