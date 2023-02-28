import {useState} from 'react'

import {Button, TextField, Box, MenuItem} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import {JobStageDescription} from 'type/job/jobEnums'
import {spacing, typography} from 'lib/hrmangoTheme'
import {JobCandidateFilterInput} from 'graphql/types.generated'
import {FilterList} from '@material-ui/icons'

export type JobCompanyApplicantFiltersDrawerType = {
  loaded: boolean
  defaultFilters: JobCandidateFilterInput
  applyHandler: (results: any) => void
  closeHandler: Function
  showReset: boolean
}

const useStyles = makeStyles(({palette, hrmangoColors}) => ({
  wrapper: {
    '& h2, h3, h4': {
      margin: spacing[0]
    },
    '& h2': {
      ...typography.h4
    },
    '& input.MuiAutocomplete-input:first-child': {
      font: 'inherit !important',
      color: 'currentColor !important',
      margin: '0px !important'
    },
    '& .MuiButton-outlinedPrimary:hover': {
      border: `1px solid ${palette.primary.light}`,
      background: 'none'
    }
  },
  header: {
    display: 'flex',
    width: '100%',
    borderBottom: '1px solid ' + hrmangoColors.outline,
    backgroundColor: hrmangoColors.menuBar
  },
  headerLeft: {
    width: '50%',
    margin: `${spacing[10]}px`
  },
  headerRight: {
    width: '50%',
    textAlign: 'right',
    margin: `${spacing[10]}px`
  },
  closeIcon: {
    color: hrmangoColors.dark,
    cursor: 'pointer'
  },
  section: {
    margin: `${spacing[16]}px`
  },
  bottomSection: {
    padding: `12px ${spacing[24]}px`,
    paddingBottom: '10px',
    borderTop: '1px solid ' + hrmangoColors.outline,
    borderBottom: '1px solid ' + hrmangoColors.outline,
    height: '100%'
  },
  separator: {
    borderBottom: '1px solid ' + hrmangoColors.outline
  },
  label: {
    color: hrmangoColors.onSurfaceLight.mediumEmphasis,
    ...typography.body2
  },
  date: {
    color: hrmangoColors.onSurfaceLight.highEmphasis,
    ...typography.body2
  },
  buttonsWrapper: {
    margin: `${spacing[32]}px ${spacing[24]}px`,
    marginTop: `${spacing[16]}px`,
    display: 'flex',
    position: 'absolute',
    bottom: '80px',
    width: '355px',
    '& .Mui-disabled': {
      backgroundColor: hrmangoColors.lightGray,
      color: hrmangoColors.white
    }
  },
  button: {
    ...typography.buttonGreen,
    width: '50%'
  },
  buttonReset: {
    ...typography.buttonDense,
    marginLeft: '12px',
    border: `1px solid ${palette.primary.light}`,
    width: '50%'
  },
  textField: {
    '& .MuiFilledInput-input': {
      padding: '16px 13px'
    }
  },
  row: {
    display: 'flex'
  },
  rowSpace: {
    padding: spacing[24]
  },
  menuItem: {
    '&:focus': {
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: hrmangoColors.lightGray
      }
    }
  }
}))

const JobCompanyApplicantFiltersDrawer = ({
  loaded,
  defaultFilters,
  applyHandler,
  closeHandler,
  showReset
}: JobCompanyApplicantFiltersDrawerType) => {
  const classes = useStyles()

  const [filters, setFilters] = useState<JobCandidateFilterInput>(defaultFilters)

  const handleClose = () => {
    closeHandler()
  }

  const handleApply = () => {
    applyHandler(filters)
    closeHandler()
  }

  const handleReset = () => {
    applyHandler({})
    closeHandler()
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <h3>
            <FilterList fontSize='small' color='inherit' /> Filter Job
          </h3>
        </div>
        <div className={classes.headerRight}>
          <span title='Close'>
            <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          </span>
        </div>
      </div>
      <div className={classes.bottomSection}>
        <TextField
          className={classes.textField}
          id='applicantName'
          label='Candidate Name'
          margin='normal'
          variant='outlined'
          value={filters?.applicantName}
          onChange={(e: any) => {
            setFilters({...filters!, applicantName: e.target.value})
          }}
          fullWidth
        />
        <TextField
          className={classes.textField}
          id='candidateCellPhone'
          label='Mobile Phone'
          margin='normal'
          variant='outlined'
          value={filters?.candidateCellPhone}
          onChange={(e: any) => {
            e.target.value.length < 257 && setFilters({...filters!, candidateCellPhone: e.target.value})
          }}
          fullWidth
        />
        <TextField
          className={classes.textField}
          id='candidateEmail'
          label='Email'
          margin='normal'
          variant='outlined'
          value={filters?.candidateEmail}
          onChange={(e: any) => {
            e.target.value.length < 257 && setFilters({...filters!, candidateEmail: e.target.value})
          }}
          fullWidth
        />
        <TextField
          className={classes.textField}
          id='stageDescription'
          label='Status'
          margin='normal'
          variant='outlined'
          defaultValue='Open'
          value={filters?.stageDescription}
          onChange={(e: any) => {
            e.target.value.length < 257 && setFilters({...filters!, stageDescription: e.target.value})
          }}
          fullWidth
          select
        >
          {JobStageDescription.map((option) => (
            <MenuItem key={option.label} value={option.label} className={classes.menuItem}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Box className={classes.row}>
          <TextField
            className={classes.textField}
            id='FromDate'
            label='From'
            margin='normal'
            variant='outlined'
            value={filters?.fromDate}
            type='date'
            InputLabelProps={{
              shrink: true
            }}
            onChange={(e: any) => {
              e.target.value.length < 257 && setFilters({...filters!, fromDate: e.target.value})
            }}
          />
          <Box className={classes.rowSpace} />
          <TextField
            className={classes.textField}
            id='ToDate'
            label='To'
            margin='normal'
            variant='outlined'
            value={filters?.toDate}
            type='date'
            InputLabelProps={{
              shrink: true
            }}
            onChange={(e: any) => {
              e.target.value.length < 257 && setFilters({...filters!, toDate: e.target.value})
            }}
          />
        </Box>
      </div>

      <div className={classes.buttonsWrapper}>
        <Button variant='contained' className={classes.button} onClick={handleApply}>
          APPLY
        </Button>

        <Button variant='outlined' className={classes.buttonReset} onClick={handleReset} disabled={!showReset}>
          RESET ALL
        </Button>
      </div>
    </div>
  )
}

export default JobCompanyApplicantFiltersDrawer
