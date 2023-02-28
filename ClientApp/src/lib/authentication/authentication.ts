import jwt_decode from 'jwt-decode'
import {HRMANGO_AUTH_COOKIE, HRMANGO_REFRESH_COOKIE} from '../constants/authenticationConstants'
import Cookie from 'js-cookie'

const removeToken = (tokenType: string = HRMANGO_AUTH_COOKIE) => {
  document.cookie = `${tokenType}=;expires=Thu, 01 Jan 1970 00:00:01 GMT`
  caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))))
  // Makes sure the page reloads. Changes are only visible after you refresh.
  localStorage.clear()
  // window.location.reload(true)
  window.location.replace('/login')
}

const getToken = (tokenType: string = HRMANGO_AUTH_COOKIE) => Cookie.get(tokenType)
const getRefresh = (tokenType: string = HRMANGO_REFRESH_COOKIE) => Cookie.get(tokenType)

const isExpired = (jwt: any) => jwt.exp > Date.now() / 10000

const isAuthenticated = (tokenType?: string) => {
  const token = getToken(tokenType)

  try {
    return token && isExpired(jwt_decode(token))
  } catch {
    return false
  }
}

const loginRedirect = () => window.location.replace('/login')

export {getToken, getRefresh, isExpired, isAuthenticated, loginRedirect, removeToken}
