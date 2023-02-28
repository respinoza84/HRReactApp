//import {useHistory} from 'react-router'
//import {routes} from 'router'
import {Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core'

import {hrmangoColors, spacing, typography} from 'lib/hrmangoTheme'
import {JobDetailType} from 'type/job/jobDetail'

const useStyles = makeStyles(() => ({
  dataContainer: {
    padding: `${spacing[24]}px 0px 0px`,
    display: 'flex',
    justifyContent: 'space-between'
  },
  subTitle: {
    ...typography.subtitle2,
    color: hrmangoColors.grey
  },
  title: {
    ...typography.h5,
    paddingBottom: spacing[16]
  },
  text: {
    ...typography.subtitle3
  }
}))

const JobDetails = ({job}: JobDetailType) => {
  const classes = useStyles()

  return (
    <div className={classes.dataContainer}>
      <div style={{width: '80%'}}>
        <Box className={classes.title}>
          <span>Job Description</span>
        </Box>
        <div dangerouslySetInnerHTML={{__html: job?.jobDescription ?? ''}} />
      </div>
      <div>
        <Box className={classes.title}>
          <span>Job Information</span>
        </Box>
        <Box>
          <span className={classes.subTitle}>Industry</span>
          <div className={classes.text}>{job?.companyVertical}</div>
        </Box>
        <Box>
          <span className={classes.subTitle}>Salary</span>
          <div className={classes.text}>{job?.payRange}</div>
        </Box>
        <Box>
          <span className={classes.subTitle}>City</span>
          <div className={classes.text}>{job?.city}</div>
        </Box>
        <Box>
          <span className={classes.subTitle}>State/Province</span>
          <div className={classes.text}>{job?.state}</div>
        </Box>
        <Box>
          <span className={classes.subTitle}>Country</span>
          <div className={classes.text}>{job?.territory}</div>
        </Box>
        <Box>
          <span className={classes.subTitle}>Zip/Postal Code</span>
          <div className={classes.text}>{job?.zipCode}</div>
        </Box>
      </div>
    </div>
  )
}

export {JobDetails}
