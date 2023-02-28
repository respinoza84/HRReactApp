/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCandidatesAsyncQueryVariables = Types.Exact<{
  filter: Types.CandidateFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.CandidateSortInput> | Types.CandidateSortInput>
}>

export type GetCandidatesAsyncQuery = {
  __typename?: 'CandidateQuery'
  candidates?: {
    __typename?: 'CandidateCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Candidate'
      id: number
      code: number
      firstName: string
      lastName: string
      prefferedName: string
      owner: string
      source: string
      status: string
      email: string
      homePhone: string
      cellPhone: string
      workPhone: string
      linkedIn: string
      indeed: string
      facebook: string
      twitter: string
      jobTitle: string
      currentEmployer: string
      noticePeriod: string
      summary: string
      otherEmail: string
      workType: string
      timeZone: string
      marketing: string
      dateLastContacted: any
      dateResumeSent: any
      territory: string
      createdDate: any
      modifiedDate: any
      byEmail: boolean
      byPhone: boolean
      byText: boolean
      displayAs: string
      department: string
      lastActivity: string
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetCandidatesAsyncDocument = `
    query GetCandidatesAsync($filter: CandidateFilterInput!, $skip: Int!, $take: Int!, $order: [CandidateSortInput!]) {
  candidates(filter: $filter, skip: $skip, take: $take, order: $order) {
    items {
      id
      code
      firstName
      lastName
      prefferedName
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
      currentEmployer
      noticePeriod
      summary
      otherEmail
      workType
      timeZone
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
      lastActivity
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}`

export const useGetCandidatesAsyncQuery = <TData = GetCandidatesAsyncQuery, TError = unknown>(
  variables: GetCandidatesAsyncQueryVariables,
  options?: UseQueryOptions<GetCandidatesAsyncQuery, TError, TData>
) =>
  useQuery<GetCandidatesAsyncQuery, TError, TData>(
    ['GetCandidatesAsync', variables],
    fetchData<GetCandidatesAsyncQuery, GetCandidatesAsyncQueryVariables>(GetCandidatesAsyncDocument, variables),
    options
  )
