import {Reducer} from 'redux'
import {User} from 'type'
import {UsersActions} from 'store/action/usersActionTypes'

export type UsersState = {
  organizationUsers: User[]
}

const initialState: UsersState = {
  organizationUsers: []
}

// A reducer is a single function that handles the action
// based on the action type.
const usersReducer: Reducer<UsersState, UsersActions> = (state = initialState, action) => {
  switch ((action as UsersActions).type) {
    case '@@users/ORG_USERS_LOAD':
      return {
        ...state,
        organizationUsers: action.payload
      } as UsersState
    default:
      return state
  }
}

export {usersReducer}
