import styled from 'lib/styledComponents'
import {fadeOut, fadeIn} from 'lib/atom/animation/animation'
import {ArrowPlacement} from '.'

const backgroundColor = 'rgba(255, 255, 255, 0.9)'
const arrowSize = 10

const calcWrapper = (side: ArrowPlacement) => {
  const w = side === 'top' || side === 'bottom' ? '100%' : `calc(100% + ${arrowSize}px * 1.6)`
  const h = side === 'left' || side === 'right' ? '100%' : `calc(100% + ${arrowSize}px * 1.6)`

  return `
        ${wrapperPosition(side)}
        width: ${w};
        height: ${h};
    `
}

const wrapperPosition = (side: ArrowPlacement) => {
  switch (side) {
    case 'right':
      return `top: 0; right:0;`
    case 'left':
    case 'bottom':
      return 'bottom: 0; left: 0;'
    case 'top':
    default:
      return 'top: 0; left: 0;'
  }
}

const calcSideHorizontal = (side: ArrowPlacement) => {
  switch (side) {
    case 'right':
      return 'right: 100%;'
    case 'left':
      return 'right: 0;'
    default:
      return ''
  }
}

const calcPositionHorizontal = (side: ArrowPlacement, position: ArrowPlacement) => {
  if (side === 'top' || side === 'bottom') {
    //tslint:disable-line
    switch (position) {
      case 'left':
        return 'left: 10%;'
      case 'middle':
        return 'left: 50%;'
      case 'right':
        return 'left: 90%;'
      default:
        return ''
    }
  }

  return ''
}

const calcSideVertical = (side: ArrowPlacement) => {
  switch (side) {
    case 'top':
      return 'top: 100%;'
    case 'bottom':
      return 'top: 0'
    case 'left':
    case 'right':
      return 'top: 50%;'
    default:
      return ''
  }
}

const calcPositionVertical = (side: ArrowPlacement, position: ArrowPlacement) => {
  if (side === 'left' || side === 'right') {
    //tslint:disable-line
    switch (position) {
      case 'top':
        return 'top: 10%'
      case 'middle':
        return 'top: 50%;'
      case 'bottom':
        return 'top: 90%;'
      default:
        return ''
    }
  }

  return ''
}

const calcTranslate = (side: ArrowPlacement) => {
  return side === 'top' || side === 'bottom' ? 'translate(-50%, -50%)' : 'translate(50%, -50%)'
}

const calcBorderColor = (side: ArrowPlacement) => `
    ${side === 'left' || side === 'bottom' ? `${backgroundColor} ` : 'transparent '}
    ${side === 'left' || side === 'top' ? `${backgroundColor} ` : 'transparent '}
    ${side === 'right' || side === 'top' ? `${backgroundColor} ` : 'transparent '}
    ${side === 'right' || side === 'bottom' ? `${backgroundColor}` : 'transparent'}
`

/* eslint-disable no-unexpected-multiline */
const TooltipContainerStyled = styled.div<{
  active: boolean
  x?: number
  y?: number
  width?: number
  arrowSide?: ArrowPlacement
  arrowPosition?: ArrowPlacement
}>`
  box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 8px;
  background-color: ${backgroundColor};
  padding: 10px;
  border-radius: 3px;
  border: 1px solid ${(props) => props.theme.grayLightest};
  position: fixed;
  left: ${(props) => props.x || 0}px;
  top: ${(props) => props.y || 0}px;
  font-size: ${(props) => props.theme.fontSizes.T2};
  animation: ${(props) => (props.active ? fadeIn : fadeOut)} 100ms ease-in forwards;
  visibility: ${(props) => (props.x && props.y ? 'visible' : 'hidden')};
  width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
  z-index: 9999;

  ${(props) =>
    props.arrowSide && props.arrowPosition
      ? `
            &:after {
                content: '';
                width: 0;
                height: 0;

                border: ${arrowSize}px solid black;
                border-color: ${calcBorderColor(props.arrowSide)};

                position: absolute;

                ${/* top: */ calcSideVertical(props.arrowSide)}
                ${/* left: */ calcSideHorizontal(props.arrowSide)}

                ${/* top: */ calcPositionVertical(props.arrowSide, props.arrowPosition)}
                ${/* left: */ calcPositionHorizontal(props.arrowSide, props.arrowPosition)}

                box-shadow:
                ${props.arrowSide === 'left' || props.arrowSide === 'top' ? '' : '-'}2px
                ${props.arrowSide === 'right' || props.arrowSide === 'top' ? ' ' : ' -'}2px
                3px -1px rgba(0, 0, 0, 0.5);

                transform: ${calcTranslate(props.arrowSide)} rotate(45deg);
            }

            &:before {
                content: '';
                position: absolute;
                ${calcWrapper(props.arrowSide)}
            }
        `
      : ''}
`

export {TooltipContainerStyled}
