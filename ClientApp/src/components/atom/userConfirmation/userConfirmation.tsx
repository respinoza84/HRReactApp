import ReactDOM from 'react-dom'
import {Dialog, DialogButtonType} from '../dialog/dialog'
import {ThemeProvider} from 'lib/styledComponents'
import {hrmangoTheme} from 'lib/hrmangoTheme'

/**
 * @name UserConfirmation
 * @description BrowserRouter andUserConfirmation is rendered a layer above
 * where our normal application is rendered
 */
const UserConfirmation = (message: string, callback: (ok: boolean) => void) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const closeModal = (callbackState: boolean) => {
    ReactDOM.unmountComponentAtNode(container)
    callback(callbackState)
  }

  const buttonOne: DialogButtonType = {
    onClick: () => closeModal(true),
    text: 'Proceed'
  }

  const buttonTwo: DialogButtonType = {
    onClick: () => closeModal(false),
    text: 'Cancel'
  }

  ReactDOM.render(
    <ThemeProvider theme={hrmangoTheme}>
      <Dialog onClose={() => closeModal(false)} description={message} buttonOne={buttonOne} buttonTwo={buttonTwo} />
    </ThemeProvider>,
    container
  )
}

export default UserConfirmation
