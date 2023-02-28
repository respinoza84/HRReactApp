import {UserState} from 'store/reducer/contextReducer'
import jwt_decode from 'jwt-decode'
import {ensureArray} from 'utility/convertUtility'
import {PageHeader} from 'type'
import {NavigationItem} from 'api'

export type AppInit = {
  type: '@@context/INIT_APP'
}

const userFromJwt = (jwt: any) => ({
  roles: ensureArray(jwt.role),
  userName: jwt.given_name,
  userId: jwt.userId,
  userEmail: jwt.unique_name,
  companyId: jwt.companyId
})

const userFromJwtString = (jwt: string): UserState => userFromJwt(jwt_decode(jwt))

const initApp = () =>
  ({
    type: '@@context/INIT_APP'
  } as AppInit)

const loadUserFromJwt = (jwt: string) =>
  ({
    type: '@@context/USER_LOAD',
    payload: userFromJwtString(jwt)
  } as const)

const LoadNavigation = (items: NavigationItem[]) =>
  ({
    type: '@@context/SIDE_NAVIGATION_LOAD',
    payload: items
  } as const)

const setIsIe11 = (isIE11: boolean) =>
  ({
    payload: isIE11,
    type: '@@context/SET_IE11'
  } as const)

const updatePageHeader = (pageModule: PageHeader) =>
  ({
    payload: pageModule,
    type: '@@context/SET_PAGE_HEADER'
  } as const)

const resetPageHeader = () =>
  ({
    payload: '',
    type: '@@context/SET_PAGE_HEADER'
  } as const)

export type ContextActions =
  | AppInit
  | ReturnType<
      | typeof loadUserFromJwt
      | typeof LoadNavigation
      | typeof setIsIe11
      | typeof updatePageHeader
      | typeof resetPageHeader
    >

export {initApp, LoadNavigation, loadUserFromJwt, setIsIe11, updatePageHeader, resetPageHeader, userFromJwtString}
