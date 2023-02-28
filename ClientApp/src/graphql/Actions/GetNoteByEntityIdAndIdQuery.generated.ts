/* eslint-disable */
import * as Types from '../../graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetActivitiesByEntityQueryVariables = Types.Exact<{
  entityId: Types.Scalars['Int']
  entityName: Types.Scalars['String']
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
}>

export type GetActivitiesByEntityQuery = {
  __typename?: 'ActivityQuery'
  activitiesByEntity?: {
    __typename?: 'ActivityCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Activity'
      id: number
      entityId: number
      action?: string | null
      createdBy?: string | null
      modifiedBy?: string | null
      modifiedDate: any
      createdDate: any
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetActivitiesByEntityDocument = `
      query GetActivitiesByEntity($entityId: Int!, $entityName: String!, $skip: Int!, $take: Int!) {
    activitiesByEntity(entityId: $entityId, entityName: $entityName, skip: $skip, take: $take) {
      items {
        id
        entityId
        action
        createdBy
        modifiedBy
        modifiedDate
        createdDate
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }`

export const useGetActivitiesByEntityQuery = <TData = GetActivitiesByEntityQuery, TError = unknown>(
  variables: GetActivitiesByEntityQueryVariables,
  options?: UseQueryOptions<GetActivitiesByEntityQuery, TError, TData>
) =>
  useQuery<GetActivitiesByEntityQuery, TError, TData>(
    ['GetActivitiesByEntity', variables],
    fetchData<GetActivitiesByEntityQuery, GetActivitiesByEntityQueryVariables>(
      GetActivitiesByEntityDocument,
      variables
    ),
    options
  )
