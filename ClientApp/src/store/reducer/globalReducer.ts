/*
  @author Oliver Zamora
  @description global reducer
*/
import {Reducer} from 'redux'

import {GlobalActions} from 'store/action/globalActions'
import {defaultErrorMsg} from 'lib/hrmangoTheme'

import {ToastType, NavTabType} from 'lib/type/global/global'

export type GlobalState = {
  spinCounter: number
  toasts: ToastType[]
  sideNavOpen: number
  navTabs: NavTabType[]
  toastCounter: number
  logOut: boolean
}

const initialState: GlobalState = {
  spinCounter: 0,
  toasts: [],
  sideNavOpen: 0,
  navTabs: [],
  toastCounter: 0,
  logOut: false
}

export const globalReducer: Reducer<GlobalState> = (state = initialState, action) => {
  switch ((action as GlobalActions).type) {
    case 'SET_SPINNER':
      let spinCounter = state.spinCounter
      action.payload ? spinCounter++ : spinCounter > 0 ? spinCounter-- : (spinCounter = 0)

      return {
        ...state,
        spinCounter: spinCounter
      }
    case 'SET_SIDE_NAV_OPEN':
      let sideNavOpen = state.sideNavOpen
      action.payload ? sideNavOpen++ : sideNavOpen > 0 ? sideNavOpen-- : (sideNavOpen = 0)

      return {
        ...state,
        sideNavOpen: sideNavOpen
      }
    case 'SET_TOAST':
      const {payload} = action
      let updatedToasts
      let toastId = state.toastCounter

      if (payload.type === 'error' && !payload.message) {
        payload.message = defaultErrorMsg
      }

      if (Array.isArray(payload)) {
        payload?.forEach((toast) => {
          toast.id = toastId
          toastId += 1
        })

        updatedToasts = [...payload, ...state.toasts]
      } else {
        payload.id = toastId
        updatedToasts = [payload, ...state.toasts]
      }

      return {
        ...state,
        toasts: updatedToasts,
        toastCounter: toastId += 1
      }
    case 'SET_LOGOUT':
      return {
        ...state,
        logOut: action.payload
      }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast !== action.payload)
      }
    case 'RESET_TOASTS':
      return {
        ...state,
        toasts: [],
        toastCounter: 0
      }
    case 'SET_NAV_TABS':
      return {
        ...state,
        navTabs: action.payload
      }
    case 'SET_ACTIVE_NAV_TABS':
      const navTabActive = state.navTabs.map((item) => {
        if (item.id === action.payload) {
          item.active = true
        } else {
          item.active = false
        }

        return item
      })
      return {
        ...state,
        navTabs: navTabActive
      }
    case 'RESET_GLOBAL':
      return initialState
    default:
      return state
  }
}
