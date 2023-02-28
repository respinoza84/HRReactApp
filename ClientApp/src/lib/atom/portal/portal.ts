import * as React from 'react'
import * as ReactDOM from 'react-dom'

const el = document.createElement('div')
const modalRoot = document.createElement('div')
modalRoot.id = 'hrmango-portal-root'

window.onload = function () {
  // document.body was null in angular, so appendChild would throw
  document.body.appendChild(modalRoot)
}
class Portal extends React.Component {
  constructor(props: Readonly<{}>) {
    super(props)
    document.body.appendChild(modalRoot)
  }

  componentWillUnmount = () => modalRoot.removeChild(el)

  componentDidMount = () => modalRoot.appendChild(el)

  render() {
    const props = this.props

    return ReactDOM.createPortal(props.children, el)
  }
}

export {Portal}
