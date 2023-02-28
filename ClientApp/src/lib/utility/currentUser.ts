import {UserState} from 'store/reducer/contextReducer'
import {ModalRoleEnums} from 'type/user/roles'

class CurrentUserCache {
  private UserId: number | undefined
  private UserEmail: string | undefined
  private UserName: string | undefined
  private Roles: Array<ModalRoleEnums> | undefined
  private CompanyId: number | undefined

  set user({userName, userEmail, userId, roles, companyId}: UserState) {
    if (userEmail) {
      this.UserEmail = userEmail
    }
    if (userName) {
      this.UserName = userName
    }
    if (userId) {
      this.UserId = userId
    }
    if (roles) {
      this.Roles = roles
    }
    if (companyId) {
      this.CompanyId = companyId
    }
  }

  get userEmail() {
    return this.UserEmail
  }

  get userName() {
    return this.UserName
  }

  get userId() {
    return this.UserId
  }

  get roles() {
    return this.Roles
  }

  get companyId() {
    return this.CompanyId
  }
}

export default new CurrentUserCache()
