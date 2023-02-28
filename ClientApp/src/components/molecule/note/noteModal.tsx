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
import {createNote} from 'api/actionsApi'
import HRModal from '../../page/shared/modal'
import {Note} from 'graphql/types.generated'

type noteModalType = {
  open: boolean
  entityId: number
  entityName: string
  onClose: () => void
  refetch?: () => void
}

const NoteModal = ({onClose, refetch, open, entityId, entityName}: noteModalType) => {
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
  const [note, setNote] = useState<Note>({id: 0, text: ''})
  const [isError, setIsError] = useState({
    text: false
  })
  const [errorText, setErrorText] = useState({
    textError: 'Please enter a valid information'
  })

  const onSaveClick = () => {
    dispatch(setSpinner(true))
    createNote(entityId.toString(), entityName, note)
      .then((response: any) => {
        dispatch(
          setToast({
            message: `Note successfully added`,
            type: 'success'
          })
        )
      })
      .catch((error) => {
        dispatch(setToast({type: 'error'}))

        let textError = {text: '', error: false}

        error?.fieldMessages.forEach((fieldMessage) => {
          if (fieldMessage.fieldId === 'text') {
            textError = {text: fieldMessage.message, error: true}
          }
        })

        setErrorText({
          textError: textError.text
        })
        setIsError({
          text: textError.error
        })
      })
      .finally(() => {
        dispatch(setSpinner(false))
        onClose()
        refetch && refetch()
      })
  }

  return (
    <HRModal header='Note' open={open} onClose={onClose}>
      <div className={classes.content}>
        <TextField
          required
          className={classes.textField}
          id='note'
          label={`Note taken by ${CurrentUserCache.userName}`}
          margin='normal'
          variant='outlined'
          value={note?.text}
          error={isError.text}
          onChange={(e: any) => {
            e.target.value.length < 257 && setNote({...note!, text: e.target.value})
          }}
          fullWidth
          helperText={isError.text ? errorText.textError : ''}
          multiline={true}
          minRows={10}
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
              text: !note?.text?.replace(/\s+/g, '').length ?? false
            })
            if (note?.text?.replace(/\s+/g, '').length) {
              onSaveClick()
            }
          }}
        >
          Save
        </Button>
      </div>
    </HRModal>
  )
}

export default NoteModal
