/*
  @author Oliver Zamora
  @description global spinner and messaging
*/
import {memo} from 'react'
import {useSelector, shallowEqual} from 'react-redux'

import {Toasts} from 'lib/molecule/toasts'
import {Spinner} from 'lib/molecule/spinner'
import {LogOut} from 'lib/molecule/logOut'

import {IApplicationState} from 'store/reducer'

export const Global = memo(
  () => {
    const {spinCounter, toasts} = useSelector((state: IApplicationState) => state.global, shallowEqual)

    return (
      <>
        <Toasts toasts={toasts} />
        <Spinner wholePage={true} transparent={true} show={!!spinCounter} />
        <LogOut />
      </>
    )
  },
  (prevProps, nextProps) => {
    if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
      return true
    }
    return false
  }
)
