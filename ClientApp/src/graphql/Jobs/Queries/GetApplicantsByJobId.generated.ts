/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetApplicantsByJobIdAsyncQueryVariables = Types.Exact<{
  jobId: Types.Scalars['Int']
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.ApplicantSortInput> | Types.ApplicantSortInput>
}>

export type GetApplicantsByJobIdAsyncQuery = {
  __typename?: 'JobQuery'
  applicantsByJobId?: {
    __typename?: 'ApplicantCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Applicant'
      candidateId: number
      applicantName: string
      startDate: string
      endDate: string
      source: string
      modifiedDate: string
      stageId?: number
      note: string
      offerStatus: string
      nonSelecctionReason: string
      applicationDate?: any | null
      lastActivity?: string | null
      timeStart?: any | null
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetApplicantsByJobIdAsyncDocument = `
      query GetApplicantsByJobIdAsync($jobId: Int!, $skip: Int!, $take: Int!, $order: [ApplicantSortInput!]) {
    applicantsByJobId(jobId: $jobId, skip: $skip, take: $take, order: $order) {
      items {
        candidateId
        applicantName
        source
        applicationDate
        lastActivity
        startDate
        endDate
        stageId
        note
        offerStatus
        nonSelecctionReason
        modifiedDate
        timeStart
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }`

export const useGetApplicantsByJobIdAsyncQuery = <TData = GetApplicantsByJobIdAsyncQuery, TError = unknown>(
  variables: GetApplicantsByJobIdAsyncQueryVariables,
  options?: UseQueryOptions<GetApplicantsByJobIdAsyncQuery, TError, TData>
) =>
  useQuery<GetApplicantsByJobIdAsyncQuery, TError, TData>(
    ['GetApplicantsByJobIdAsync', variables],
    fetchData<GetApplicantsByJobIdAsyncQuery, GetApplicantsByJobIdAsyncQueryVariables>(
      GetApplicantsByJobIdAsyncDocument,
      variables
    ),
    options
  )
