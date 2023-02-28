/*
  @author Oliver Zamora
  @description Company API
*/
import {getGatewayServiceUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'
import {Company, Contact, CreateCompanyAccount} from 'graphql/types.generated'
const createApi = apiFactory(getGatewayServiceUrl('api/company/create'))
const updateApi = apiFactory(getGatewayServiceUrl('api/company/update'))
const updateCompanyApi = apiFactory(getGatewayServiceUrl('api/company/update-company-account'))
const deleteApi = apiFactory(getGatewayServiceUrl('api/company/delete'))
const contactApi = apiFactory(getGatewayServiceUrl('api/company/contact'))
const contactDeleteApi = apiFactory(getGatewayServiceUrl('api/company/contact/delete'))
const companyVerticalApi = apiFactory(getGatewayServiceUrl('api/company/companyVertical/add'))
const createCompanyAccount = apiFactory(getGatewayServiceUrl('api/Company/create-company-account'))
const companySummary = apiFactory(getGatewayServiceUrl('api/company/details'))
const companyActivation = apiFactory(getGatewayServiceUrl('api/company/account-activation'))

const companyDetails = (id: string) => {
  return companySummary.get<any>({id})
}

const create = (body: Company) => {
  return createApi.post<any>({}, body)
}

const update = (id: number, body: Company) => {
  return updateApi.put<any>(id, undefined, body)
}
const updateCompanyProfile = (companyId: number, body: Company) => {
  return updateCompanyApi.companyPut<any>(companyId, undefined, body)
}

const archive = (id: number) => {
  return deleteApi.delete(id, undefined)
}

const activedCompany = (companyId: string) => {
  return companyActivation.post({companyId}, undefined)
}

const saveContact = (companyId: string, contactId: string, body: Contact) => {
  return contactApi.post({companyId, contactId}, body)
}

const deleteContact = (contactId: string) => {
  return contactDeleteApi.delete(undefined, {contactId})
}

const addCompanyVertical = (companyVertical: string) => {
  return companyVerticalApi.post<any>({}, {vertical: companyVertical})
}

const createCompanyAccountService = (body: CreateCompanyAccount) => {
  return createCompanyAccount.post<any>({}, body)
}

export {
  create,
  update,
  archive,
  saveContact,
  deleteContact,
  addCompanyVertical,
  createCompanyAccountService,
  companyDetails,
  activedCompany,
  updateCompanyProfile
}
