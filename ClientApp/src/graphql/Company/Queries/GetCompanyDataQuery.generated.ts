/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCompanyDataQueryVariables = Types.Exact<{
  filter: Types.CompanyFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.CompanySortInput> | Types.CompanySortInput>
}>

export type GetCompanyDataQuery = {
  __typename?: 'Query'
  companyData?: {
    __typename?: 'CompanyCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Company'
      id: number
      companyName?: string | null
      companyOwner?: string | null
      contact?: string | null
      companyType?: string | null
      companyVertical?: string | null
      lastActivity?: string | null
      document?: number | null
      modifiedDate?: string | null
      isActived?: string | null
      internalReference?: string | null
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetCompanyDataDocument = `query GetCompanyData($filter: CompanyFilterInput!, $skip: Int!, $take: Int!, $order: [CompanySortInput!]) {
companyData(filter: $filter, skip: $skip, take: $take, order: $order) {
items {
  id
  companyName
  companyOwner
  contact
  companyType
  companyVertical
  lastActivity
  document
  modifiedDate
  isActived
  internalReference
}
totalCount
pageInfo {
  hasNextPage
  hasPreviousPage
}
}
}`

export const useGetCompanyDataQuery = <TData = GetCompanyDataQuery, TError = unknown>(
  variables: GetCompanyDataQueryVariables,
  options?: UseQueryOptions<GetCompanyDataQuery, TError, TData>
) =>
  useQuery<GetCompanyDataQuery, TError, TData>(
    ['GetCompanyData', variables],
    fetchData<GetCompanyDataQuery, GetCompanyDataQueryVariables>(GetCompanyDataDocument, variables),
    options
  )
