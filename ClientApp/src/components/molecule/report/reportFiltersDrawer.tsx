import {Box, Button, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import {spacing, typography} from 'lib/hrmangoTheme'
import {FilterList} from '@material-ui/icons'
import {DateTimePicker} from '@material-ui/pickers'
import enLocale from 'date-fns/locale/en-US'
import DateFnsTzUtils from 'lib/atom/datePicker/DateFnsTzUtils'
import MuiPickersTzUtilsProvider from 'lib/atom/datePicker/MuiPickersTzUtilsProvider'
import {useState} from 'react'

export type ReportFiltersDrawerType = {
  loaded: boolean
  filters: any
  setFilters: any
  applyHandler: (results: any) => void
  resetHandler: () => void
  closeHandler: Function
  filterType: string
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

const ReportFiltersDrawer = ({
  filters,
  setFilters,
  applyHandler,
  resetHandler,
  closeHandler,
  filterType,
  showReset
}: ReportFiltersDrawerType) => {
  const classes = useStyles()
  const [useFilters, setUseFilters] = useState(filters)

  const handleClose = () => {
    closeHandler()
  }

  const handleApply = () => {
    applyHandler(useFilters)
    closeHandler()
  }

  const handleReset = () => {
    resetHandler()
    closeHandler()
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <h3>
            <FilterList fontSize='small' color='inherit' /> Filter Report
          </h3>
        </div>
        <div className={classes.headerRight}>
          <span title='Close'>
            <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          </span>
        </div>
      </div>
      <div className={classes.bottomSection}>
        {filterType === 'metrics' && (
          <>
            <TextField
              className={classes.textField}
              id='jobName'
              label='Job Name'
              margin='normal'
              variant='outlined'
              value={useFilters?.jobName}
              //error={isError.jobName}
              onChange={(e: any) => {
                e.target.value.length < 257 && setUseFilters({...useFilters!, jobName: e.target.value})
              }}
              fullWidth
            />
            <TextField
              className={classes.textField}
              id='companyName'
              label='Company Name'
              margin='normal'
              variant='outlined'
              value={useFilters?.companyName}
              //error={isError.companyName}
              onChange={(e: any) => {
                e.target.value.length < 257 && setUseFilters({...useFilters!, companyName: e.target.value})
              }}
              fullWidth
            />
          </>
        )}
        <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
          <Box style={{paddingTop: spacing[16]}}>
            <DateTimePicker
              inputProps={{tabIndex: -1}}
              autoOk
              inputVariant='outlined'
              variant='inline'
              id='fromDate'
              label={`From`}
              format='yyyy-MM-dd hh:mm a (z)'
              value={useFilters?.fromDate}
              onChange={(date: any) => {
                setUseFilters({...useFilters!, fromDate: date})
              }}
              fullWidth
            />
          </Box>
          <Box style={{paddingTop: spacing[28]}}>
            <DateTimePicker
              inputProps={{tabIndex: -1}}
              autoOk
              inputVariant='outlined'
              variant='inline'
              id='toDate'
              label={`To`}
              format='yyyy-MM-dd hh:mm a (z)'
              value={useFilters?.toDate}
              onChange={(date: any) => {
                setUseFilters({...useFilters!, toDate: date})
              }}
              fullWidth
            />
          </Box>
        </MuiPickersTzUtilsProvider>
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

export default ReportFiltersDrawer
