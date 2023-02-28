/*
  @author Oliver Zamora
  @description Auth API
*/
import {getAuthServiceUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'
import {
  ResetPassword,
  ResetPasswordExternal,
  createApplicantAccount,
  resetCompanyPasswordForNewUSer
} from 'type/resetPassword'
import {User} from 'type/user/user'
import {RefreshPayload} from 'type/security'

const loginApi = apiFactory(getAuthServiceUrl('api/login'), false)
const forgotPassword = apiFactory(getAuthServiceUrl('api/profile/forgot-password'))
const resetPassword = apiFactory(getAuthServiceUrl('api/profile/reset-password'))
const createAplicantAccount = apiFactory(getAuthServiceUrl('api/profile/create-applicant-account'))

const logoutApi = apiFactory(getAuthServiceUrl('api/login/logout'))
const profileApi = apiFactory(getAuthServiceUrl('api/profile/profile-info'))
const createUserApi = apiFactory(getAuthServiceUrl('api/profile/create-user'))
const updateUserApi = apiFactory(getAuthServiceUrl('api/profile/update-user'))
const resetPasswordApi = apiFactory(getAuthServiceUrl('api/profile/update-profile-password'))
const refresh = apiFactory(getAuthServiceUrl('api/token/refresh'))
const refreshToken = (refreshPayload: RefreshPayload) => refresh.postI<any>({}, refreshPayload)
const resetPasswordCompanyUSer = apiFactory(getAuthServiceUrl('api/profile/reset-password-company-user'))
const getLogin = (username: string, password: string) => {
  return loginApi.postI<any>(
    {},
    {
      username: username,
      password: password
    }
  )
}
const forgotPasswordService = (email: string) => {
  return forgotPassword.postI<any>(
    {},
    {
      email: email
    }
  )
}

const resetPasswordService = (body: ResetPasswordExternal) => {
  return resetPassword.put<ResetPasswordExternal>(undefined, {}, body)
}

const createAplicantAccountService = (body: createApplicantAccount) => {
  return createAplicantAccount.post<createApplicantAccount>(undefined, body)
}

const resetPasswordForCompanyUserService = (body: resetCompanyPasswordForNewUSer) => {
  return resetPasswordCompanyUSer.post<resetCompanyPasswordForNewUSer>(undefined, body)
}

const logout = () => {
  return logoutApi.post<any>({}, {})
}

const getProfileInfo = () => {
  return profileApi.get<User>({}, {})
}

const createUser = (user: User) => {
  return createUserApi.post<any>({}, user)
}

const updateUser = (user: User) => {
  return updateUserApi.post<any>({}, user)
}

const putResetPassword = (body: ResetPassword) => {
  return resetPasswordApi.put<ResetPassword>(undefined, {}, body)
}

export {
  getLogin,
  getProfileInfo,
  putResetPassword,
  logout,
  refreshToken,
  createUser,
  updateUser,
  forgotPasswordService,
  resetPasswordService,
  createAplicantAccountService,
  resetPasswordForCompanyUserService
}
