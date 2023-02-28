import styled from 'styled-components/macro'

const PageStyled = styled.div<{minHeight?: string}>`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;

  align-content: flex-start;
  ${(props) => (props.minHeight ? `min-height: ${props.minHeight}` : '')}
`

const PageTitleBarStyled = styled.div`
  display: flex;
  flex-basis: 100%;

  padding: 5px 20px;
  background-color: ${(props) => props.theme.white};

  height: 50px;

  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 24px;
    margin: 0;
  }
`

const PageTitleActionsContainer = styled.div`
  grid-column: 2;
  -ms-grid-column: 2;
`

const PageToolbarContainerStyled = styled.div`
  grid-row: 2;
  -ms-grid-row: 2;
  grid-column: 1/-1;
`

const PageContentStyled = styled.div`
  grid-row: 3;
  -ms-grid-row: 3;
`

const PageGridContentStyled = styled.div`
  display: flex;
  flex-basis: 100%;
`

const PageFlexContentStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
`

export {
  PageStyled,
  PageContentStyled,
  PageToolbarContainerStyled,
  PageTitleActionsContainer,
  PageTitleBarStyled,
  PageGridContentStyled,
  PageFlexContentStyled
}
