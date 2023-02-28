/*
  @author Guido Arce
  @description Documents API
*/
import {getGatewayServiceUrl, getAuthServiceUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'

const getDocumentsApi = apiFactory(getGatewayServiceUrl('api/document/documents'))
const postDocumentApi = apiFactory(getGatewayServiceUrl('api/document/save'))
const externalDocumentApi = apiFactory(getGatewayServiceUrl('api/document/saveExternal'))
const externalUserImage = apiFactory(getAuthServiceUrl('api/profile/update-user-image'))
const deleteDocumentApi = apiFactory(getGatewayServiceUrl('api/document/delete'))

type Document = {
  fileName?: string
  fileType?: string
  fileSize?: string
  fileContents?: any
  entityId?: number
  entityName?: string
  urlPath?: string
}

type userImageProfile = {
  fileName?: string
  fileType?: string
  fileSize?: string
  fileContents?: any
  entityId?: number
  entityName?: string
  urlPath?: string
  userId?: any
}

const getDocuments = (companyId: number) => {
  return getDocumentsApi.get<any>({
    companyId: `${companyId}`
  })
}

export const deleteDocument = (documentId: string, entityId: string, entityName: string) =>
  deleteDocumentApi
    .deleteBody({documentId, entityId, entityName}, undefined)
    .then((response: any) => response && response.status)

export const addDocument = (document: Document) => {
  return postDocumentApi.post<Document>({}, document)
}

export const addExternalDocument = (document: Document) => {
  return externalDocumentApi.post<Document>({}, document)
}

export const addExternalImage = (document: userImageProfile) => {
  return externalUserImage.post<userImageProfile>({}, document)
}

export {getDocuments}
