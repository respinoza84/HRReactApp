/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCompanyByIdQueryVariables = Types.Exact<{
  companyId: Types.Scalars['Int']
  userId: Types.Scalars['Int']
}>

export type GetCompanyByIdQuery = {
  __typename?: 'CompanyQuery'
  companyById: {
    __typename?: 'Company'
    companyName: string
    companyType: string
    companyVertical: string
    companyOwner: string
    internalReference: string
    parentCompany: string
    companyRank: string
    companySource: string
    department: string
    territory: string
    backgroundInformation: string
    items?: Array<{
      __typename?: 'PrimaryContactInfo'
      id: number
      addressLine1: string | null
      addressLine2: string | null
      country: string | null
      city: string | null
      website: string | null
      department: string | null
      email: string | null
      isPrimaryConctact: string | null
      phone: string | null
      state: string | null
      zipCode: string | null
      contactName: string | null
      primaryPhone: string | null
    }> | null
    percentComplete: number
    applicantStageSummary: number
    preScreenStageSummary: number
    offerStageSummary: number
    workingStageSummary: number
    resumenSentStageSummary: number
    companyImageUrl: string
  }
}

export const GetCompanyByIdDocument = `query GetCompanyById($companyId: Int!, $userId: Int!) {
    companyById(companyId: $companyId, userId: $userId) {
        companyName
        companyType
        companyVertical
        companyOwner
        internalReference
        parentCompany
        companyRank
        companySource
        department
        territory
        backgroundInformation      
        primaryContactInfo{
          id
          addressLine1
          addressLine2
          country
          city
          website
          department
          email
          isPrimaryConctact
          phone
          state
          zipCode
          contactName
          primaryPhone
        }
        percentComplete
        applicantStageSummary
        preScreenStageSummary
        offerStageSummary
        workingStageSummary
        resumenSentStageSummary
        companyImageUrl
    }
}`

export const useGetCompanyByIdQuery = <TData = GetCompanyByIdQuery, TError = unknown>(
  variables: GetCompanyByIdQueryVariables,
  options?: UseQueryOptions<GetCompanyByIdQuery, TError, TData>
) =>
  useQuery<GetCompanyByIdQuery, TError, TData>(
    ['GetCompanyById', variables],
    fetchData<GetCompanyByIdQuery, GetCompanyByIdQueryVariables>(GetCompanyByIdDocument, variables),
    options
  )
