import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {globalReducer, GlobalState} from './globalReducer'
import {usersReducer, UsersState} from './usersReducer'
import {ContextState, contextReducer} from './contextReducer'

export interface IApplicationState {
  context: ContextState
  users: UsersState
  form: any
  global: GlobalState
}

// Code below takes Reducers and registers them with Redux
const rootReducer = combineReducers<IApplicationState>({
  context: contextReducer,
  users: usersReducer,
  global: globalReducer,
  form: formReducer
})

export {rootReducer}
