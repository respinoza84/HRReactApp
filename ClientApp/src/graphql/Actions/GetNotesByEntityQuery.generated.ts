/* eslint-disable */
import * as Types from '../../graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetNotesByEntityQueryVariables = Types.Exact<{
  entityId: Types.Scalars['Int']
  entityName: Types.Scalars['String']
}>

export type GetNotesByEntityQuery = {
  __typename?: 'ActionQuery'
  notesByEntity?: {
    __typename?: 'NoteCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Note'
      id?: number | null
      text?: string | null
      createdBy?: string | null
      modifiedBy?: string | null
      modifiedDate?: any | null
      createdDate?: any | null
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetNotesByEntityDocument = `
      query GetNotesByEntity($entityId: Int!, $entityName: String!) {
    notesByEntity(entityId: $entityId, entityName: $entityName) {
      items {
        id
        text
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

export const useGetNotesByEntityQuery = <TData = GetNotesByEntityQuery, TError = unknown>(
  variables: GetNotesByEntityQueryVariables,
  options?: UseQueryOptions<GetNotesByEntityQuery, TError, TData>
) =>
  useQuery<GetNotesByEntityQuery, TError, TData>(
    ['GetNotesByEntity', variables],
    fetchData<GetNotesByEntityQuery, GetNotesByEntityQueryVariables>(
      GetNotesByEntityDocument,
      variables
    ),
    options
  )
