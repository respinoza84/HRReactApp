/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetContactInfoByIdQueryVariables = Types.Exact<{
  candidateId: Types.Scalars['Int']
}>

export type GetContactInfoByIdQuery = {
  __typename?: 'CandidateQuery'
  contactInfoById: {
    __typename?: 'ContactInfo'
    candidateId: number
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    country?: string | null
    homePhone?: string | null
    cellPhone?: string | null
    workPhone?: string | null
    email?: string | null
    indeed?: string | null
    linkedIn?: string | null
    facebook?: string | null
    twitter?: string | null
  }
}

export const GetContactInfoByIdDocument = `
      query GetContactInfoById($candidateId: Int!) {
    contactInfoById(candidateId: $candidateId) {
      candidateId
      addressLine1
      addressLine2
      city
      state
      zipCode
      country
      homePhone
      cellPhone
      workPhone
      email
      indeed
      linkedIn
      facebook
      twitter
    }
  }`

export const useGetContactInfoByIdQuery = <TData = GetContactInfoByIdQuery, TError = unknown>(
  variables: GetContactInfoByIdQueryVariables,
  options?: UseQueryOptions<GetContactInfoByIdQuery, TError, TData>
) =>
  useQuery<GetContactInfoByIdQuery, TError, TData>(
    ['GetContactInfoById', variables],
    fetchData<GetContactInfoByIdQuery, GetContactInfoByIdQueryVariables>(
      GetContactInfoByIdDocument,
      variables
    ),
    options
  )
