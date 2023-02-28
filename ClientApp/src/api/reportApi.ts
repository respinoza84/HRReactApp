/*
  @author Oliver Zamora
  @description Reports API
*/
import {getGatewayServiceUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'

const companiesXlsApi = apiFactory(getGatewayServiceUrl('api/report/exportCompaniesXlsx'))
const companiesPdfApi = apiFactory(getGatewayServiceUrl('api/report/exportCompaniesPdf'))

const jobsXlsApi = apiFactory(getGatewayServiceUrl('api/report/exportJobsXlsx'))
const jobsPdfApi = apiFactory(getGatewayServiceUrl('api/report/exportJobsPdf'))

const applicantsXlsApi = apiFactory(getGatewayServiceUrl('api/report/exportApplicantsXlsx'))
const applicantsPdfApi = apiFactory(getGatewayServiceUrl('api/report/exportApplicantsPdf'))

const metricsXlsApi = apiFactory(getGatewayServiceUrl('api/report/exportMetricsXlsx'))
const metricsPdfApi = apiFactory(getGatewayServiceUrl('api/report/exportMetricsPdf'))

const companiesXls = (fromDate?: Date, toDate?: Date) => {
  return companiesXlsApi.post<any>({}, {fromDate, toDate})
}

const companiesPdf = (fromDate?: Date, toDate?: Date) => {
  return companiesPdfApi.post<any>({}, {fromDate, toDate})
}

const jobsXls = (fromDate?: Date, toDate?: Date) => {
  return jobsXlsApi.post<any>({}, {fromDate, toDate})
}

const jobsPdf = (fromDate?: Date, toDate?: Date) => {
  return jobsPdfApi.post<any>({}, {fromDate, toDate})
}

const applicantsXls = (fromDate?: Date, toDate?: Date) => {
  return applicantsXlsApi.post<any>({}, {fromDate, toDate})
}

const applicantsPdf = (fromDate?: Date, toDate?: Date) => {
  return applicantsPdfApi.post<any>({}, {fromDate, toDate})
}

const metricsXls = (fromDate?: Date, toDate?: Date, jobName?: any) => {
  return metricsXlsApi.post<any>({}, {fromDate, toDate, jobName})
}

const metricsPdf = (fromDate?: Date, toDate?: Date, jobName?: any) => {
  return metricsPdfApi.post<any>({}, {fromDate, toDate, jobName})
}

export {companiesXls, companiesPdf, jobsXls, jobsPdf, applicantsXls, applicantsPdf, metricsXls, metricsPdf}
