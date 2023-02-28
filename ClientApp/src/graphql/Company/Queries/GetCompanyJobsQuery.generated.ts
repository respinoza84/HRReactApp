import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCompanyJobsQueryVariables = Types.Exact<{
  companyId: Types.Scalars['Int']
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.JobSortInput> | Types.JobSortInput>
}>

export type GetCompanyJobsQuery = {
  __typename?: 'Query'
  companyJobs?: {
    __typename?: 'JobCollectionSegment'
    items?: Array<{
      __typename?: 'Job'
      id: number
      jobName: string
      jobOwnerShip: string
      status: string
      jobType: string
    }> | null
  } | null
}

export const GetCompanyJobsDocument = `
    query GetCompanyJobs($companyId: Int!, $skip: Int!, $take: Int!, $order: [JobSortInput!]) {
  companyJobs(companyId: $companyId, skip: $skip, take: $take, order: $order) {
    items {
      id
      jobName
      jobOwnerShip
      status
      jobType
    }
  }
}
    `
export const useGetCompanyJobsQuery = <TData = GetCompanyJobsQuery, TError = unknown>(
  variables: GetCompanyJobsQueryVariables,
  options?: UseQueryOptions<GetCompanyJobsQuery, TError, TData>
) =>
  useQuery<GetCompanyJobsQuery, TError, TData>(
    ['GetCompanyJobs', variables],
    fetchData<GetCompanyJobsQuery, GetCompanyJobsQueryVariables>(GetCompanyJobsDocument, variables),
    options
  )
