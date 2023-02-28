import styled from '../../styledComponents'
import {typography, hrmangoColors} from '../../hrmangoTheme'

const baseStyle = styled.button`
  border-radius: 4px;
  min-height: 33px;
  min-width: 140px;
  margin: 0 5px;
  padding: 0.25em 1em;
  outline: none;
  text-transform: uppercase;
  font-weight: ${typography.fontWeightBold};
  font-size: ${typography.fontSize};
  background-color: ${hrmangoColors.blueGrayBackground};
  color: ${hrmangoColors.white};
  border: 1px solid ${hrmangoColors.coolBlueGray};
  :disabled {
    opacity: 0.45;
  }
  :hover {
    background-color: ${hrmangoColors.blueGrayBackground};
    color: ${hrmangoColors.coolBlueGray};
  }
`

const noStyle = styled.button`
  background-color: transparent;
  border: none;
  padding: 0px;
  height: fit-content;
  opacity: 0.8;
  :disabled {
    opacity: 0.45;
  }
  :hover {
    cursor: pointer;
    opacity: 1;
  }
  :focus {
    outline: none;
  }
`

export type ButtonStyle = 'primary' | 'secondary' | undefined

const ButtonStyled = styled(baseStyle)``

const GridButtonStyled = styled(baseStyle)`
  width: 100%;
`

const LargeButtonStyled = styled(baseStyle)`
  min-width: 200px;
`
const CircleButtonStyled = styled.button`
  background-color: ${hrmangoColors.lightVariant};
  border-radius: 50%;
  border: none;
  color: ${hrmangoColors.grayDark};
  cursor: pointer;
  height: 32px;
  padding: 0px;
  width: 32px;
`

const NoStyledButton = styled(noStyle)``

const ButtonUnstyled = styled.button`
  background-color: transparent;
  cursor: pointer;
  border: none;
  padding: 0;
  margin: 0;
`

export {
  ButtonStyled,
  LargeButtonStyled,
  GridButtonStyled,
  CircleButtonStyled,
  NoStyledButton,
  ButtonUnstyled,
  baseStyle
}
