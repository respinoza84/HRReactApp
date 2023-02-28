import * as React from 'react'
import {OverlayStyled} from './overlay.style'

export type OverlayProps = {
  exiting: boolean
  onClick?: () => void
  onEscape?: () => void
  children?: React.ReactNode
}

const Overlay = ({children, exiting, onClick, onEscape}: OverlayProps) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) =>
    onClick && event.target === event.currentTarget && onClick()

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => onEscape && event.keyCode === 27 && onEscape()

    document.body.removeEventListener('keydown', handleEscape, false)

    return () => document.body.addEventListener('keydown', handleEscape, false)
  }, [onEscape])

  return (
    <OverlayStyled data-html2canvas-ignore exiting={exiting} onClick={handleClick}>
      {children}
    </OverlayStyled>
  )
}

export {Overlay}
