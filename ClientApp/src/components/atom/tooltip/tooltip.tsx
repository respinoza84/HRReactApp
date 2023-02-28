import * as React from 'react'
import {TooltipContainerStyled} from './tooltip.style'
import {BaseProps} from 'lib/type/BaseProps'

export type ArrowPlacement = 'top' | 'bottom' | 'left' | 'right' | 'middle' | undefined // Sides as ArrowPlacement

export type TooltipProps = BaseProps & {
  x?: number
  y?: number
  children?: React.ReactNode
  active?: boolean
  width?: number

  targetElement?: any
}

const arrowSize = 16 // rough estimate after calculating a 10px border * See style.ts file

const jiggleHelper = (n: number) => (prev: number) => (Math.abs(prev - n) <= 1 ? prev : n)

const Tooltip = ({active, children, x = 0, y = 0, id, ...props}: TooltipProps) => {
  const [showTooltip, setVisibility] = React.useState(() => !!active)
  const [refWidth, setRefWidth] = React.useState(() => 0)
  const [refHeight, setRefHeight] = React.useState(() => 0)

  const ref = React.useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    // setting deps array breaks functionality
    const tooltip = ref.current && (ref.current.offsetParent as HTMLDivElement)

    if (tooltip && refWidth !== tooltip.offsetWidth) {
      setRefWidth(jiggleHelper(tooltip.offsetWidth))
    }
    if (tooltip && refHeight !== tooltip.scrollHeight) {
      setRefHeight(jiggleHelper(tooltip.offsetHeight))
    }
  })

  // FUN FACT: SVG Line Element's 'stroke-width' does not add to width/height.
  // If Line, store stroke-width for later use.
  const lineStrokeCompensation =
    (props.targetElement &&
      props.targetElement.attributes['stroke-width'] &&
      parseInt(props.targetElement.attributes['stroke-width'].value, undefined)) ||
    0

  // Get Bounding Client Rect values:
  let {height, width, left, right, top, bottom} = props.targetElement
    ? props.targetElement.getBoundingClientRect()
    : {height: 0, width: 0, left: 0, right: 0, top: 0, bottom: 0}

  right = width === 0 ? right + lineStrokeCompensation / 2 : right
  left = width === 0 ? left - lineStrokeCompensation / 2 : left
  top = height === 0 ? top - lineStrokeCompensation / 2 : top
  bottom = height === 0 ? bottom + lineStrokeCompensation / 2 : bottom
  height = height === 0 ? lineStrokeCompensation : height
  width = width === 0 ? lineStrokeCompensation : width

  // Which side of the target element should the tooltip appear?
  // Left     -   When the left gap is >= 75% of window.innerWidth
  // Right    -   When the left gap is < 25% of window.innerWidth
  // Top      -   When element width >= 90% of element height
  //              When the top gap is >= 25% of window.innerHeight
  // Bottom   -   When element width >= 90% of element height
  //              When the top gap is < 75% of window.innerHeight
  const calcSide = () => {
    if (!props.targetElement) return undefined

    if (height > width * 0.1) {
      return left > window.innerWidth * 0.75 ? 'left' : 'right'
    }

    return top > window.innerHeight * 0.25 ? 'top' : 'bottom'
  }
  const side = calcSide()

  // Now find the center of side (arrow on tooltip points here)
  const calcCenterOfSide = (s: ArrowPlacement) => {
    if (!height || !width || !right || !left || !top || !bottom) return {x: 0, y: 0}

    switch (s) {
      case 'right':
        return {
          x: right,
          y: top + height / 2
        }
      case 'left':
        return {
          x: left,
          y: top + height / 2
        }
      case 'top':
        return {
          x: left + width / 2,
          y: top
        }
      case 'bottom':
        return {
          x: left + width / 2,
          y: bottom
        }
      default:
        return {x: 0, y: 0}
    }
  }
  const centerOfSide = calcCenterOfSide(side)

  // Will the tooltip be cut off the screen when rendered?
  // ( This would only happen on the top and bottom of screen )
  const cutOff = !centerOfSide
    ? undefined
    : centerOfSide.y + refHeight / 2 < 0
    ? 'top'
    : centerOfSide.y + refHeight / 2 > window.innerHeight
    ? 'bottom'
    : undefined

  // Where will the arrow appear?
  const arrowPosition = cutOff === undefined || side === 'top' || side === 'bottom' ? 'middle' : cutOff

  // Now that we know:
  // Which side of the target element to generate tooltip
  // The center of said side
  // And any potential cutoffs,
  // Calculate the X and Y values
  const calcX = (s: ArrowPlacement) => {
    if (!cutOff) {
      switch (s) {
        case 'top':
        case 'bottom':
          return centerOfSide.x - refWidth / 2
        case 'left':
          return left - refWidth - arrowSize
        case 'right':
          return right + arrowSize
      }
    }

    if (cutOff === 'bottom') {
      switch (s) {
        case 'top':
        case 'bottom':
          return centerOfSide.x - refWidth / 2
        case 'left':
          return left - refWidth - arrowSize
        case 'right':
          return right + arrowSize
      }
    }
  }
  const responsiveX = calcX(side)

  const calcY = (s: ArrowPlacement) => {
    if (!cutOff) {
      switch (s) {
        case 'top':
          return top - refHeight - arrowSize
        case 'bottom':
          return bottom + arrowSize
        case 'left':
        case 'right':
          return centerOfSide.y - refHeight / 2
      }
    }

    if (cutOff === 'bottom') {
      switch (s) {
        case 'top':
          return top - refHeight - arrowSize
        case 'bottom':
          return bottom + arrowSize
        case 'left':
        case 'right':
          return centerOfSide.y - refHeight * 0.9
      }
    }

    if (cutOff === 'top') {
      switch (s) {
        case 'left':
        case 'right':
          return centerOfSide.y - refHeight * 0.1
      }
    }
  }
  const responsiveY = calcY(side)

  return (
    <TooltipContainerStyled
      id={id}
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
      style={{display: !showTooltip && !active ? 'none' : 'block'}}
      active={showTooltip || !!active}
      x={responsiveX ? responsiveX : x < window.innerWidth / 2 ? x : x - refWidth - 20}
      y={responsiveY ? responsiveY : y < window.innerHeight / 2 ? y : y - refHeight - 20}
      arrowSide={side}
      arrowPosition={arrowPosition}
      {...props}
    >
      <div ref={ref}>{children}</div>
    </TooltipContainerStyled>
  )
}

export {
  Tooltip
  // Sides as ArrowPlacement
}
