/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetJobCandidatesQueryVariables = Types.Exact<{
  filter: Types.JobCandidateFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.JobCandidateSortInput> | Types.JobCandidateSortInput>
}>

export type GetJobCandidatesQuery = {
  __typename?: 'JobQuery'
  jobCandidates?: {
    __typename?: 'JobCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Job'
      companyId: number
      candidateId: number
      jobId: number
      applicantName: string
      stageId: number
      stageDescription: string
      candidateEmail: string | undefined
      candidateCellPhone: string | undefined
      candidateCreatedDate?: any | null
      candidateModificateDate?: any | null
      lastActivity: string
      resumeFileName: string
      resumePath: string
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetJobCandidatesDocument = `
      query GetJobCandidates($filter: JobCandidateFilterInput!, $skip: Int!, $take: Int!, $order: [JobCandidateSortInput!]) {
        jobCandidates(filter: $filter, skip: $skip, take: $take, order: $order) {
      items {
        companyId
        candidateId
        jobId
        applicantName
        stageId
        stageDescription
        candidateEmail
        candidateCellPhone
        candidateCreatedDate
        candidateModificateDate
        lastActivity
        resumeFileName
        resumePath
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  } `

export const useGetJobCandidatesQuery = <TData = GetJobCandidatesQuery, TError = unknown>(
  variables: GetJobCandidatesQueryVariables,
  options?: UseQueryOptions<GetJobCandidatesQuery, TError, TData>
) =>
  useQuery<GetJobCandidatesQuery, TError, TData>(
    ['GetJobCandidates', variables],
    fetchData<GetJobCandidatesQuery, GetJobCandidatesQueryVariables>(GetJobCandidatesDocument, variables),
    options
  )
