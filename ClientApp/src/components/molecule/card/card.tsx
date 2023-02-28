import * as React from 'react'
import {CardContainer, CardTitle, CartContent, CardTitleContainer} from './card.style'

type CardProps = {
  title?: string
  children?: React.ReactNode
  titleBackgroundColor?: string
}

const Card = ({children, title, titleBackgroundColor}: CardProps) => (
  <CardContainer>
    {title && (
      <CardTitleContainer titleBackgroundColor={titleBackgroundColor}>
        <CardTitle title={title}>{title}</CardTitle>
      </CardTitleContainer>
    )}
    <CartContent>{children}</CartContent>
  </CardContainer>
)

export {Card}
