import styled from 'lib/styledComponents'

const P1 = styled.p(
  ({theme}) => `
    font-size: 18px;
    font-weight: ${theme.fontWeights.semibold};
`
)

const P2 = styled.p(
  ({theme}) => `
    font-size: 14px;
    font-weight: ${theme.fontWeights.light};
    margin: 10px 0 25px;
`
)

const P3 = styled.p(
  ({theme}) => `
    font-size: 12px;
    font-weight: ${theme.fontWeights.bold};
    margin: 0 0 20px;
`
)

const P4 = styled.p(
  ({theme}) => `
    font-size: 10px;
    font-weight: ${theme.fontWeights.bold};
    text-transform: capitalize;
`
)

export {P1, P2, P3, P4}
