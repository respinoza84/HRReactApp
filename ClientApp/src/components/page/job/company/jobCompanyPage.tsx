import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {routes} from 'router'

import {spacing, typography, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {InfoHeader} from 'components/molecule/infoHeader'

import {CompanyFilters} from 'type/company/companyFilters'
import {JobTable} from '../../../molecule/job/jobTable'
import {LocationState} from 'type'

export type JobsTableType = {
  loaded: boolean
  tableFilters?: CompanyFilters
}

const JobCompanyPage = withRouter(
  ({history, location}: JobsTableType & RouteComponentProps<{}, StaticContext, LocationState>) => {
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

    const addJob = () => {
      history.push({
        pathname: `${routes.JobDetail}/`,
        state: {
          header: {
            title: 'New Job' as any,
            color: location?.state?.header?.color ?? ('#0091D0' as any)
          }
        }
      })
    }
    //const filters = tableFilters

    return (
      <>
        <InfoHeader
          color={location?.state?.header?.color ?? ('#0091D0' as any)}
          title={location?.state?.header?.title ?? ('Jobs' as any)}
          entity='Job'
          onClick={addJob}
        />
        <div className={classes.principalContain}>
          <div className={classes.container}>
            <JobTable />
          </div>
        </div>
      </>
    )
  }
)

export {JobCompanyPage}
