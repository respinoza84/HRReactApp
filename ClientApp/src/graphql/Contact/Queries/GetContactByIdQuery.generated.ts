/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetContactByIdQueryVariables = Types.Exact<{
  companyId: Types.Scalars['Int']
  contactId: Types.Scalars['Int']
}>

export type GetContactByIdQuery = {
  __typename?: 'Query'
  contactById: {
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
  }
}

export const GetContactByIdDocument = `
    query GetContactById($companyId: Int!, $contactId: Int!) {
  contactById(companyId: $companyId, contactId: $contactId) {
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
}
    `
export const useGetContactByIdQuery = <TData = GetContactByIdQuery, TError = unknown>(
  variables: GetContactByIdQueryVariables,
  options?: UseQueryOptions<GetContactByIdQuery, TError, TData>
) =>
  useQuery<GetContactByIdQuery, TError, TData>(
    ['GetContactById', variables],
    fetchData<GetContactByIdQuery, GetContactByIdQueryVariables>(GetContactByIdDocument, variables),
    options
  )
