/*
  @author Oliver Zamora
  @description Styled Material UI component
*/
import React from 'react'

import {withStyles} from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import {hrmangoTheme, spacing, tooltips} from 'lib/hrmangoTheme'

const {
  typography: {body2},
  palette: {
    common: {white},
    text: {primary}
  }
} = hrmangoTheme

type TooltipStyledType = {
  dataTestId?: string
  tooltipText?: string | null
  position?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top'
  showArrow?: boolean
  children?: React.ReactNode
  className?: string
  forceClosed?: boolean
  length: number
  shadow?: boolean
  backgroundColor?: string
  maxWidth?: number
}

const TooltipStyled = ({
  dataTestId,
  tooltipText,
  position,
  showArrow,
  children,
  className,
  forceClosed,
  length,
  shadow,
  backgroundColor,
  maxWidth
}: TooltipStyledType) => {
  const createChildren = <span className={className}>{children}</span>

  const TooltipStyling = withStyles({
    arrow: {
      color: white
    },
    tooltip: {
      backgroundColor: backgroundColor ? backgroundColor : white,
      color: backgroundColor ? white : primary,
      borderRadius: `${spacing[4]}px`,
      padding: `${spacing[4]}px ${spacing[8]}px`,
      maxWidth: maxWidth ? maxWidth : '140px',
      ...body2
    }
  })(Tooltip)

  const TooltipStylingShadow = withStyles({
    arrow: {
      color: white
    },
    tooltip: {
      ...tooltips.tooltip,
      ...body2
    }
  })(Tooltip)

  return (
    <>
      {tooltipText && length <= tooltipText.length && !shadow ? (
        <TooltipStyling
          open={forceClosed}
          data-test={dataTestId}
          title={tooltipText}
          placement={position}
          arrow={showArrow}
        >
          {createChildren}
        </TooltipStyling>
      ) : tooltipText && length <= tooltipText.length && shadow ? (
        <TooltipStylingShadow
          open={forceClosed}
          data-test={dataTestId}
          title={tooltipText}
          placement={position}
          arrow={showArrow}
        >
          {createChildren}
        </TooltipStylingShadow>
      ) : (
        createChildren
      )}
    </>
  )
}

export default TooltipStyled
