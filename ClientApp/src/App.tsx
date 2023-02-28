import React, {memo} from 'react'
import {Provider} from 'react-redux'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import {store} from 'store/store'
import {ThemeProvider} from 'lib/styledComponents'
import {hrmangoTheme} from 'lib/hrmangoTheme'
import {Shell} from 'components/organism/shell'
import UserConfirmation from 'components/atom/userConfirmation/userConfirmation'
import {QueryClientProvider} from 'react-query'
//import {ReactQueryDevtools} from 'react-query/devtools'
import {ProtectedRoute} from 'container/organism/router'
import {queryClient} from './utility/reactQuery'
import {LoginPage} from 'components/page/loginPage'
import {ForgotPassword} from 'components/page/forgotPassword'
import {ResetPasswordInstructions} from 'components/page/resetPasswordInstructions'
import {ResetPassword} from 'components/page/ResetPassword/'
import {ResetPasswordSuccess} from 'components/page/ResetPasswordSuccess/'
import {WelcomeCompany} from 'components/page/WelcomeCompany/'
import {CreateNewAccount} from 'components/page/createNewAccount'
import {CreateAplicantAccount} from 'components/page/createAplicantAccount'
import {CreationSuccess} from 'components/page/creationSuccess'
import {ApplicantCreationSuccess} from 'components/page/applicantCreationSuccess'
import {CreateCompanyAccount} from 'components/page/createCompanyAccount'

const App = memo(
  () => {
    return (
      <Provider store={store}>
        <ThemeProvider theme={hrmangoTheme}>
          <React.Suspense fallback={'Loading...'}>
            <BrowserRouter getUserConfirmation={(message, callback) => UserConfirmation(message, callback)}>
              <QueryClientProvider client={queryClient}>
                <Switch>
                  <Route path='/login' component={LoginPage} />

                  <Route path='/forgotPassword' component={ForgotPassword} />
                  <Route path='/followEmailInstructions' component={ResetPasswordInstructions} />
                  <Route path='/resetPassword/:email/:token' component={ResetPassword} />
                  <Route path='/welcome/:companyId/:email/:contactName/' component={WelcomeCompany} />
                  <Route path='/resetPasswordSuccess/' component={ResetPasswordSuccess} />
                  <Route path='/createNewAccount/' component={CreateNewAccount} />
                  <Route path='/createAplicantAccount/' component={CreateAplicantAccount} />
                  <Route path='/creationSuccess/' component={CreationSuccess} />
                  <Route path='/applicantCreationSuccess/' component={ApplicantCreationSuccess} />
                  <Route path='/companyCreation/' component={CreateCompanyAccount} />

                  <ProtectedRoute component={Shell} />
                </Switch>
              </QueryClientProvider>
            </BrowserRouter>
          </React.Suspense>
        </ThemeProvider>
      </Provider>
    )
  },
  (prevProps, nextProps) => {
    if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
      return true
    }
    return false
  }
)

export default App
