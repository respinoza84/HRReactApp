import {Action} from 'redux'
import {User} from 'type'

type UsersActionTypes = '@@users/ORG_USERS_LOAD' | '@@users/ORG_USERS_LOADED'

export type LoadOrganizationUsers = Action<UsersActionTypes> & {
  type: '@@users/ORG_USERS_LOAD'
  payload: User[]
}

export type UsersActions = LoadOrganizationUsers
