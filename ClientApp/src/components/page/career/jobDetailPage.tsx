import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {makeStyles, Typography, Breadcrumbs, Link} from '@material-ui/core'
import {ExternalHeader} from '../../molecule/external/externalHeader'
import {hrmangoColors, spacing} from 'lib/hrmangoTheme'
import {withRouter, StaticContext, RouteComponentProps} from 'react-router'
import {LocationState} from 'type'
import {JobDetails} from '../../molecule/external/jobDetails'
import {externalRoutes} from 'router/externalRouter'
import {setSpinner} from 'store/action/globalActions'
import {formatDate} from 'utility'
import {useGetJobByIdQuery} from 'graphql/Jobs/Queries/GetJobByIdQuery.generated'

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
  jobSection: {
    paddingLeft: spacing[24],
    paddingRight: spacing[24],
    paddingBottom: spacing[48],
    borderBottom: `1px solid ${hrmangoColors.outline}`,
    backgroundColor: hrmangoColors.lightestGray
  }
}))

const JobDetailPage = withRouter(
  ({match, location, history}: RouteComponentProps<{jobId: string}, StaticContext, LocationState>) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const jobId = match.params.jobId
    const {data, isSuccess, isFetching, refetch} = useGetJobByIdQuery(
      {
        jobId: parseInt(jobId)
      },
      {enabled: false}
    )

    const [job, setJob] = useState(location?.state?.params)

    const goToApplicants = () => {
      history.push(`${externalRoutes.JobApplicant}`, {
        params: job
      })
    }

    useEffect(() => {
      if (jobId) {
        refetch()
      }
      // eslint-disable-next-line
    }, [jobId])

    useEffect(() => {
      if (data) {
        setJob(data.jobById)
      }
      // eslint-disable-next-line
    }, [data?.jobById, isSuccess])

    useEffect(() => {
      dispatch(setSpinner(isFetching))
      // eslint-disable-next-line
    }, [isFetching])

    return (
      <div className={classes.mainPage}>
        <div className={classes.mainContainer}>
          <ExternalHeader
            id={job?.id}
            title={`HR Mango | ${job?.jobExternalType}`}
            subTitle={job?.jobName}
            description={`${job?.city}, ${job?.territory} | Posted on ${formatDate(job?.timeOffer, true)}`}
            isDetailed={true}
            onClick={goToApplicants}
          />
        </div>
        <div className={classes.jobSection}>
          <Breadcrumbs aria-label='breadcrumb'>
            <Link color='inherit' href='/careers/jobs'>
              Job listing
            </Link>
            <Typography color='textPrimary'>Job details</Typography>
          </Breadcrumbs>
          <JobDetails job={job} />
        </div>
      </div>
    )
  }
)

export {JobDetailPage}
