import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCompanyActivitiesQueryVariables = Types.Exact<{
  companyId: Types.Scalars['Int']
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.ActivitySortInput> | Types.ActivitySortInput>
}>

export type GetCompanyActivitiesQuery = {
  __typename?: 'Query'
  companyActivities?: {
    __typename?: 'ActivityCollectionSegment'
    items?: Array<{__typename?: 'Activity'; action?: string | null; createdDate: any; createdBy?: string | null}> | null
  } | null
}

export const GetCompanyActivitiesDocument = `
    query GetCompanyActivities($companyId: Int!, $skip: Int!, $take: Int!, $order: [ActivitySortInput!]) {
  companyActivities(
    companyId: $companyId
    skip: $skip
    take: $take
    order: $order
  ) {
    items {
      action
      createdDate
      createdBy
    }
  }
}
    `
export const useGetCompanyActivitiesQuery = <TData = GetCompanyActivitiesQuery, TError = unknown>(
  variables: GetCompanyActivitiesQueryVariables,
  options?: UseQueryOptions<GetCompanyActivitiesQuery, TError, TData>
) =>
  useQuery<GetCompanyActivitiesQuery, TError, TData>(
    ['GetCompanyActivities', variables],
    fetchData<GetCompanyActivitiesQuery, GetCompanyActivitiesQueryVariables>(GetCompanyActivitiesDocument, variables),
    options
  )
