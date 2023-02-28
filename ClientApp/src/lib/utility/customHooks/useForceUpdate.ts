import {useCallback, useReducer, useEffect} from 'react'

const reducer = (state: boolean, action: null): boolean => !state

const useForceUpdate = (): (() => void) => {
  const [, dispatch] = useReducer(reducer, true)

  // Turn dispatch(required_parameter) into dispatch().
  const memoizedDispatch = useCallback((): void => {
    dispatch(null)
  }, [dispatch])

  return memoizedDispatch
}

const useForceUpdateOnDeps = (deps: any[]) => {
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    forceUpdate()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

export {useForceUpdate, useForceUpdateOnDeps}
