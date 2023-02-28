/*
  @author Oliver Zamora
  @description external app component for customers only
*/

import {memo, StrictMode, Suspense} from 'react'
import {ThemeProvider} from 'lib/styledComponents'
import {BrowserRouter, Route} from 'react-router-dom'
import {QueryClientProvider} from 'react-query'
import {store} from 'store/store'
import {hrmangoTheme} from 'lib/hrmangoTheme'
import {queryClient} from './utility/reactQuery'
import {Provider} from 'react-redux'
import {ExternalShell} from 'components/organism/shell/externalShell'

const ExternalApp = memo(
  () => {
    return (
      <StrictMode>
        <Provider store={store}>
          <ThemeProvider theme={hrmangoTheme}>
            <Suspense fallback={'Loading...'}>
              <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                  <Route component={ExternalShell} />
                </QueryClientProvider>
              </BrowserRouter>
            </Suspense>
          </ThemeProvider>
        </Provider>
      </StrictMode>
    )
  },
  (prevProps, nextProps) => {
    if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
      return true
    }
    return false
  }
)

export default ExternalApp
