import styled from 'lib/styledComponents'

const Header1 = styled.h1(
  ({theme}) => `
    font-size: 42px;
    font-weight: ${theme.typography.fontWeightMedium};
`
)

const Header2 = styled.h2(
  ({theme}) => `
    margin: 0;
    font-size: 36px;
    font-weight: ${theme.typography.fontWeightRegular};
`
)

const Header3 = styled.h3(
  ({theme}) => `
    font-size: 24px;
    font-weight: ${theme.typography.fontWeightBold};
`
)

const Header4 = styled.h4(
  ({theme}) => `
    font-size: 18px;
    font-weight: ${theme.typography.fontWeightBold};
`
)

export {Header1, Header2, Header3, Header4}
