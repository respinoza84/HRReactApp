import styled from 'lib/styledComponents'
import {Button} from 'lib/atom/button'

const ModalContainerStyle = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  border: 1px solid lightgrey;
  border-radius: 3px;
`

// the height is 350px as a fallback if the caller does not specify. This has to be a pixel value
// otherwise Internet Explorer will lose its freaking mind and flip tables.
// so... if you see a jacked up modal elsewhere make sure to pass in a height! trust not in the auto. it is the dark side.
/* eslint-disable no-unexpected-multiline */
const ModalStyle = styled.div<{
  height?: string
  width?: string
  centered?: boolean
}>`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || '350px'};
  min-width: 200px;
  min-height: 100px;
  background: #fff;
  margin: auto;
  -webkit-box-shadow: -4px 4px 7px -7px rgba(0, 0, 0, 1);
  -moz-box-shadow: -4px 4px 7px -7px rgba(0, 0, 0, 1);
  box-shadow: -4px 4px 7px -7px rgba(0, 0, 0, 1);
  display: inline-block;
  position: relative;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const ModalCloseButtonContainer = styled.div<{size?: string}>`
  position: absolute;
  top: ${(props) => (props.size ? props.size : '24px')};
  right: ${(props) => (props.size ? props.size : '24px')};
`

const ContainerStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`

const ModalFlexItem = styled.div<{marginBottom: string}>`
  flex-grow: 1;
  flex-basis: 100%;
  margin-bottom: ${(props) => props.marginBottom};
  text-align: center;
`

const ModalButtonStyled = styled(Button)`
  flex-grow: 1;
  flex-basis: 100%;
`
const MessageStyled = styled.p`
  font-size: 14px;
  line-height: 20px;
  text-align: center;

  flex-grow: 1;
  flex-basis: 100%;
  width: 100%;
  padding: 50px;
`

export {
  ModalContainerStyle,
  ModalStyle,
  ContainerStyled,
  ModalFlexItem,
  ModalButtonStyled,
  MessageStyled,
  ModalCloseButtonContainer
}
