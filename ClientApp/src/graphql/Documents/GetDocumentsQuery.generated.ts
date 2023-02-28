/* eslint-disable */
import * as Types from '../../graphql/types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetDocumentsQueryVariables = Types.Exact<{
  entityId: Types.Scalars['Int']
  entityName: Types.Scalars['String']
  skip: Types.Scalars['Int']
  take: Types.Scalars['Int']
  order?: Types.InputMaybe<Array<Types.DocumentSortInput> | Types.DocumentSortInput>
}>

export type GetDocumentsQuery = {
  __typename?: 'DocumentQuery'
  documents?: {
    __typename?: 'DocumentCollectionSegment'
    totalCount: number
    items?: Array<{
      __typename?: 'Document'
      id: number
      fileName: string
      fileType: string
      fileSize: string
      modifiedDate: string
      modifiedBy: string
      blobPath: string
    }> | null
    pageInfo: {__typename?: 'CollectionSegmentInfo'; hasNextPage: boolean; hasPreviousPage: boolean}
  } | null
}

export const GetDocumentsDocument = `
    query GetDocuments($entityId: Int!, $entityName: String!, $skip: Int!, $take: Int!, $order: [DocumentSortInput!]) {
  documents(
    entityId: $entityId
    entityName: $entityName
    skip: $skip
    take: $take
    order: $order
  ) {
    items {
      id
      fileName
      fileType
      fileSize
      modifiedDate
      modifiedBy
      blobPath
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}`

export const useGetDocumentsQuery = <TData = GetDocumentsQuery, TError = unknown>(
  variables: GetDocumentsQueryVariables,
  options?: UseQueryOptions<GetDocumentsQuery, TError, TData>
) =>
  useQuery<GetDocumentsQuery, TError, TData>(
    ['GetDocuments', variables],
    fetchData<GetDocumentsQuery, GetDocumentsQueryVariables>(GetDocumentsDocument, variables),
    options
  )
