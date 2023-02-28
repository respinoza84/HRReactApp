/*
  @author Oliver Zamora
  @description IconButton can be used to wrap any SVG/PNG image with an accessible, unstyled button. Basically if you want an icon to act as a button, this will take a method to handle the onClick event.
*/
import * as React from 'react'

import {UnStyledButton} from 'lib/atom/button'
import {SvgImage, SvgImagePropTypes} from 'lib/atom/icons/svgImage'

export type IconButtonProps = SvgImagePropTypes & {
  onClick?: () => void
  ariaLabel?: string
  className?: string
  children?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  dataTestId?: string
}

export const IconButton = ({
  onClick,
  title,
  width,
  height,
  viewBox,
  className,
  type = 'button',
  children,
  disabled = false,
  dataTestId
}: IconButtonProps) => (
  <UnStyledButton disabled={disabled} type={type} onClick={onClick}>
    <SvgImage
      width={width}
      height={height}
      viewBox={viewBox}
      title={title}
      className={className}
      dataTestId={dataTestId}
    >
      {children}
    </SvgImage>
  </UnStyledButton>
)
