import * as React from 'react'
import {ModalTooltipContainerStyled, CloseStyled} from './modalTooltip.style'
import {getHRMangoUrl} from 'lib/utility'
import {useOnClickOutside} from 'lib/utility/customHooks/useOnClickOutside'

export type ModalTooltipProps = {
  x?: number
  y?: number
  children?: React.ReactNode
  active?: boolean
  width?: number
  backgroundColor?: string
  onDismiss?: () => void
}

const ModalTooltip = ({active, children, x = 0, y = 0, onDismiss, ...props}: ModalTooltipProps) => {
  const [showTooltip, setVisibility] = React.useState(() => true)
  const [refWidth, setRefWidth] = React.useState(() => 0)
  const [refHeight, setRefHeight] = React.useState(() => 0)

  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (ref.current && refWidth !== ref.current.offsetWidth) setRefWidth(ref.current.offsetWidth)
    if (ref.current && refHeight !== ref.current.scrollHeight) setRefHeight(ref.current.scrollHeight)
  }, [refWidth, refHeight])

  const handleDismiss = () => {
    setVisibility(false)
    if (onDismiss) {
      setTimeout(onDismiss, 100)
    }
  }

  useOnClickOutside(ref, handleDismiss)

  return (
    <ModalTooltipContainerStyled
      active={showTooltip}
      x={x < window.innerWidth / 2 ? x : x - refWidth - 20}
      y={y < window.innerHeight / 2 ? y : y - refHeight - 20}
      {...props}
    >
      <CloseStyled onClick={handleDismiss}>
        <img src={getHRMangoUrl('public/img/icon/x.png')} alt='close' />
      </CloseStyled>
      <div ref={ref}>{children}</div>
    </ModalTooltipContainerStyled>
  )
}

export {ModalTooltip}
