/*
  @author Oliver Zamora
  @description Candidate API
*/
import {getGatewayServiceUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'
import {Candidate, ContactInfo} from 'graphql/types.generated'

const createApi = apiFactory(getGatewayServiceUrl('api/candidate/create'))
const createExternalApi = apiFactory(getGatewayServiceUrl('api/candidate/external'))
const updateApi = apiFactory(getGatewayServiceUrl('api/candidate/update'))
const contactApi = apiFactory(getGatewayServiceUrl('api/candidate/contact'))
const deleteApi = apiFactory(getGatewayServiceUrl('api/candidate/delete'))
const companyDetails = apiFactory(getGatewayServiceUrl('api/company/details'))

const details = (id?: number) => {
  return companyDetails.get()
}

const create = (jobId: string, body: Candidate) => {
  return createApi.post<any>({jobId}, body)
}

const createApplicant = (Id: string, body: Candidate) => {
  return createApi.post<any>({Id}, body)
}

const createExternal = (jobId: string, recaptchaToken: string, body: Candidate) => {
  return createExternalApi.post<any>(undefined, body, {jobId, token: recaptchaToken})
}

const update = (candidateId: string, body: Candidate) => {
  return updateApi.put<any>(undefined, {candidateId}, body)
}

const contact = (candidateId: string, body?: ContactInfo) => {
  return contactApi.put<any>(undefined, {candidateId}, body)
}

const archive = (candidateId: string) => {
  return deleteApi.delete(undefined, {candidateId})
}

export {create, update, contact, archive, createExternal, createApplicant, details}
