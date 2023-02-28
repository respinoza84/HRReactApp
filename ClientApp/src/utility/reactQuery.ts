import {DEFAULT_HEADERS, withJwtHeader} from 'lib/utility/api'
import {QueryCache, QueryClient} from 'react-query'
import {setToast} from 'store/action/globalActions'
import {store} from 'store/store'
import {config} from '../config'
import {loginRedirect} from 'lib/authentication/authentication'

// Create a client
const defaultQueryClientOptions = {
  defaultOptions: {
    queries: {
      // Stay Fresh for 30 min
      staleTime: 1000 * 60 * 30,
      retry: 1
    }
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error.message.includes('The current user is not authorized to access this resource'))
        Promise.resolve(loginRedirect())

      store.dispatch(
        setToast({
          type: 'error'
        })
      )
    }
  })
}

export const queryClient = new QueryClient(defaultQueryClientOptions)

const fetcherGenerator = (gqlUrl: string) => <TData, TVariables>(
  query: string,
  variables?: TVariables
): (() => Promise<TData>) => {
  return async () => {
    const res = await fetch(gqlUrl, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        ...withJwtHeader()
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    const json = await res.json()

    if (json.errors) {
      const {message} = json.errors[0] || 'Error..'
      throw new Error(message)
    }

    return json.data
  }
}

// custom fetchers for generator
export const fetchData = fetcherGenerator(config.gatewayGraphUrl ?? '')
