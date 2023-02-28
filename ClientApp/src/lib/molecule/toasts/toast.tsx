/*
  @author Oliver Zamora
  @description Toast to display alert
*/
import {memo} from 'react'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import {useDispatch} from 'react-redux'
import {IconButton, makeStyles} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import {spacing, defaultErrorMsg} from 'lib/hrmangoTheme'

import {removeToast} from 'store/action/globalActions'
import {ToastType} from 'lib/type/global/global'

const useStyles = makeStyles(({typography, palette}) => ({
  toastContainer: {
    marginBottom: spacing[8],
    display: 'flex',
    alignSelf: 'flex-start'
  },
  title: {
    ...typography.h6
  },
  toast: {
    ...typography.subtitle2,
    borderRadius: spacing[4],
    backgroundColor: palette.grey[800],
    color: palette.common.white
  },
  clearIcon: {
    color: palette.common.white
  }
}))

export const Toast = memo(
  ({toast, toastTimeout = 5000}: {toast: ToastType; toastTimeout?: number}) => {
    const {type, message, title, persist = false, id} = toast
    const dispatch = useDispatch()
    const classes = useStyles()
    let timer: any = {}

    if (toast && !persist) {
      window.clearTimeout(timer)

      timer = window.setTimeout(() => dispatch(removeToast(toast)), toastTimeout)
    }

    return (
      <li className={classes.toastContainer} data-test={`${type}-toast-alert-${id}`}>
        <Alert
          icon={false}
          className={classes.toast}
          action={
            persist && (
              <IconButton aria-label='close' size='small' onClick={() => dispatch(removeToast(toast))}>
                <ClearIcon className={classes.clearIcon} fontSize='small' />
              </IconButton>
            )
          }
        >
          {title && <AlertTitle className={classes.title}>{title}</AlertTitle>}
          {type === 'error' && !message ? defaultErrorMsg : message}
        </Alert>
      </li>
    )
  },
  (prevProps, nextProps) => {
    if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
      return true
    }
    return false
  }
)
