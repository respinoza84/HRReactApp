/*
  @author Oliver Zamora
  @description the emailModal component.
*/
import {memo, useRef, useState} from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import {useMutation} from 'react-query'
import {useDispatch} from 'react-redux'
import {makeStyles, Button, Modal, Typography} from '@material-ui/core'

import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {refreshToken} from 'api/authApi'
import {getToken, getRefresh, loginRedirect} from 'lib/authentication/authentication'
import {setLogOut} from 'store/action/globalActions'
import {IApplicationState} from 'store/reducer'

type logOutModalType = {
  timeout?: number
}

export const LogOut = memo(
  ({timeout = 30000}: logOutModalType) => {
    const useStyles = makeStyles(() => ({
      content: {
        color: hrmangoColors.onSurfaceLight.highEmphasis,
        padding: `${spacing[12]}px ${spacing[24]}px ${spacing[48]}px`,
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px'
        }
      },
      modal: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      header: {},
      modalContent: {
        width: 200,
        borderRadius: spacing[24],
        backgroundColor: hrmangoColors.white
      },
      mainHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: hrmangoColors.menuBar,
        borderTopRightRadius: spacing[24],
        borderTopLeftRadius: spacing[24]
      },
      headerText: {
        ...typography.h6,
        padding: `${spacing[16]}px ${spacing[24]}px`,
        color: hrmangoColors.grey,
        textTransform: 'capitalize'
      },
      closeIcon: {
        color: hrmangoColors.dark
      },
      button: {
        ...typography.buttonGreen,
        //textTransform: 'capitalize'
        //...typography.button
        //padding: `${spacing[10]}px ${spacing[16]}px`,
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
      }
    }))
    const classes = useStyles()
    const dispatch = useDispatch()

    const logOut = useSelector((state: IApplicationState) => state.global, shallowEqual).logOut

    const refresh = useMutation(() => refreshToken({refreshToken: getRefresh(), token: getToken()}), {
      onMutate: () => {},
      onSuccess: () => {},
      onError: (error) => {},
      retry: 0
    })

    //let timer: any = {}
    const [timeoutLogOut, setTimeoutLogOut] = useState<boolean>(false)
    const logOutRef = useRef(logOut)
    logOutRef.current = logOut

    const getTimeout = () => {
      setTimeout(() => {
        setTimeoutLogOut(logOutRef.current)
      }, timeout)
    }

    if (logOut) {
      getTimeout()
      timeoutLogOut && Promise.resolve(loginRedirect())
    }

    return (
      <Modal className={classes.modal} open={logOut} onClose={() => !logOut} disableEscapeKeyDown={false}>
        <div className={classes.modalContent}>
          <div className={classes.header}>
            <div className={classes.mainHeader}>
              <Typography className={classes.headerText}>LogOut</Typography>
            </div>
          </div>
          <div className={classes.content}>
            <div style={{overflow: 'auto'}}>Are you still there?</div>
            <div className={classes.buttonContent}>
              <Button
                className={`${classes.button} ${classes.submitButton}`}
                variant='contained'
                color='secondary'
                onClick={() => {
                  refresh.mutate()
                  dispatch(setLogOut(false))
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    )
  },
  (prevProps, nextProps) => {
    if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
      return true
    }
    return false
  }
)
