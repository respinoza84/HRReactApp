export type ResetPassword = {
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
  fullName?: string
}
export type ResetPasswordExternal = {
  token: string
  email: string
  newPassword: string
  confirmPassword: string
}

export type createApplicantAccount = {
  email: string
  roles: string[]
  newPassword: string
  confirmPassword: string
}

export type resetCompanyPasswordForNewUSer = {
  email: string
  newPassword: string
  confirmPassword: string
}
