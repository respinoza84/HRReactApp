/*
  @author Oliver Zamora
  @description Job API
*/
import {getGatewayServiceUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'
import {Applicant, Job} from 'graphql/types.generated'

const createApi = apiFactory(getGatewayServiceUrl('api/job/create'))
const updateApi = apiFactory(getGatewayServiceUrl('api/job/update'))
const deleteApi = apiFactory(getGatewayServiceUrl('api/job/delete'))
const addCandidateApi = apiFactory(getGatewayServiceUrl('api/job/applicant/add'))
const deleteCandidateApi = apiFactory(getGatewayServiceUrl('api/job/applicant/delete'))
const stageApi = apiFactory(getGatewayServiceUrl('api/job/stage'))

const create = (body: Job) => {
  return createApi.post<any>(undefined, body)
}

const update = (id: number, body: Job) => {
  return updateApi.put<any>(id, undefined, body)
}

const archive = (id: number) => {
  return deleteApi.delete(id, undefined)
}

const addCandidate = (jobId: string, candidateId: string, body: Applicant) => {
  return addCandidateApi.post({jobId, candidateId}, body)
}

const deleteCandidate = (jobId: string, candidateId: string) => {
  return deleteCandidateApi.delete(undefined, {jobId, candidateId})
}

const stageChange = (body: Applicant) => {
  return stageApi.post({candidateId: body.candidateId?.toString() ?? '0'}, body)
}
export {create, update, archive, addCandidate, deleteCandidate, stageChange}
