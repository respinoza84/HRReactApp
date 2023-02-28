/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetContactsQueryVariables = Types.Exact<{
  companyId: Types.Scalars['Int']
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.ContactSortInput> | Types.ContactSortInput>
}>

export type GetContactsQuery = {
  __typename?: 'Query'
  contacts?: {
    __typename?: 'ContactCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Contact'
      id: number
      contactName: string
      email: string
      phone?: string | null
      city?: string | null
      state?: string | null
      country?: string | null
      zipCode?: string | null
      isPrimaryConctact?: boolean | null
      department?: string | null
      addressLine1?: string | null
      addressLine2?: string | null
      companyId: number
      website?: string | null
      primaryPhone?: string | null
      modifiedBy?: string | null
      createdBy?: string | null
      createdDate?: any | null
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetContactsDocument = `
    query GetContacts($companyId: Int!, $skip: Int!, $take: Int!, $order: [ContactSortInput!]) {
  contacts(companyId: $companyId, skip: $skip, take: $take, order: $order) {
    items {
      id
      contactName
      email
      phone
      city
      state
      country
      zipCode
      isPrimaryConctact
      department
      addressLine1
      addressLine2
      companyId
      website
      primaryPhone
      modifiedBy
      createdBy
      createdDate
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `
export const useGetContactsQuery = <TData = GetContactsQuery, TError = unknown>(
  variables: GetContactsQueryVariables,
  options?: UseQueryOptions<GetContactsQuery, TError, TData>
) =>
  useQuery<GetContactsQuery, TError, TData>(
    ['GetContacts', variables],
    fetchData<GetContactsQuery, GetContactsQueryVariables>(GetContactsDocument, variables),
    options
  )