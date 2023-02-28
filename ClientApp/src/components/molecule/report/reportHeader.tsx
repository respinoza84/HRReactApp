import {Box} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'

import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {LocationState} from 'type'

const ReportHeader = withRouter(({history, location, match}: RouteComponentProps<{}, StaticContext, LocationState>) => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: `${spacing[24]}px ${spacing[32]}px ${spacing[16]}px ${spacing[32]}px`,
      color: `${location && location.state && location.state.header?.color}`,
      borderBottom: hrmangoColors.tableBorderStyle,
      ...typography.h5
    },
    rightMenu: {
      display: 'flex',
      justifyContent: 'end',
      marginLeft: spacing[32],
      marginRigth: spacing[32]
    },
    label: {
      //marginLeft: spacing[32]
    },
    labelRight: {
      marginLeft: spacing[32],
      color: hrmangoColors.dark,
      ...typography.body1
    },
    button: {
      ...typography.buttonDense,
      marginLeft: spacing[32],
      marginBottom: spacing[24],
      textTransform: 'capitalize'
    },
    drawerPaper: {
      width: '405px',
      top: '80px',
      borderTopLeftRadius: spacing[24]
    }
  }))
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Box style={{marginBottom: spacing[24]}}>
        <label className={classes.label}>{location && location.state && location.state.header?.title}</label>
      </Box>
    </div>
  )
})

export {ReportHeader}
