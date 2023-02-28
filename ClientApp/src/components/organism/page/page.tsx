import * as React from 'react'
import {
  PageStyled,
  PageContentStyled,
  PageToolbarContainerStyled,
  PageTitleBarStyled,
  PageTitleActionsContainer,
  PageGridContentStyled,
  PageFlexContentStyled
} from './page.style'
import {PageHeader} from 'components/atom/pageHeader'

export type PageProps = {
  children?: React.ReactNode
  title?: string
  header?: React.ReactNode
  toolbar?: React.ReactNode
  actions?: React.ReactNode
  minHeight?: string
}

const PageInternal = ({title, header, children, toolbar, actions, ...props}: PageProps) => (
  <PageStyled {...props}>
    {title || actions || header ? (
      <PageTitleBarStyled>
        {title ? <PageHeader>{title}</PageHeader> : header}
        <PageTitleActionsContainer>{actions}</PageTitleActionsContainer>
      </PageTitleBarStyled>
    ) : (
      <></>
    )}
    {toolbar && <PageToolbarContainerStyled>{toolbar}</PageToolbarContainerStyled>}
    {children}
  </PageStyled>
)

const Page = (props: PageProps) => (
  <PageInternal {...props}>
    <PageContentStyled>{props.children}</PageContentStyled>
  </PageInternal>
)

const GridPage = ({children, ...props}: PageProps) => (
  <PageInternal {...props}>
    <PageGridContentStyled>{children}</PageGridContentStyled>
  </PageInternal>
)

const FlexPage = ({children, ...props}: PageProps) => (
  <PageInternal {...props}>
    <PageFlexContentStyled>{children}</PageFlexContentStyled>
  </PageInternal>
)

export {Page, GridPage, FlexPage}
