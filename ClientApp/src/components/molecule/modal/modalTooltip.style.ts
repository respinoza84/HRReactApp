import styled from 'lib/styledComponents'
import {fadeIn, fadeOut} from 'lib/atom/animation/animation'

/* eslint-disable no-unexpected-multiline */
const ModalTooltipContainerStyled = styled.div<{
  x?: number
  y?: number
  active: boolean
  width?: number
  backgroundColor?: string
}>`
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 4px;
  background-color: ${(props) => props.backgroundColor || props.theme.white};
  padding: 10px;
  border: 1px solid ${(props) => props.theme.grayLightest};
  width: auto;
  position: fixed;
  left: ${(props) => props.x || 0}px;
  top: ${(props) => props.y || 0}px;
  font-size: ${(props) => props.theme.fontSizes.T2};
  animation: ${(props) => (props.active ? fadeIn : fadeOut)} 100ms ease-in forwards;
  width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
`

const CloseStyled = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  right: 3px;
  top: 6px;
  z-index: 1;
  position: absolute;
  outline: none;
`

export {ModalTooltipContainerStyled, CloseStyled}
