import {useMemo, useState} from 'react'

import {Button, TextField, Box, MenuItem} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import {Status} from 'type/candidate/candidateEnums'

import {spacing, typography} from 'lib/hrmangoTheme'
import {CandidateFilterInput} from 'graphql/types.generated'
import {FilterList} from '@material-ui/icons'

export type CandidateFiltersDrawerType = {
  loaded: boolean
  defaultFilters: CandidateFilterInput
  applyHandler: (results: any) => void
  closeHandler: Function
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
    //fontWeight: typography.fontWeightMedium,
    width: '50%'
  },
  buttonReset: {
    ...typography.buttonDense,
    //fontWeight: typography.fontWeightMedium,
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
    //justifyContent: 'center',
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

const CandidateFiltersDrawer = ({loaded, defaultFilters, applyHandler, closeHandler}: CandidateFiltersDrawerType) => {
  const classes = useStyles()

  const [filters, setFilters] = useState<CandidateFilterInput>()

  const showReset = useMemo(() => {
    return filters?.fromDate !== defaultFilters?.fromDate || filters?.toDate !== defaultFilters?.toDate
  }, [filters]) // eslint-disable-line

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
            <FilterList fontSize='small' color='inherit' /> Filter Candidates
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
          id='candidateName'
          label='Candidate Name'
          margin='normal'
          variant='outlined'
          value={filters?.name}
          //error={isError.name}
          onChange={(e: any) => {
            //e.target.value.length < 257 && dispatch({type: 'setFilters', ...filters!, name: e.target.value})
            setFilters({...filters!, name: e.target.value})
          }}
          fullWidth
          //helperText={isError.name ? errorText.nameError : ''}
        />
        <TextField
          className={classes.textField}
          id='JobTitle'
          label='Job Title'
          margin='normal'
          variant='outlined'
          value={filters?.jobTitle}
          //error={isError.jobTitle}
          onChange={(e: any) => {
            //e.target.value.length < 257 && dispatch({type: 'setFilters', ...filters!, jobTitle: e.target.value})
            e.target.value.length < 257 && setFilters({...filters!, jobTitle: e.target.value})
          }}
          fullWidth
          //helperText={isError.jobTitle ? errorText.jobTitleError : ''}
        />
        <TextField
          className={classes.textField}
          id='Status'
          label='Status'
          margin='normal'
          variant='outlined'
          value={filters?.status}
          //error={isError.status}
          onChange={(e: any) => {
            //e.target.value.length < 257 && dispatch({type: 'setFilters', ...filters!, status: e.target.value})
            e.target.value.length < 257 && setFilters({...filters!, status: e.target.value})
          }}
          fullWidth
          select
          //helperText={isError.status ? errorText.statusError : ''}
        >
          {Status.map((option) => (
            <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className={classes.textField}
          id='Owner'
          label='Candidate Owner'
          margin='normal'
          variant='outlined'
          value={filters?.owner}
          //error={isError.owner}
          onChange={(e: any) => {
            //e.target.value.length < 257 && dispatch({type: 'setFilters', ...filters!, owner: e.target.value})
            e.target.value.length < 257 && setFilters({...filters!, owner: e.target.value})
          }}
          fullWidth
          //helperText={isError.owner ? errorText.ownerError : ''}
        />
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
            //error={isError.fromDate}
            onChange={(e: any) => {
              //e.target.value.length < 257 && dispatch({type: 'setFilters', ...filters!, fromDate: e.target.value})
              e.target.value.length < 257 && setFilters({...filters!, fromDate: e.target.value})
            }}
            //helperText={isError.fromDate ? errorText.fromDateError : ''}
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
            //error={isError.fromDate}
            onChange={(e: any) => {
              //e.target.value.length < 257 && dispatch({type: 'setFilters', ...toDate!, fromDate: e.target.value})
              e.target.value.length < 257 && setFilters({...filters!, toDate: e.target.value})
            }}
            //helperText={isError.toDate ? errorText.toDateError : ''}
          />
        </Box>
      </div>

      <div className={classes.buttonsWrapper}>
        <Button
          variant='contained'
          //disabled={applyButtonDisabled}
          className={classes.button}
          onClick={handleApply}
        >
          APPLY
        </Button>

        <Button variant='outlined' className={classes.buttonReset} onClick={handleReset} disabled={!showReset}>
          RESET ALL
        </Button>
      </div>
    </div>
  )
}

export default CandidateFiltersDrawer
