/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetAllContactsQueryVariables = Types.Exact<{
  filter: Types.ContactFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.ContactSortInput> | Types.ContactSortInput>
}>

export type GetAllContactsQuery = {
  __typename?: 'Query'
  allContacts?: {
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
      companyName?: string | null
      companyId?: number
      website?: string | null
      primaryPhone?: string | null
      modifiedBy?: string | null
      createdBy?: string | null
      createdDate?: any | null
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetAllContactsDocument = `
    query GetAllContacts($filter: ContactFilterInput!, $skip: Int!, $take: Int!, $order: [ContactSortInput!]) {
  allContacts(filter: $filter, skip: $skip, take: $take, order: $order) {
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
      companyName
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
export const useGetAllContactsQuery = <TData = GetAllContactsQuery, TError = unknown>(
  variables: GetAllContactsQueryVariables,
  options?: UseQueryOptions<GetAllContactsQuery, TError, TData>
) =>
  useQuery<GetAllContactsQuery, TError, TData>(
    ['GetAllContacts', variables],
    fetchData<GetAllContactsQuery, GetAllContactsQueryVariables>(GetAllContactsDocument, variables),
    options
  )
