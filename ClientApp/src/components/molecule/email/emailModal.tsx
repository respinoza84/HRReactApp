/*
  @author Oliver Zamora
  @description the emailModal component.
*/
import {useState} from 'react'
import {makeStyles, Button, TextField} from '@material-ui/core'
import {useDispatch} from 'react-redux'
import CurrentUserCache from 'lib/utility/currentUser'

import {setToast, setSpinner} from 'store/action/globalActions'
import {spacing, typography} from 'lib/hrmangoTheme'
import {email} from 'api/actionsApi'
import HRModal from '../../page/shared/modal'
import {Email} from 'type/email'

type emailModalType = {
  open: boolean
  onClose: () => void
}

const EmailModal = ({onClose, open}: emailModalType) => {
  const useStyles = makeStyles(({hrmangoColors}) => ({
    content: {
      borderBottom: `1px solid ${hrmangoColors.lightGray}`,
      borderTop: `1px solid ${hrmangoColors.lightGray}`,
      //...hrmangoTypography.button,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      padding: `${spacing[12]}px ${spacing[24]}px ${spacing[48]}px`,
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      }
    },
    button: {
      ...typography.buttonGreen,
      //textTransform: 'capitalize'
      //...typography.button
      padding: `${spacing[10]}px ${spacing[16]}px`,
      margin: spacing[12]
    },
    buttonDense: {
      ...typography.buttonDense,
      textTransform: 'capitalize',
      padding: `${spacing[10]}px ${spacing[16]}px`,
      margin: spacing[12]
    },
    submitButton: {
      color: hrmangoColors.onSurfaceDark.highEmphasis
    },
    buttonContent: {
      padding: `${spacing[8]}px ${spacing[16]}px`,
      display: 'flex',
      justifyContent: 'end'
    },
    textField: {
      '& .MuiFilledInput-input': {
        padding: '16px 13px'
      }
    }
  }))
  const classes = useStyles()
  const dispatch = useDispatch()
  const [emailInfo, setEmailInfo] = useState<Email>()
  const [isError, setIsError] = useState({
    to: false,
    cc: false,
    subject: false,
    message: false
  })
  const [errorText, setErrorText] = useState({
    emailError: 'Please enter a valid email',
    subjectError: 'Please enter a valid subject',
    messageError: 'Please enter a valid message'
  })

  const onSendClick = () => {
    dispatch(setSpinner(true))
    email(emailInfo)
      .then((response: any) => {
        dispatch(
          setToast({
            message: `Email successfully sent`,
            type: 'success'
          })
        )
      })
      .catch((error) => {
        dispatch(setToast({type: 'error'}))

        let emailError = {text: '', error: false}
        let subjectError = {text: '', error: false}
        let messageError = {text: '', error: false}

        error?.fieldMessages.forEach((fieldMessage) => {
          if (fieldMessage.fieldId === 'to') {
            emailError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'cc') {
            emailError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'subject') {
            subjectError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'message') {
            messageError = {text: fieldMessage.message, error: true}
          }
        })

        setErrorText({
          emailError: emailError.text,
          subjectError: subjectError.text,
          messageError: messageError.text
        })
        setIsError({
          to: emailError.error,
          cc: emailError.error,
          subject: subjectError.error,
          message: messageError.error
        })
      })
      .finally(() => {
        dispatch(setSpinner(false))
        onClose()
      })
  }

  return (
    <HRModal header='Email' open={open} onClose={onClose}>
      <div className={classes.content}>
        <TextField
          required
          className={classes.textField}
          id='to'
          label='To (email address)'
          margin='normal'
          variant='outlined'
          value={emailInfo?.to.email}
          error={isError.to}
          onChange={(e: any) => {
            e.target.value.length < 257 &&
              setEmailInfo({
                ...emailInfo!,
                to: {email: e.target.value},
                from: {email: CurrentUserCache?.userEmail?.toString() ?? ''}
              })
          }}
          fullWidth
          helperText={isError.to ? errorText.emailError : ''}
        />
        <TextField
          className={classes.textField}
          id='cc'
          label='CC'
          margin='normal'
          variant='outlined'
          value={emailInfo?.cc?.email}
          error={isError.cc}
          onChange={(e: any) => {
            e.target.value.length < 257 && setEmailInfo({...emailInfo!, cc: {email: e.target.value}})
          }}
          fullWidth
          helperText={isError.cc ? errorText.emailError : ''}
        />
        <TextField
          required
          className={classes.textField}
          id='subject'
          label='Subject'
          margin='normal'
          variant='outlined'
          value={emailInfo?.subject}
          error={isError.subject}
          onChange={(e: any) => {
            e.target.value.length < 257 && setEmailInfo({...emailInfo!, subject: e.target.value})
          }}
          fullWidth
          helperText={isError.subject ? errorText.subjectError : ''}
        />
        <TextField
          required
          className={classes.textField}
          id='message'
          label='Message'
          margin='normal'
          variant='outlined'
          value={emailInfo?.message}
          error={isError.message}
          onChange={(e: any) => {
            e.target.value.length < 257 && setEmailInfo({...emailInfo!, message: e.target.value})
          }}
          fullWidth
          multiline={true}
          minRows={3}
          helperText={isError.message ? errorText.messageError : ''}
        />
      </div>
      <div className={classes.buttonContent}>
        <Button color='secondary' onClick={onClose} className={classes.buttonDense}>
          Cancel
        </Button>
        <Button
          className={`${classes.button} ${classes.submitButton}`}
          variant='contained'
          color='secondary'
          onClick={() => {
            setIsError({
              ...isError,
              to: !emailInfo?.to.email?.replace(/\s+/g, '').length ?? false,
              subject: !emailInfo?.subject?.replace(/\s+/g, '').length ?? false,
              message: !emailInfo?.message?.replace(/\s+/g, '').length ?? false
            })
            if (
              emailInfo?.to.email?.replace(/\s+/g, '').length &&
              emailInfo?.subject?.replace(/\s+/g, '').length &&
              emailInfo?.message?.replace(/\s+/g, '').length
            ) {
              onSendClick()
            }
          }}
        >
          Send
        </Button>
      </div>
    </HRModal>
  )
}

export default EmailModal
