import {Reducer} from 'redux'
import {NavigationItem} from 'api'
import {PageHeader} from 'type'
import {ContextActions} from 'store/action/contextActions'
import {ModalRoleEnums} from 'type/user/roles'

type SideNavigation = {
  items: NavigationItem[]
}

export type UserState = {
  userId?: number
  roles: ModalRoleEnums[]
  userName?: string
  userEmail?: string
  companyId?: number
}

type PageHeaderType = {
  pageModule?: PageHeader
  isBeta?: boolean
}

export type ContextState = {
  user: UserState
  sideNavigation: SideNavigation
  isIe11: boolean
  pageHeader: PageHeaderType
}

const initialState: ContextState = {
  user: {
    roles: []
  },
  sideNavigation: {
    items: []
  },
  isIe11: false,
  pageHeader: {
    pageModule: '',
    isBeta: false
  }
}

const contextReducer: Reducer<ContextState, ContextActions> = (state = initialState, action) => {
  switch (action.type) {
    case '@@context/USER_LOAD':
      return {
        ...state,
        user: action.payload
      }
    case '@@context/SIDE_NAVIGATION_LOAD':
      return {
        ...state,
        sideNavigation: {
          ...state.sideNavigation,
          items: action.payload
        }
      }
    case '@@context/SET_IE11':
      return {
        ...state,
        isIe11: action.payload
      }
    case '@@context/SET_PAGE_HEADER': {
      return {
        ...state,
        pageHeader: {
          pageModule: action.payload
        }
      }
    }
    // eslint-disable-next-line no-fallthrough
    default:
      return state
  }
}

export {contextReducer}
