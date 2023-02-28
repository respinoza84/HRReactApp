import {makeStyles, Breadcrumbs, Link, Typography} from '@material-ui/core'
import {externalRoutes} from 'router/externalRouter'
import {ExternalHeader} from '../../molecule/external/externalHeader'
import {hrmangoColors, spacing} from 'lib/hrmangoTheme'
import {withRouter, StaticContext, RouteComponentProps} from 'react-router'
import {LocationState} from 'type'
import {ApplicantDetails} from '../../molecule/external/applicantDetails'
import {formatDate} from 'utility'

const useStyles = makeStyles(() => ({
  mainPage: {
    height: '100%',
    width: '100%',
    minWidth: 1024,
    display: 'flex',
    flexDirection: 'column'
  },
  mainContainer: {
    //height: '100%'
  },
  applicanrSection: {
    paddingLeft: spacing[24],
    paddingRight: spacing[24],
    paddingBottom: spacing[48],
    borderBottom: `1px solid ${hrmangoColors.outline}`,
    backgroundColor: hrmangoColors.lightestGray
  }
}))

const ApplicantPage = withRouter(({location, history}: RouteComponentProps<{}, StaticContext, LocationState>) => {
  const classes = useStyles()
  const job = location?.state?.params

  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault()
    history.push(`${externalRoutes.JobDetail}`, {
      params: job
    })
  }
  return (
    <div className={classes.mainPage}>
      <div className={classes.mainContainer}>
        <ExternalHeader
          title={`HR Mango | ${job?.jobExternalType}`}
          subTitle={job?.jobName}
          description={`${job?.city}, ${job?.territory} | Posted on ${formatDate(job?.timeOffer, true)}`}
        />
      </div>
      <div className={classes.applicanrSection}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link color='inherit' href='/careers/jobs'>
            Job listing
          </Link>
          <Link color='inherit' href='/' onClick={handleClick}>
            Job details
          </Link>
          <Typography color='textPrimary'>Job application</Typography>
        </Breadcrumbs>
        <ApplicantDetails job={job} />
      </div>
    </div>
  )
})

export {ApplicantPage}
