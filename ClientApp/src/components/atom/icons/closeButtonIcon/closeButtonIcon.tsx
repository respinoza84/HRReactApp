/*
  @author Oliver Zamoa
  @description CloseButtonIcon should be used in every modal to close it
*/

import {IconButton, IconButtonProps} from 'lib/atom/icons/iconButton/iconButton'
import {hrmangoColors} from 'lib/hrmangoTheme'

const CloseButtonIcon = ({
  onClick,
  title,
  width,
  height,
  viewBox,
  fill,
  className,
  disabled,
  dataTestId
}: IconButtonProps) => (
  <IconButton
    disabled={disabled}
    onClick={onClick}
    title={title}
    width={width}
    height={height}
    viewBox={viewBox}
    className={className}
    dataTestId={dataTestId}
  >
    <defs>
      <path
        d='M18,3 C9.705,3 3,9.705 3,18 C3,26.295 9.705,33 18,33 C26.295,33 33,26.295 33,18 C33,9.705 26.295,3 18,3 L18,3 Z M25.5,23.385 L23.385,25.5 L18,20.115 L12.615,25.5 L10.5,23.385 L15.885,18 L10.5,12.615 L12.615,10.5 L18,15.885 L23.385,10.5 L25.5,12.615 L20.115,18 L25.5,23.385 L25.5,23.385 Z'
        id={`modal-close-button-path-1-${dataTestId}`}
      />
    </defs>
    <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <g transform='translate(-1249.000000, -123.000000)'>
        <g transform='translate(1246.000000, 120.000000)'>
          <mask id={`modal-close-button-mask-1-${dataTestId}`} fill='white'>
            <use href={`#modal-close-button-path-1-${dataTestId}`} />
          </mask>
          <g
            mask={`url(#modal-close-button-mask-1-${dataTestId})`}
            fill={disabled ? hrmangoColors.lightGray : fill}
            fillRule='evenodd'
          >
            <g transform='translate(-19.500000, -19.500000)'>
              <path d='M0,0 L75,0 L75,75 L0,75 L0,0 Z' />
            </g>
          </g>
        </g>
      </g>
    </g>
  </IconButton>
)

CloseButtonIcon.defaultProps = {
  width: '15px',
  height: '15px',
  viewBox: '0 0 30 30',
  fill: hrmangoColors.grayDark,
  title: 'close',
  disabled: false
}

export default CloseButtonIcon
