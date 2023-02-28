/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetNotesByIdQueryVariables = Types.Exact<{
  entityId: Types.Scalars['Int']
  entityName: Types.Scalars['String']
}>

export type GetNotesByEntityQuery = {
  __typename?: 'CompanyQuery'
  notesByEntity?: {
    __typename?: 'NoteCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Note'
      id?: number | null
      text?: string | null
      createdBy: string
      modifiedBy: string
      modifiedDate: any
      createdDate: any
      entityId: number
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetNotesByIdDocument = `
      query GetNotesById($entityId: Int!, $entityName: String!) {
        notesByEntity(entityId: $entityId, entityName: $entityName) {
      items {
        id
        text
        createdBy
        modifiedBy
        modifiedDate
        createdDate
        entityId
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }`

export const useGetNotesByIdQuery = <TData = GetNotesByEntityQuery, TError = unknown>(
  variables: GetNotesByIdQueryVariables,
  options?: UseQueryOptions<GetNotesByEntityQuery, TError, TData>
) =>
  useQuery<GetNotesByEntityQuery, TError, TData>(
    ['GetNotesByEntity', variables],
    fetchData<GetNotesByEntityQuery, GetNotesByIdQueryVariables>(GetNotesByIdDocument, variables),
    options
  )
