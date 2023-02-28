import {makeStyles} from '@material-ui/core'
import {ExternalHeader} from '../../molecule/external/externalHeader'
import {JobsInfo} from '../../molecule/external/jobsInfo'
import {hrmangoColors, spacing} from 'lib/hrmangoTheme'

const useStyles = makeStyles(() => ({
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

const CarrerPage = () => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.mainContainer}>
        <ExternalHeader
          title='Find a career that makes you happy'
          subTitle={`We're more than just a consulting firm. We're a family.`}
          description={`We know that finding a meaningful and rewarding job can be a long journey. Our goal is to make that
      process as easy as possible for you, and to create a work environment that's satisfying - one where you'll
      look forward to coming to every day. Start your journey with us by browsing available jobs.`}
        />
      </div>
      <div className={classes.jobSection}>
        <JobsInfo />
      </div>
    </>
  )
}

export {CarrerPage}
