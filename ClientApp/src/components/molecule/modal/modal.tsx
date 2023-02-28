/*
  @author Oliver Zamora
  @description added close button. If closeAction prop is not provided to modal, then it will not show up
*/
import * as React from 'react'

import {Overlay} from '../../molecule/overlay'
import {ModalStyle, ModalCloseButtonContainer} from './modal.style'
import {PortalOverlay} from '../../molecule/portalOverlay'
import CloseButtonIcon from '../../atom/icons/closeButtonIcon/closeButtonIcon'

type ModalProps = {
  height?: string
  width?: string
  children?: React.ReactNode
  closeAction?: any
  closeButtonSize?: string
}

const ModalContainer = ({height, width, children, closeAction, closeButtonSize}: ModalProps) => (
  <ModalStyle height={height} width={width}>
    {children}
    {closeAction && (
      <ModalCloseButtonContainer size={closeButtonSize}>
        <CloseButtonIcon width={closeButtonSize || '30px'} height={closeButtonSize || '30px'} onClick={closeAction} />
      </ModalCloseButtonContainer>
    )}
  </ModalStyle>
)

const Modal = (props: ModalProps) => (
  <Overlay exiting={false}>
    <ModalContainer {...props} />
  </Overlay>
)

const GlobalModal = (props: ModalProps) => (
  <PortalOverlay exiting={false}>
    <ModalContainer {...props} />
  </PortalOverlay>
)

export {Modal, GlobalModal}
