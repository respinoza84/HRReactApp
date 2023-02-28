import {NotFoundPage} from 'components/page/notFoundPage'
import {Switch, Route} from 'react-router'
import {JobDetailPage} from 'components/page/career/jobDetailPage'
import {ApplicantPage} from 'components/page/career/applicantPage'
import {CarrerPage} from 'components/page/career/careerPage'

export const externalRoutes = {
  JobList: '/careers/jobs',
  JobDetail: '/careers/jobDetail',
  JobApplicant: '/careers/job/applicant',
  Not_Found: '/not-found'
} as const

export const ExternalRouter = () => (
  <Switch>
    <Route exact path={externalRoutes.JobList} component={CarrerPage} />
    <Route exact path={`${externalRoutes.JobDetail}/:jobId?`} component={JobDetailPage} />
    <Route exact path={externalRoutes.JobApplicant} component={ApplicantPage} />
    <Route component={NotFoundPage} />
  </Switch>
)
