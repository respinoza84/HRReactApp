import './polyfill'
import * as ReactDOM from 'react-dom'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import * as WebFont from 'webfontloader'
import {CAREERS_URL} from 'lib/constants/urls'

WebFont.load({
  google: {
    families: ['Roboto:300,400,600,700']
  },
  active: () => {
    if (window.location.href.includes(CAREERS_URL)) {
      import('./externalApp').then((externalApp) => {
        const ExternalApp = externalApp.default
        ReactDOM.render(<ExternalApp />, document.getElementById('root') as HTMLElement)
      })
    } else {
      import('./appInitializer').then((appInitializer) => {
        appInitializer.init().then(() => {
          import('./App').then((App) => {
            const MainApp = App.default
            ReactDOM.render(<MainApp />, document.getElementById('root') as HTMLElement)
          })
        })
      })
    }

    registerServiceWorker()
  }
})
