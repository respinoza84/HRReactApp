import {useContext, useEffect} from 'react'
import {__RouterContext} from 'react-router'
import {useForceUpdate} from './useForceUpdate'

const useReactRouter = () => {
  if (!__RouterContext) {
    throw new Error('useReactRouter may only be used with react-router@^5.')
  }
  const routerContext = useContext(__RouterContext)
  if (!routerContext) {
    throw Error('useReactRouter may only be called within a <Router /> context.')
  }

  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const unsubscribe = routerContext.history.listen(forceUpdate)

    return unsubscribe
  }, [forceUpdate, routerContext])

  return routerContext
}

export {useReactRouter}
