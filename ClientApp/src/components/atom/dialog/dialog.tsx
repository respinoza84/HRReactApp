/*
  @author Oliver Zamora
  @description the Dialog component.
*/
import styled from 'lib/styledComponents'
import {Modal} from 'components/molecule/modal'
import {Button} from 'lib/atom/button'

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 20px 30px;
  width: 275px;
  box-sizing: border-box;
`

const Description = styled.p`
  color: ${(props) => props.theme.textColor};
  text-align: center;
  margin: 0;
  padding: 29px 0;
  font-size: ${(props) => props.theme.fontSizes.T2};
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;

  button {
    min-width: 100px;
  }

  button:first-of-type {
    margin-right: 20px;
  }
`

export type DialogButtonType = {
  text?: string
  onClick: () => void
}

type DialogType = {
  buttonOne: DialogButtonType
  buttonTwo: DialogButtonType
  description: string
  onClose: () => void
}

const Dialog = ({buttonOne, buttonTwo, description, onClose}: DialogType) => (
  <Modal height='auto' closeAction={onClose} closeButtonSize='16px'>
    <DialogContainer>
      <Description>{description}</Description>
      <ButtonRow>
        <Button buttonStyle='secondary' onClick={buttonOne.onClick}>
          {buttonOne.text ? buttonOne.text : 'NO'}
        </Button>
        <Button onClick={buttonTwo.onClick}>{buttonTwo.text ? buttonTwo.text : 'YES'}</Button>
      </ButtonRow>
    </DialogContainer>
  </Modal>
)

export {Dialog}
