/*
  @author Oliver Zamora
  @description Toasts to display multiple toast/alerts
*/
import {memo} from 'react'
import {makeStyles} from '@material-ui/core/styles'

import {Toast} from './toast'
import {spacing} from 'lib/hrmangoTheme'

import {ToastType} from 'lib/type/global/global'

const useStyles = makeStyles(({zIndex}) => ({
  toastsContainer: {
    position: 'absolute',
    minWidth: 288,
    maxHeight: '100%',
    zIndex: zIndex.snackbar,
    listStyleType: 'none',
    padding: spacing[0],
    margin: spacing[0],
    overflow: 'auto',
    height: 'auto',
    left: spacing[24],
    bottom: spacing[24],
    display: 'flex',
    flexDirection: 'column-reverse'
  }
}))

export const Toasts = memo(
  ({toasts, context = false}: {toasts: ToastType[]; context?: boolean}) => {
    const classes = useStyles()

    return (
      <>
        {!!toasts?.length && (
          <ul className={classes.toastsContainer} data-test={`toast-alerts`}>
            {toasts?.map((toast: ToastType, index: number) => (
              <Toast key={index} toast={toast} />
            ))}
          </ul>
        )}
      </>
    )
  },
  (prevProps, nextProps) => {
    if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
      return true
    }
    return false
  }
)
