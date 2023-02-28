/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCandidateActivitiesQueryVariables = Types.Exact<{
  entityId: Types.Scalars['Int']
}>

export type GetCandidateActivitiesQuery = {
  __typename?: 'CandidateQuery'
  candidateActivities?: {
    __typename?: 'ActivityCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Activity'
      id: number
      entityName?: string | null
      entityId: number
      action?: string | null
      status?: string | null
      company?: string | null
      contact?: string | null
      createdBy?: string | null
      modifiedBy?: string | null
      createdDate: any
      modifiedDate: any
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetCandidateActivitiesDocument = `
      query GetCandidateActivities($entityId: Int!) {
    candidateActivities(entityId: $entityId) {
      items {
        id
        entityName
        entityId
        action
        status
        company
        contact
        createdBy
        modifiedBy
        createdDate
        modifiedDate
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }`

export const useGetCandidateActivitiesQuery = <TData = GetCandidateActivitiesQuery, TError = unknown>(
  variables: GetCandidateActivitiesQueryVariables,
  options?: UseQueryOptions<GetCandidateActivitiesQuery, TError, TData>
) =>
  useQuery<GetCandidateActivitiesQuery, TError, TData>(
    ['GetCandidateActivities', variables],
    fetchData<GetCandidateActivitiesQuery, GetCandidateActivitiesQueryVariables>(
      GetCandidateActivitiesDocument,
      variables
    ),
    options
  )
