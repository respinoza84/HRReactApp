export type User = {
  email: string
  firstName: string
  id?: number
  lastName: string
  phoneNumber?: string
  avatarUrl?: string
  fullName?: string
  title?: string
  roles?: Array<string>
  passwordReset?: boolean
  isAccountClosed?: boolean
  companyId?: string
}
