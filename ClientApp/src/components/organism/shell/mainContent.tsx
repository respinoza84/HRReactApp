/*
  @author Oliver Zamora
  @description Main content section. Separating this out from new nav component, to prevent state (nav/toasts/spinner) updates forcing a render down the component tree
*/
import {memo} from 'react'
import {makeStyles} from '@material-ui/core/styles'

import {HRMangoRouter} from 'router/router'
import {Global} from 'components/organism/shell'

const useStyles = makeStyles(({palette, typography, breakpoints, hrmangoColors}) => ({
  mainContent: {
    height: '100%',
    marginLeft: 0,
    backgroundColor: hrmangoColors.lightGrey,
    [breakpoints.down(1024)]: {
      marginLeft: 0
    },
    overflow: 'auto'
  }
}))
export const MainContent = memo(
  () => {
    const classes = useStyles()

    return (
      <>
        <Global />
        <div className={classes.mainContent}>
          <HRMangoRouter />
        </div>
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
