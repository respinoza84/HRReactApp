import React from 'react'
import {Switch, Route} from 'react-router'
import {AccessDeniedPage} from 'components/page'
import {NotFoundPage} from 'components/page/notFoundPage'
import {JobPage, JobDetail} from 'components/page/job'
import {JobCompanyDetail} from 'components/page/job/company'
import {ApplicantJobPage} from 'components/page/jobApplicant'
import {CompanyApplicants} from 'components/page/companyApplicants'
import {HomePage} from 'components/page/home/homePage'
import {CompanyPage, CompanyDetail} from 'components/page/company'
import {CandidatePage, CandidateDetail} from 'components/page/candidate'
import {ApplicantDetail} from 'components/molecule/applicant'
import {CompanyPortalDetail} from 'components/molecule/companyPortal'
import {ContactPage} from 'components/page/contactPage'
import {ReportPage} from 'components/page/reportPage'
import {BillingPage} from 'components/page/billingPage'
import {BillingReport} from 'components/molecule/report/billingReport'
import {InvoiceDetail} from 'components/molecule/billing/invoice'

import {ProfilePage} from 'components/page/profilePage'
import {NewUserPage} from 'components/page/profilePage/newUserPage'
import {UserManagementPage} from 'components/page/profilePage/userManagementPage'

import {LoginPage} from 'components/page/loginPage'

import {ProtectedRoute} from 'container/organism/router'
import {CandidateCompanyDetail, CandidateCompanyPage} from 'components/page/candidate/companyPortal/'

//Lazy Routes
const LazyJobListPage = React.lazy(() => {
  return import('components/page/job').then(({JobPage}) => ({
    default: JobPage
  }))
})

export const routes = {
  Root: '/',
  Login: '/login',

  //Requisition
  Requisition: '/platform/requisitionDetails',
  NewRequisition: '/platform/requisitionNew',

  Company: '/platform/companies',
  CompanyDetail: '/platform/companyDetail',
  CompanyPortalAddNewJobDetail: '/platform/companyPortalDetail',
  Candidate: '/platform/candidates',
  CandidateDetail: '/platform/candidateDetail',

  CompanyCandidate: '/platform/candidatesUnderCompany',
  CompanyCandidateDetail: '/platform/candidatesUnderYourCompanyDetail',

  ApplicantDetail: '/platform/applicantDetail',
  CompanyPortalDetail: '/platform/CompanyProfile',
  Home: '/platform/home',
  Job: '/platform/jobs',
  JobDetail: '/platform/jobDetail',
  JobCompanyDetail: '/platform/jobCompanyDetail',
  ApplicantJobPage: '/platform/jobApplicant',
  CompanyApplicants: '/platform/companyApplicants',
  Contact: '/platform/contacts',
  Report: '/platform/reports',
  BillingReport: '/platform/invoices',
  Invoice: '/platform/invoice',

  Billing: '/platform/billing',

  // Misc/Other
  Access_Denied: '/platform/access-denied',
  Not_Found: '/platform/not-found',
  Profile: '/platform/profile',
  NewUser: '/platform/newUser',
  UserManagement: '/platform/userManagement'
} as const

export const HRMangoRouter = () => (
  <Switch>
    {/* root route */}
    <Route exact path={routes.Root} component={LazyJobListPage} />
    <ProtectedRoute exact path={routes.Candidate} component={CandidatePage} />
    <ProtectedRoute exact path={`${routes.CandidateDetail}/:candidateId?`} component={CandidateDetail} />
    <ProtectedRoute exact path={routes.CompanyCandidate} component={CandidateCompanyPage} />
    <ProtectedRoute exact path={`${routes.CompanyCandidateDetail}/:candidateId?`} component={CandidateCompanyDetail} />
    <ProtectedRoute exact path={`${routes.ApplicantDetail}/:applicantId?`} component={ApplicantDetail} />
    <ProtectedRoute exact path={`${routes.CompanyPortalDetail}/:applicantId?`} component={CompanyPortalDetail} />
    <Route exact path={routes.Contact} component={ContactPage} />
    <Route exact path={routes.Report} component={ReportPage} />
    <ProtectedRoute exact path={routes.Billing} component={BillingPage} />
    <ProtectedRoute exact path={routes.Job} component={JobPage} />
    <ProtectedRoute exact path={routes.ApplicantJobPage} component={ApplicantJobPage} />
    <ProtectedRoute exact path={routes.CompanyApplicants} component={CompanyApplicants} />

    <ProtectedRoute exact path={routes.Home} component={HomePage} />
    <ProtectedRoute exact path={`${routes.JobDetail}/:jobId?`} component={JobDetail} />
    <ProtectedRoute exact path={`${routes.JobCompanyDetail}/:jobId?`} component={JobCompanyDetail} />

    {/* <ProtectedRoute exact path={`${routes.JobApplicantDetail}/:jobId?`} component={JobApplicantDetail} /> */}

    <ProtectedRoute exact path={routes.Company} component={CompanyPage} />
    <ProtectedRoute exact path={`${routes.CompanyDetail}/:companyId?`} component={CompanyDetail} />
    {/* <ProtectedRoute exact path={routes.Company} component={CompanyPortalPage} /> */}
    {/* <ProtectedRoute exact path={`${routes.CompanyPortalAddNewJobDetail}/:companyId?`} component={CompanyPortalDetail} /> */}
    <ProtectedRoute exact path={routes.BillingReport} component={BillingReport} />
    <ProtectedRoute exact path={`${routes.Invoice}/:invoiceNumber?`} component={InvoiceDetail} />

    <ProtectedRoute exact path={routes.Profile} component={ProfilePage} />
    <ProtectedRoute exact path={routes.NewUser} component={NewUserPage} />
    <ProtectedRoute exact path={routes.UserManagement} component={UserManagementPage} />
    <Route path={routes.Login} component={LoginPage} />

    {/* fallout routes */}
    <Route path={routes.Access_Denied} component={AccessDeniedPage} />
    <Route component={NotFoundPage} />
  </Switch>
)
