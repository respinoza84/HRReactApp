/*
  @author Oliver Zamora
  @description Job card component
*/
import {makeStyles} from '@material-ui/core'

import {hrmangoColors, typography, spacing} from 'lib/hrmangoTheme'

type JobCardType = {
  id: number
  name: string
  description: string
  city: string
  state: string
  country: string
}

const JobCard = ({id, name, description, city, state, country}: JobCardType) => {
  type InfoType = {
    key: string
    text: string
    data?: string
  }

  const useStyles = makeStyles(({shadows}) => ({
    cardContainer: {
      border: `1px solid ${hrmangoColors.outline}`,
      backgroundColor: hrmangoColors.white,
      boxShadow: shadows[4],
      marginTop: spacing[32],
      minHeight: 100
    },
    topContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: `${spacing[12]}px 0px 0px ${spacing[12]}px`
    },
    textContainer: {
      padding: `0px ${spacing[12]}px ${spacing[28]}px ${spacing[12]}px`,
      borderBottom: `1px solid ${hrmangoColors.outline}`,
      display: 'flex',
      justifyContent: 'space-between'
    },
    name: {
      ...typography.subtitle1,
      color: hrmangoColors.lightVariant,
      margin: spacing[0],
      wordBreak: 'break-word'
    },
    description: {
      ...typography.body2,
      color: hrmangoColors.onSurfaceLight.mediumEmphasis,
      margin: spacing[0],
      marginTop: spacing[4],
      wordBreak: 'break-word'
    },

    jobText: {
      ...typography.overline,
      textTransform: 'uppercase',
      color: hrmangoColors.onSurfaceLight.disabled,
      margin: 0
    },
    jobData: {
      ...typography.subtitle1,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      margin: 0,
      wordBreak: 'break-word'
    },
    dataContainer: {
      padding: `${spacing[8]}px ${spacing[12]}px ${spacing[16]}px ${spacing[12]}px`,
      display: 'flex',
      justifyContent: 'space-between'
    },
    iconButton: {
      height: 30,
      marginTop: spacing[12]
    },
    descriptionIconButton: {
      height: 30
    }
  }))

  const JobInfo = ({key, text, data}: InfoType) => {
    return (
      <div key={key}>
        <p className={classes.jobText}>{text}</p>
        <p className={classes.jobData}>{data || 0}</p>
      </div>
    )
  }

  const classes = useStyles()

  return (
    <div className={classes.cardContainer}>
      <div className={classes.topContainer}>
        <p className={classes.name}>{name}</p>
      </div>
      <div className={classes.textContainer}>
        <p className={classes.description}>{description}</p>
      </div>
      <div className={classes.dataContainer}>
        <JobInfo key={`City-${id}`} text='City' data={city} />
        <JobInfo key={`State-${id}`} text='State' data={state} />
        <JobInfo key={`Country-${id}`} text='Country' data={country} />
      </div>
    </div>
  )
}

export default JobCard
