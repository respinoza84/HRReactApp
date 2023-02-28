import styled from 'lib/styledComponents'
import {fadeOut, fadeIn} from 'lib/atom/animation/animation'

const OverlayStyled = styled.div<{exiting: boolean}>`
  z-index: 5000;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  animation: ${(props) => (props.exiting ? fadeOut : fadeIn)} 350ms ease-in forwards;
`

export {OverlayStyled}
