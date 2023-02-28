/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetNotesByIdQueryVariables = Types.Exact<{
  candidateId: Types.Scalars['Int']
  entityName: Types.Scalars['String']
}>

export type GetNotesByIdQuery = {
  __typename?: 'CandidateQuery'
  notesById?: {
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
      query GetNotesById($candidateId: Int!, $entityName: String!) {
    notesById(candidateId: $candidateId, entityName: $entityName) {
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

export const useGetNotesByIdQuery = <TData = GetNotesByIdQuery, TError = unknown>(
  variables: GetNotesByIdQueryVariables,
  options?: UseQueryOptions<GetNotesByIdQuery, TError, TData>
) =>
  useQuery<GetNotesByIdQuery, TError, TData>(
    ['GetNotesById', variables],
    fetchData<GetNotesByIdQuery, GetNotesByIdQueryVariables>(GetNotesByIdDocument, variables),
    options
  )
