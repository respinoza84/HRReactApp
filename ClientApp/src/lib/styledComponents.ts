import * as styledComponents from 'styled-components'
import {ThemedStyledComponentsModule} from 'styled-components'
//import {ITheme} from './hrmangoTheme'

const {
  default: styled,
  css,
  keyframes,
  ThemeProvider,
  ThemeConsumer,
  ThemeContext,
  createGlobalStyle
} = styledComponents as ThemedStyledComponentsModule<any>

export {css, keyframes, ThemeProvider, ThemeConsumer, ThemeContext, createGlobalStyle}

export default styled
