/*
  @author Oliver Zamora
  @description the SvgImage component is used to wrap all SVGs we import into the codebase. Components using SvgImage should be stripped of the <desc> tag and especially IDs.
*/
import * as React from 'react'

export type SvgImagePropTypes = {
  title?: string
  width?: string
  height?: string
  viewBox?: string
  className?: string
  fill?: string
  style?: React.CSSProperties
  dataTestId?: string
  dark?: boolean
}

type SvgImageProps = SvgImagePropTypes & {
  version?: string
  children?: React.ReactNode
}

export const SvgImage = ({
  title,
  width,
  height,
  viewBox,
  version,
  className,
  children,
  fill,
  style,
  dataTestId
}: SvgImageProps) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    version={version}
    className={className}
    fill={fill}
    style={style}
    data-test-id={dataTestId}
  >
    <title>{title}</title>
    {children}
  </svg>
)

SvgImage.defaultProps = {
  version: '1.1'
}
