/*
  @author Oliver Zamora
  @description the User Icon svg.
*/

import {SvgImage, SvgImagePropTypes} from '../svgImage'

const UserIcon = ({title, width, height}: SvgImagePropTypes) => (
  <SvgImage width={width} height={height} viewBox={'0 0 96 96'} title={title}>
    <defs>
      <circle id='path-1' cx='44' cy='44' r='44' />
    </defs>
    <g id='AVATAR' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <g id='avatar' transform='translate(4.000000, 4.000000)'>
        <g id='1_nYeUrEwtfzlYrlds2RFHdw'>
          <mask id='mask-2' fill='white'>
            <use xlinkHref='#path-1' />
          </mask>
          <use id='Mask' stroke='#939BB4' strokeWidth='2' xlinkHref='#path-1' />
          <image
            mask='url(#mask-2)'
            x='-1'
            y='-1'
            width='90'
            height='102'
            xlinkHref='data:image/png;base64,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'
          />
        </g>
      </g>
    </g>
  </SvgImage>
)

UserIcon.defaultProps = {
  title: 'user icon',
  height: '40px',
  width: '40px'
}

export default UserIcon
