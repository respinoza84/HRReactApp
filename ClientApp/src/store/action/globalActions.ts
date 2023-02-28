/*
  @author Oliver Zamora
  @description Global actions
*/
import {ToastType, NavTabType} from 'lib/type/global/global'

const setSpinner = (loading: boolean) =>
  ({
    type: 'SET_SPINNER',
    payload: loading
  } as const)

const setSideNavOpen = (open: boolean) =>
  ({
    type: 'SET_SIDE_NAV_OPEN',
    payload: open
  } as const)

const resetGlobal = () =>
  ({
    type: 'RESET_GLOBAL'
  } as const)

const setToast = (payload: ToastType | ToastType[]) =>
  ({
    type: 'SET_TOAST',
    payload: payload
  } as const)

const setLogOut = (loading: boolean) =>
  ({
    type: 'SET_LOGOUT',
    payload: loading
  } as const)

const removeToast = (payload: ToastType) =>
  ({
    type: 'REMOVE_TOAST',
    payload: payload
  } as const)

const resetToasts = () =>
  ({
    type: 'RESET_TOASTS'
  } as const)

const setNavTabs = (payload: NavTabType[]) =>
  ({
    type: 'SET_NAV_TABS',
    payload: payload
  } as const)

const setActiveTab = (payload: string) =>
  ({
    type: 'SET_ACTIVE_NAV_TABS',
    payload: payload
  } as const)

export type GlobalActions = ReturnType<
  | typeof setSpinner
  | typeof resetGlobal
  | typeof setToast
  | typeof removeToast
  | typeof resetToasts
  | typeof setSideNavOpen
  | typeof setNavTabs
  | typeof setActiveTab
  | typeof setLogOut
>

export {
  setSpinner,
  resetGlobal,
  setToast,
  removeToast,
  resetToasts,
  setSideNavOpen,
  setNavTabs,
  setActiveTab,
  setLogOut
}
