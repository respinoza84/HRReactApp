import {withRouter, RouteComponentProps, StaticContext} from 'react-router'

import {makeStyles} from '@material-ui/core/styles'
import {spacing, typography, shadows, hrmangoColors} from 'lib/hrmangoTheme'
import {Box} from '@material-ui/core'

import {LocationState} from 'type'
import {ReportHeader} from './reportHeader'
import {InvoicesCompanyReportInvoiced} from '../billing/InvoicesCompanyReportInvoiced'
import {InvoicesCompanyReportPaid} from '../billing/InvoicesCompanyReportPaid'

const useStyles = makeStyles((theme) => ({
  filter: {
    paddingTop: spacing[16],
    borderBottom: hrmangoColors.tableBorderStyle
  },
  root: {
    flexGrow: 1,
    display: 'flex',
    marginTop: spacing[16],
    marginLeft: spacing[24]
  },
  tabPanelExt: {
    boxShadow: shadows[20],
    fontWeight: typography.fontWeightMedium,
    backgroundColor: hrmangoColors.white,
    borderRadius: '24px',
    marginRight: '32px',
    padding: spacing[24],
    '& .MuiAutocomplete-popper': {
      marginTop: '80px',
      opacity: 0.9
    },
    '& .MuiContainer-root': {
      padding: spacing[0]
    },
    width: '-webkit-fill-available'
  },
  textField: {
    marginLeft: '16px',
    '& .MuiFilledInput-input': {
      padding: '16px 13px'
    }
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  drawerPaper: {
    width: '405px',
    top: '80px',
    borderTopLeftRadius: spacing[24]
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: shadows[20],
    padding: spacing[24],
    fontWeight: typography.fontWeightMedium,
    backgroundColor: hrmangoColors.lightGray,
    borderRadius: '24px',
    width: '-webkit-fill-available',
    '& .MuiAutocomplete-popper': {
      marginTop: '80px',
      opacity: 0.9
    },
    '& .MuiContainer-root': {
      padding: spacing[0]
    }
  }
}))

const BillingCompanyReport = withRouter(
  ({location, history}: RouteComponentProps<{}, StaticContext, LocationState>) => {
    const classes = useStyles()

    return (
      <>
        <Box>
          <ReportHeader />
        </Box>
        <div className={classes.root}>
          <Box className={classes.tabPanelExt}>
            <InvoicesCompanyReportInvoiced />
          </Box>
        </div>
        <div className={classes.root}>
          <Box className={classes.tabPanelExt}>
            <InvoicesCompanyReportPaid />
          </Box>
        </div>
      </>
    )
  }
)

export {BillingCompanyReport}
