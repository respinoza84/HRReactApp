import * as React from 'react'
import {
  ButtonStyled,
  LargeButtonStyled,
  ButtonStyle,
  GridButtonStyled,
  CircleButtonStyled,
  NoStyledButton,
  ButtonUnstyled
} from './button.style'

import {BaseProps} from '../../type/BaseProps'

export type ButtonProps = BaseProps & {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children?: React.ReactNode
  disabled?: boolean
  buttonStyle?: ButtonStyle
  style?: React.CSSProperties
  type?: 'button' | 'reset' | 'submit'
  ariaLabel?: string
  title?: string
}

const Button = React.memo((props: ButtonProps) => <ButtonStyled {...props} />)

const LargeButton = React.memo((props: ButtonProps) => <LargeButtonStyled {...props} />)

const ButtonWithHooks = React.memo(({onClick, children, ...props}: ButtonProps) => {
  const [count, setCount] = React.useState(0)
  const clickIt = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCount(count + 1)
    if (onClick) onClick(event)
  }

  return (
    <LargeButtonStyled onClick={clickIt} {...props}>
      {children} {count}
    </LargeButtonStyled>
  )
})

const GridButton = React.memo((props: ButtonProps) => <GridButtonStyled {...props} />)

const CircleButton = React.memo((props: ButtonProps) => <CircleButtonStyled {...props} />)

const NoStyleButton = React.memo((props: ButtonProps) => <NoStyledButton {...props} />)

const UnStyledButton = React.memo((props: ButtonProps) => <ButtonUnstyled {...props} />)

export {Button, LargeButton, ButtonWithHooks, GridButton, CircleButton, NoStyleButton, UnStyledButton}
