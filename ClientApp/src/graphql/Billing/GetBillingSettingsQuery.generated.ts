/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetBillingSettingsByIdAsyncQueryVariables = Types.Exact<{
  jobId: Types.Scalars['Int']
  companyId: Types.Scalars['Int']
}>

export type GetBillingSettingsByIdAsyncQuery = {
  __typename?: 'BillingQuery'
  billingSettingsById: {
    __typename?: 'BillingSettings'
    id?: number | null
    companyId: number
    jobId?: number | null
    jobType?: string | null
    contractValidalityDate?: any | null
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
    sharedRiskMonthlyRenewalDate?: any | null
    terms: any
  }
}

export const GetBillingSettingsByIdAsyncDocument = `
    query GetBillingSettingsByIdAsync($jobId: Int!, $companyId: Int!) {
  billingSettingsById(jobId: $jobId, companyId: $companyId) {
    id
    companyId
    jobId
    jobType
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
export const useGetBillingSettingsByIdAsyncQuery = <TData = GetBillingSettingsByIdAsyncQuery, TError = unknown>(
  variables: GetBillingSettingsByIdAsyncQueryVariables,
  options?: UseQueryOptions<GetBillingSettingsByIdAsyncQuery, TError, TData>
) =>
  useQuery<GetBillingSettingsByIdAsyncQuery, TError, TData>(
    ['GetBillingSettingsByIdAsync', variables],
    fetchData<GetBillingSettingsByIdAsyncQuery, GetBillingSettingsByIdAsyncQueryVariables>(
      GetBillingSettingsByIdAsyncDocument,
      variables
    ),
    options
  )
