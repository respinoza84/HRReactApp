/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetJobsQueryVariables = Types.Exact<{
  candidateId?: Types.Scalars['Int']
  filter: Types.JobFilterInput
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.JobSortInput> | Types.JobSortInput>
}>

export type GetJobsQuery = {
  __typename?: 'JobQuery'
  jobs?: {
    __typename?: 'JobCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Job'
      id: number
      city: string
      state: string
      zipCode: string
      territory: string
      numOfPositions: number
      contactName: string
      createdDate?: any | null
      modifiedDate?: any | null
      companyId: number
      companyName: string
      companyVertical: string
      status: string
      statusId: number
      jobName: string
      jobType: string
      jobExternalType: string
      jobSource: string
      jobDescription: string
      jobOwnerShip: string
      totalDocuments: number
      timeOffer?: any | null
      candidates: number
      career?: string | undefined
      payRange?: string | undefined
      jobVertical?: string | undefined
      salaryFrom: number
      salaryTo: number
      jobOwnerShipEmail: string
      stage: string | undefined
      internalReference: string | undefined
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetJobsDocument = `
      query GetJobs($filter: JobFilterInput!, $skip: Int!, $take: Int!, $order: [JobSortInput!]) {
    jobs(filter: $filter, skip: $skip, take: $take, order: $order) {
      items {
        id
        city
        state
        zipCode
        territory
        numOfPositions
        contactName
        createdDate
        modifiedDate
        companyId
        companyName
        status
        statusId
        jobName
        jobType
        jobExternalType
        jobSource
        jobDescription
        jobOwnerShip
        totalDocuments
        candidates
        career
        payRange
        timeOffer
        jobVertical
        salaryFrom
        salaryTo
        jobOwnerShipEmail
        stage
        internalReference
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  } `

export const useGetJobsQuery = <TData = GetJobsQuery, TError = unknown>(
  variables: GetJobsQueryVariables,
  options?: UseQueryOptions<GetJobsQuery, TError, TData>
) =>
  useQuery<GetJobsQuery, TError, TData>(
    ['GetJobs', variables],
    fetchData<GetJobsQuery, GetJobsQueryVariables>(GetJobsDocument, variables),
    options
  )
