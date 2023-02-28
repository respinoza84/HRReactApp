import styled from 'lib/styledComponents'
import {Header3} from '../typography/headers'

const PageHeaderStyled = styled(Header3)`
  color: ${(props) => props.theme.black};
  text-transform: uppercase;
  margin: 0px;
`

export {PageHeaderStyled}
