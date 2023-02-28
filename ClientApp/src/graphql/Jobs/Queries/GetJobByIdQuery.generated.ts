/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetJobByIdQueryVariables = Types.Exact<{
  jobId: Types.Scalars['Int']
}>

export type GetJobByIdQuery = {
  __typename?: 'JobQuery'
  jobById: {
    __typename?: 'Job'
    id?: number | undefined
    city: string
    state: string
    zipCode: string
    territory?: string | undefined
    numOfPositions: number
    contactName: string
    contactId: number
    createdDate?: any | null
    modifiedDate?: any | null
    companyId: number
    statusId?: number | undefined
    jobName: string
    jobType: string
    jobExternalType: string
    jobSource?: string | undefined
    jobDescription?: string | undefined
    jobOwnerShip: string
    candidates: number
    timeOffer?: any | null
    timeFill?: any | null
    career?: string | undefined
    payRange?: string | undefined
    jobVertical?: string | undefined
    internalReference?: string | undefined
  }
}

export const GetJobByIdDocument = `
      query GetJobById($jobId: Int!) {
    jobById(jobId: $jobId) {
      id
      city
      state
      zipCode
      territory
      numOfPositions
      contactName
      contactId
      createdDate
      modifiedDate
      companyId
      statusId
      jobName
      jobType
      jobExternalType
      jobSource
      jobDescription
      jobOwnerShip
      candidates
      timeOffer
      timeFill
      career
      payRange
      jobVertical
      internalReference
    }
  }`

export const useGetJobByIdQuery = <TData = GetJobByIdQuery, TError = unknown>(
  variables: GetJobByIdQueryVariables,
  options?: UseQueryOptions<GetJobByIdQuery, TError, TData>
) =>
  useQuery<GetJobByIdQuery, TError, TData>(
    ['GetJobById', variables],
    fetchData<GetJobByIdQuery, GetJobByIdQueryVariables>(GetJobByIdDocument, variables),
    options
  )
