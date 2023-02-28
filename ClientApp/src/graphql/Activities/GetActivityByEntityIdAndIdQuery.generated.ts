/* eslint-disable */
import * as Types from '../../graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetNoteByEntityIdAndIdQueryVariables = Types.Exact<{
  entityId: Types.Scalars['Int']
  noteId: Types.Scalars['Int']
}>

export type GetNoteByEntityIdAndIdQuery = {
  __typename?: 'ActionQuery'
  noteByEntityIdAndId: {
    __typename?: 'Note'
    id?: number | null
    text?: string | null
    createdBy?: string | null
    modifiedBy?: string | null
    modifiedDate?: any | null
    createdDate?: any | null
  }
}

export const GetNoteByEntityIdAndIdDocument = `
      query GetNoteByEntityIdAndId($entityId: Int!, $noteId: Int!) {
    noteByEntityIdAndId(entityId: $entityId, noteId: $noteId) {
      id
      text
      createdBy
      modifiedBy
      modifiedDate
      createdDate
    }
  }`

export const useGetNoteByEntityIdAndIdQuery = <TData = GetNoteByEntityIdAndIdQuery, TError = unknown>(
  variables: GetNoteByEntityIdAndIdQueryVariables,
  options?: UseQueryOptions<GetNoteByEntityIdAndIdQuery, TError, TData>
) =>
  useQuery<GetNoteByEntityIdAndIdQuery, TError, TData>(
    ['GetNoteByEntityIdAndId', variables],
    fetchData<GetNoteByEntityIdAndIdQuery, GetNoteByEntityIdAndIdQueryVariables>(
      GetNoteByEntityIdAndIdDocument,
      variables
    ),
    options
  )
