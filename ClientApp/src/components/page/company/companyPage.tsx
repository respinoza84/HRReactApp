import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {routes} from 'router'

import {spacing, typography, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {InfoHeader} from 'components/molecule/infoHeader'

import {CompanyTable} from '../../molecule/company/companyTable'
import {LocationState} from 'type'

const CompanyPage = withRouter(({history, location}: RouteComponentProps<{}, StaticContext, LocationState>) => {
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

  const addCompany = () => {
    history.push({
      pathname: `${routes.CompanyDetail}/`,
      state: {
        header: {
          title: 'New Company' as any,
          color: location && location.state && location.state.header?.color
        }
      }
    })
  }
  //const filters = tableFilters

  return (
    <>
      <InfoHeader
        color={location && location.state && location.state.header?.color}
        title={location && location.state && location.state.header?.title}
        entity='Company'
        onClick={addCompany}
      />
      <div className={classes.principalContain}>
        <div className={classes.container}>
          <CompanyTable />
        </div>
      </div>
    </>
  )
})

export {CompanyPage}
