/*
  @author Guido Arce
  @description Auth API
*/
import {getGatewayServiceUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'
import {Note} from 'graphql/types.generated'
import {Email} from 'type/email'

const getNoteApi = apiFactory(getGatewayServiceUrl('api/Actions/notes'))
const postNoteApi = apiFactory(getGatewayServiceUrl('api/Actions/note'))
const emailApi = apiFactory(getGatewayServiceUrl('api/Actions/email'))

const getNotes = (companyId: number, entityName: string) => {
  return getNoteApi.get<Note[]>(
    {
      companyId: `${companyId}`,
      entityName: entityName
    },
    {}
  )
}

export const createNote = (entityId: string, entityName: string, body: Note) => {
  return postNoteApi.post<Note>({entityId, entityName}, body)
}

export const deleteNote = (noteId: string, entityId: string, entityName: string) =>
  postNoteApi
    .deleteBody({entityId, entityName, noteId: noteId}, undefined)
    .then((response: any) => response && response.status)

const email = (body?: Email) => {
  return emailApi.post<any>({}, body)
}

export {getNotes, email}
