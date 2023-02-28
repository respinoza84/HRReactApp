import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {makeStyles, Theme} from '@material-ui/core/styles'

import {spacing, typography, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {InfoHeader} from 'components/molecule/infoHeader'

import {ContactTable} from '../../molecule/contact/contactTable'
import {LocationState} from 'type'

const ContactPage = withRouter(({history, location}: RouteComponentProps<{}, StaticContext, LocationState>) => {
  const useStyles = makeStyles((theme: Theme) => ({
    principalContain: {
      backgroundColor: hrmangoColors.white,
      boxShadow: shadows[20],
      borderRadius: '16px',
      margin: `${spacing[16]}px ${spacing[32]}px`,
      fontWeight: typography.fontWeightMedium
    },
    container: {
      position: 'relative',
      padding: `${spacing[16]}px`
    }
  }))
  const classes = useStyles()

  return (
    <>
      <InfoHeader
        color={location && location.state && location.state.header?.color}
        title={location && location.state && location.state.header?.title}
        entity='Contact'
      />
      <div className={classes.principalContain}>
        <div className={classes.container}>
          <ContactTable />
        </div>
      </div>
    </>
  )
})

export {ContactPage}
