import styled from 'lib/styledComponents'

const CardContainer = styled.article`
  margin: 10px 10px;
  min-height: 300px;
`

const CardTitleContainer = styled.div<{titleBackgroundColor?: string}>`
  background-color: ${(props) => props.titleBackgroundColor || props.theme.blueGray};
  padding: 15px;
`

const CardTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: ${({theme}) => theme.fontWeights.light};
  color: ${(props) => props.theme.white};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const CartContent = styled.section`
  background-color: ${(props) => props.theme.white};
  font-size: ${(props) => props.theme.fontSizes.T1};
  border-radius: 0 0 3px 3px;
  border-right: 1px solid ${(props) => props.theme.grayMedium};
  border-bottom: 1px solid ${(props) => props.theme.grayMedium};
  border-left: 1px solid ${(props) => props.theme.grayMedium};
`

export {CardContainer, CardTitle, CartContent, CardTitleContainer}
