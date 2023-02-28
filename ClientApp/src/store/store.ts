import {Store as ReduxStore, createStore, applyMiddleware} from 'redux'
import {rootReducer, IApplicationState} from './reducer'
import {composeWithDevTools} from 'redux-devtools-extension'
import {createEpicMiddleware} from 'redux-observable'

const epicMiddleware = createEpicMiddleware()

const middleware = applyMiddleware(epicMiddleware)

const store: ReduxStore<IApplicationState> = createStore(rootReducer, composeWithDevTools(middleware))

export {store}
