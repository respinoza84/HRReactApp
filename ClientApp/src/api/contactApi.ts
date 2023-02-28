/*
  @author Oliver Zamora
  @description Contact API
*/
import {getGatewayServiceUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'
import {Contact} from 'graphql/types.generated'

const createApi = apiFactory(getGatewayServiceUrl('api/contact/create'))
const updateApi = apiFactory(getGatewayServiceUrl('api/contact/update'))
const deleteApi = apiFactory(getGatewayServiceUrl('api/contact/delete'))

const create = (body: Contact) => {
  return createApi.post<any>({}, body)
}

const update = (id: number, body: Contact) => {
  return updateApi.put<any>(id, undefined, body)
}

const archive = (id: number) => {
  return deleteApi.delete(id, undefined)
}

export {create, update, archive}
