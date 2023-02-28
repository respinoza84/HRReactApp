import {store} from 'store/store'
import {loadUserFromJwt, initApp, setIsIe11} from 'store/action/contextActions'
import {getToken, isAuthenticated, loginRedirect, removeToken} from 'lib/authentication/authentication'
import CurrentUserCache from 'lib/utility/currentUser'
import {isBrowserIE11} from './lib/utility/utility'
import {LOGIN_URL} from 'lib/constants/urls'
import {setLogOut} from 'store/action/globalActions'

const init = (): Promise<any> => {
  if (window.location.href.includes(LOGIN_URL)) {
    const dispatch = store.dispatch
    return Promise.all([dispatch])
  }
  if (!isAuthenticated()) {
    if (window.location.href.includes('resetpassword')) {
      const dispatch = store.dispatch
      return Promise.all([dispatch])
    }
    if (window.location.href.includes('platform')) {
      removeToken()
      return Promise.resolve(loginRedirect())
    }

    const dispatch = store.dispatch
    dispatch(setLogOut(true))

    return Promise.all([dispatch])
  } else {
    const dispatch = store.dispatch
    const usersAction = loadUserFromJwt(getToken()) as ReturnType<typeof loadUserFromJwt>
    // Set CurrentUser Singleton
    CurrentUserCache.user = usersAction.payload
    dispatch(usersAction)
    dispatch(setIsIe11(isBrowserIE11()))

    dispatch(initApp())

    return Promise.all([dispatch])
  }
}

export {init}
