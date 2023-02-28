/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCandidateByUserIdVariables = Types.Exact<{
  candidateId: Types.Scalars['Int']
}>

export type GetCandidateByUserId = {
  __typename?: 'CandidateQuery'
  candidateById: {
    __typename?: 'Candidate'
    id: number
    code: number
    createdDate: any
    email: string
    firstName: string
    lastName: string
    indeed: string
    linkedIn: string
    facebook: string
    twitter: string
    modifiedDate: any
    noticePeriod: string
    owner: string
    source: string
    status: string
    summary: string
    department: string
    byEmail: boolean
    byPhone: boolean
    byText: boolean
    cellPhone: string
    dateLastContacted: any
    dateResumeSent: any
    displayAs: string
    homePhone: string
    isDeleted: boolean
    jobTitle: string
    currentEmployer: string
    marketing: string
    otherEmail: string
    prefferedName: string
    privateRecord: boolean
    rigthToRepresent: boolean
    territory: string
    workPhone: string
    workType: string
    userId: number
    lookingJob: number
    rate: number
    rateMount: string
    timeZone: string
    userImageUrl: string
    jobName: string
  }
}

export const GetCandidateByIdDocument = `
    query GetCandidateById($candidateId: Int!) {
  candidateById(candidateId: $candidateId) {
    id
		code
		createdDate
		email
		firstName
		lastName
		indeed
		linkedIn
		facebook
		twitter
		modifiedDate
		noticePeriod
		owner
		source
		status
		summary
		department
		byEmail
		byPhone
		byText
		cellPhone
		dateLastContacted
		dateResumeSent
		displayAs
		homePhone
		isDeleted
		jobTitle
		currentEmployer
		marketing
		otherEmail
		prefferedName
		privateRecord
		rigthToRepresent
		territory
		workPhone
		workType
		userId
		lookingJob
		rate
		rateMount
		timeZone
    userImageUrl
    jobName
  }
}`

export const useGetCandidateByIdQuery = <TData = GetCandidateByUserId, TError = unknown>(
  variables: GetCandidateByUserIdVariables,
  options?: UseQueryOptions<GetCandidateByUserId, TError, TData>
) =>
  useQuery<GetCandidateByUserId, TError, TData>(
    ['GetCandidateById', variables],
    fetchData<GetCandidateByUserId, GetCandidateByUserIdVariables>(GetCandidateByIdDocument, variables),
    options
  )
