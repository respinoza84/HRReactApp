/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetDocumentsByIdQueryVariables = Types.Exact<{
  candidateId: Types.Scalars['Int']
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.DocumentSortInput> | Types.DocumentSortInput>
}>

export type GetDocumentsByIdQuery = {
  __typename?: 'CandidateQuery'
  documentsById?: {
    __typename?: 'DocumentCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Document'
      id: number
      fileName: string
      fileType: string
      fileSize: string
      modifiedDate: any
      modifiedBy: string
      companyId: number
      blobPath: string
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetDocumentsByIdDocument = `
    query GetDocumentsById($candidateId: Int!, $skip: Int!, $take: Int!, $order: [DocumentSortInput!]) {
    documentsById(candidateId: $candidateId, skip: $skip, take: $take, order: $order) {
      items {
        id
        fileName
        fileType
        fileSize
        modifiedDate
        modifiedBy
        entityId
        blobPath
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }`

export const useGetDocumentsByIdQuery = <TData = GetDocumentsByIdQuery, TError = unknown>(
  variables: GetDocumentsByIdQueryVariables,
  options?: UseQueryOptions<GetDocumentsByIdQuery, TError, TData>
) =>
  useQuery<GetDocumentsByIdQuery, TError, TData>(
    ['GetDocumentsById', variables],
    fetchData<GetDocumentsByIdQuery, GetDocumentsByIdQueryVariables>(GetDocumentsByIdDocument, variables),
    options
  )
