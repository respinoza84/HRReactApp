/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCandidateByUserIdQueryVariables = Types.Exact<{
  userId: Types.Scalars['Int']
}>

export type GetCandidateByUserIdQuery = {
  __typename?: 'CandidateQuery'
  candidateByUserId: {
    __typename?: 'Candidate'
    id?: number
    code?: number
    firstName?: string | undefined
    lastName?: string | undefined
    prefferedName?: string | undefined
    owner?: string | undefined
    source?: string | undefined
    status?: string | undefined
    email?: string | undefined
    homePhone?: string | undefined
    cellPhone?: string | undefined
    workPhone?: string | undefined
    linkedIn?: string | undefined
    indeed?: string | undefined
    facebook?: string | undefined
    twitter?: string | undefined
    jobTitle?: string | undefined
    noticePeriod?: string | undefined
    summary?: string | undefined
    otherEmail?: string | undefined
    workType?: string | undefined
    marketing?: string | undefined
    dateLastContacted?: any | undefined
    dateResumeSent?: any | undefined
    territory?: string | undefined
    createdDate?: any | undefined
    modifiedDate?: any | undefined
    byEmail?: boolean
    byPhone?: boolean
    byText?: boolean
    displayAs?: string | undefined
    department?: string | undefined
    userId?: number | undefined
    percentComplete?: number | undefined
    lookingJob?: number | undefined
    rate?: number | undefined
    rateMount?: any | undefined
    userImageUrl?: string | undefined
    privateRecord?: boolean
    rigthToRepresent?: boolean
    address?: {
      __typename?: 'Address'
      addressLine1?: string | undefined
      city?: string | undefined
      country?: string | undefined
      state?: string | undefined
      zipCode?: string | undefined
    } | undefined
  }
}

export const GetCandidateByUserIdDocument = `
    query GetCandidateByUserId($userId: Int!) {
  candidateByUserId(userId: $userId) {
    id
    code
    firstName
    lastName
    prefferedName
    privateRecord
    rigthToRepresent
    owner
    source
    status
    email
    homePhone
    cellPhone
    workPhone
    linkedIn
    indeed
    facebook
    twitter
    jobTitle
    noticePeriod
    summary
    otherEmail
    workType
    marketing
    dateLastContacted
    dateResumeSent
    territory
    createdDate
    modifiedDate
    byEmail
    byPhone
    byText
    displayAs
    department
    userId
    percentComplete
    lookingJob
    rate
    rateMount
    userImageUrl
    address{
      addressLine1
      city
      country
      state
      zipCode
    }
  }
}
    `
export const useGetCandidateByUserIdQuery = <TData = GetCandidateByUserIdQuery, TError = unknown>(
  variables: GetCandidateByUserIdQueryVariables,
  options?: UseQueryOptions<GetCandidateByUserIdQuery, TError, TData>
) =>
  useQuery<GetCandidateByUserIdQuery, TError, TData>(
    ['GetCandidateByUserId', variables],
    fetchData<GetCandidateByUserIdQuery, GetCandidateByUserIdQueryVariables>(GetCandidateByUserIdDocument, variables),
    options
  )
