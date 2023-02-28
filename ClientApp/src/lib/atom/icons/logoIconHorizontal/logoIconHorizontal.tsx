/*
  @author Oliver Zamora
  @description the horizontal logo for HRMango
*/

import {SvgImage, SvgImagePropTypes} from '../svgImage'

const LogoIconHorizontal = ({title, width, height, viewBox}: SvgImagePropTypes) => (
  <SvgImage width={width} height={height} viewBox={viewBox} title={title}>
    <rect width={width} height={height} fill='url(#pattern0)' />
    <defs>
      <pattern id='pattern0' patternContentUnits='objectBoundingBox' width='1' height='1'>
        <use href='#hrmangoHorizontalLogo' transform='translate(-0.00114369) scale(0.000831774 0.00218341)' />
      </pattern>
      <image id='hrmangoHorizontalLogo' width='1205' height='458' href='' />
    </defs>
  </SvgImage>
)

LogoIconHorizontal.defaultProps = {
  title: 'HRMango Logo Icon',
  height: '72px',
  width: '92px',
  viewBox: '40 0 92 72'
}

export default LogoIconHorizontal
