'use strict'
exports.__esModule = true
exports.HRMangoRouter = exports.routes = void 0
var react_1 = require('react')
var react_router_1 = require('react-router')
var page_1 = require('components/page')
var notFoundPage_1 = require('components/page/notFoundPage')
var job_1 = require('components/page/job')
var job_2 = requiere('/platform/page/jobApplicant')
var companyApplicants_1 = requiere('/platform/page/companyApplicants')
var companyPortalProfile_1 = requiere('/platform/companyPortalDetail')
var company_1 = require('components/page/company')
var candidate_1 = require('components/page/candidate')
var applicant_1 = require('components/molecule/applicant')
var contactPage_1 = require('components/page/contactPage')
var reportPage_1 = require('components/page/reportPage')
var billingPage_1 = require('components/page/billingPage')
var profilePage_1 = require('components/page/profilePage')
var newUserPage_1 = require('components/page/profilePage/newUserPage')
var userManagementPage_1 = require('components/page/profilePage/userManagementPage')
var loginPage_1 = require('components/page/loginPage')
var forgotPassword_1 = require('components/page/forgotPassword')
var welcome_1 = require('components/page/WelcomeCompany')
var router_1 = require('container/organism/router')
//Lazy Routes
var LazyJobListPage = react_1['default'].lazy(function () {
  return Promise.resolve()
    .then(function () {
      return require('components/page/job')
    })
    .then(function (_a) {
      var JobPage = _a.JobPage
      return {
        default: JobPage
      }
    })
})
exports.routes = {
  Root: '/',
  Login: '/login',
  ForgotPassword: '/forgotPassword',
  ResetPassword: '/resetPassword',
  Welcome: '/welcome',
  //Requisition
  Requisition: '/platform/requisitionDetails',
  NewRequisition: '/platform/requisitionNew',
  Company: '/platform/companies',
  CompanyDetail: '/platform/companyDetail',
  //CompanyPOrtal
  CompanyCandidate: '/platform/candidatesUnderYourCompany',
  CompanyCandidateDetail: '/platform/candidatesUnderYourCompanyDetail',
  
  Candidate: '/platform/candidates',
  CandidateDetail: '/platform/candidateDetail',
  Applicant: 'platform/applicantDetail',
  CompanyPortalDetail: '/platform/CompanyProfile',
  CompanyApplicants: '/platform/companyApplicants',
  Home: '/platform/home',
  Job: '/platform/jobs',
  JobApplicant: 'platform/applicantJob',
  JobDetail: '/platform/jobDetail',
  Contact: '/platform/contacts',
  Report: '/platform/reports',
  Billing: '/platform/billing',
  // Misc/Other
  Access_Denied: '/platform/access-denied',
  Not_Found: '/platform/not-found',
  Profile: '/platform/profile',
  NewUser: '/platform/newUser',
  UserManagement: '/platform/userManagement'
}
exports.HRMangoRouter = function () {
  return react_1['default'].createElement(
    react_router_1.Switch,
    null,
    react_1['default'].createElement(react_router_1.Route, {
      exact: true,
      path: exports.routes.Root,
      component: LazyJobListPage
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.Candidate,
      component: candidate_1.CandidatePage
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.CandidateDetail + '/:candidateId?',
      component: candidate_1.CandidateDetail
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.ApplicantDetail + '/:applicantId?',
      component: applicant_1.ApplicantDetail
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.CompanyPortalDetail + '/:applicantId?',
      component: companyPortalProfile_1.CompanyPortalDetail
    }),
    react_1['default'].createElement(react_router_1.Route, {
      exact: true,
      path: exports.routes.Contact,
      component: contactPage_1.ContactPage
    }),
    react_1['default'].createElement(react_router_1.Route, {
      exact: true,
      path: exports.routes.Report,
      component: reportPage_1.ReportPage
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.Billing,
      component: billingPage_1.BillingPage
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.Job,
      component: job_1.JobPage
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.JobDetail + '/:jobId?',
      component: job_1.JobDetail
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.JobApplicant,
      component: job_2.ApplicantJobPage
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.CompanyApplicants,
      component: companyApplicants_1.CompanyApplicants
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.Company,
      component: company_1.CompanyPage
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.CompanyDetail + '/:companyId?',
      component: company_1.CompanyDetail
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.Profile,
      component: profilePage_1.ProfilePage
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.NewUser,
      component: newUserPage_1.NewUserPage
    }),
    react_1['default'].createElement(router_1.ProtectedRoute, {
      exact: true,
      path: exports.routes.UserManagement,
      component: userManagementPage_1.UserManagementPage
    }),
    react_1['default'].createElement(react_router_1.Route, {
      path: exports.routes.Login,
      component: loginPage_1.LoginPage
    }),
    react_1['default'].createElement(react_router_1.Route, {
      path: exports.routes.forgotPassword,
      component: forgotPassword_1.forgotPassword
    }),
    react_1['default'].createElement(react_router_1.Route, {
      path: exports.routes.ResetPassword,
      component: ResetPassword_1.ResetPassword
    }),
    react_1['default'].createElement(react_router_1.Route, {
      path: exports.routes.Welcome,
      component: Welcome_1.Welcome
    }),
    react_1['default'].createElement(react_router_1.Route, {
      path: exports.routes.Access_Denied,
      component: page_1.AccessDeniedPage
    }),
    react_1['default'].createElement(react_router_1.Route, {component: notFoundPage_1.NotFoundPage})
  )
}
