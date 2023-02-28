import {useMemo, useState} from 'react'

import {Button, TextField, Box, FormControl, Checkbox, FormControlLabel, FormGroup, MenuItem} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

import {spacing, typography} from 'lib/hrmangoTheme'
import {BillingFilterInput} from 'graphql/types.generated'
import {FilterList} from '@material-ui/icons'
import {JobType, JobVertical} from 'type/job/jobEnums'
import {Autocomplete} from '@material-ui/lab'
import {RouteComponentProps, StaticContext, withRouter} from 'react-router'
import {LocationState} from 'type'

export type InvoiceFiltersDrawerType = {
  defaultFilters: BillingFilterInput
  applyHandler: (results: any) => void
  closeHandler: Function
  resetSearch: Function
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
    borderBottom: '1px solid ' + hrmangoColors.outline
    //height: '100%'
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
    display: 'inline-flex',
    //position: 'absolute',
    paddingBottom: '70px',
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

const InvoiceFiltersDrawer = withRouter(
  ({
    match,
    defaultFilters,
    applyHandler,
    closeHandler
  }: InvoiceFiltersDrawerType & RouteComponentProps<{companyId: string}, StaticContext, LocationState>) => {
    const classes = useStyles()

    const [filters, setFilters] = useState<BillingFilterInput>(defaultFilters)

    const showReset = useMemo(() => {
      return (
        filters?.fromDate !== defaultFilters?.fromDate ||
        filters?.toDate !== defaultFilters?.toDate ||
        filters?.companyName !== defaultFilters?.companyName ||
        filters?.jobName !== defaultFilters?.jobName ||
        filters?.jobType !== defaultFilters?.jobType ||
        filters?.jobVertical !== defaultFilters?.jobVertical ||
        filters?.companyContact !== defaultFilters?.companyContact ||
        filters?.invoiced !== defaultFilters?.invoiced ||
        filters?.paid !== defaultFilters?.paid ||
        filters?.paymentFromDate !== defaultFilters?.paymentFromDate ||
        filters?.paymentToDate !== defaultFilters?.paymentToDate ||
        filters?.notificationFromDate !== defaultFilters?.notificationFromDate ||
        filters?.notificationToDate !== defaultFilters?.notificationToDate
      )
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
              <FilterList fontSize='small' color='inherit' /> Invoice Filters
            </h3>
          </div>
          <div className={classes.headerRight}>
            <span title='Close'>
              <CloseIcon className={classes.closeIcon} onClick={handleClose} />
            </span>
          </div>
        </div>
        <div className={classes.bottomSection}>
          {!match.params.companyId && (
            <TextField
              className={classes.textField}
              id='companyName'
              label='Company Name'
              margin='normal'
              variant='outlined'
              value={filters?.companyName}
              onChange={(e: any) => {
                e.target.value.length < 257 && setFilters({...filters!, companyName: e.target.value})
              }}
              fullWidth
            />
          )}
          <TextField
            className={classes.textField}
            id='jobName'
            label='Job Name'
            margin='normal'
            variant='outlined'
            value={filters?.jobName}
            onChange={(e: any) => {
              e.target.value.length < 257 && setFilters({...filters!, jobName: e.target.value})
            }}
            fullWidth
          />
          <TextField
            className={classes.textField}
            id='jobType'
            label='Job Type'
            margin='normal'
            variant='outlined'
            value={filters?.jobType}
            onChange={(e: any) => {
              e.target.value.length < 257 && setFilters({...filters!, jobType: e.target.value})
            }}
            fullWidth
            select
          >
            {JobType.map((option) => (
              <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Autocomplete
            id='jobVertical'
            freeSolo
            options={JobVertical}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                required
                {...params}
                className={classes.textField}
                label='Job Vertical'
                margin='normal'
                variant='outlined'
              />
            )}
            fullWidth
            inputValue={filters?.jobVertical ?? ''}
            onInputChange={(e: any, select: any) => {
              select?.length < 257 && setFilters({...filters!, jobVertical: select})
            }}
          />
          {!match.params.companyId && (
            <TextField
              className={classes.textField}
              id='companyContact'
              label='Company Contact'
              margin='normal'
              variant='outlined'
              value={filters?.companyContact}
              onChange={(e: any) => {
                e.target.value.length < 257 && setFilters({...filters!, companyContact: e.target.value})
              }}
              fullWidth
            />
          )}
          <FormControl component='div' fullWidth>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    inputProps={{tabIndex: -1}}
                    checked={filters?.invoiced}
                    onChange={(e: any) => {
                      setFilters({...filters!, invoiced: e.target.checked})
                    }}
                    name='invoiced'
                  />
                }
                label='Invoiced'
              />
            </FormGroup>
          </FormControl>
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
          <FormControl component='div' fullWidth>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    inputProps={{tabIndex: -1}}
                    checked={filters?.paid}
                    onChange={(e: any) => {
                      setFilters({...filters!, paid: e.target.checked})
                    }}
                    name='paid'
                  />
                }
                label='Paid'
              />
            </FormGroup>
          </FormControl>
          {!match.params.companyId && (
            <>
              <Box className={classes.row}>
                <TextField
                  className={classes.textField}
                  id='paymentFromDate'
                  label='Payment From Date'
                  margin='normal'
                  variant='outlined'
                  value={filters?.paymentFromDate}
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                  //error={isError.fromDate}
                  onChange={(e: any) => {
                    e.target.value.length < 257 && setFilters({...filters!, paymentFromDate: e.target.value})
                  }}
                  //helperText={isError.fromDate ? errorText.fromDateError : ''}
                />
                <Box className={classes.rowSpace} />
                <TextField
                  className={classes.textField}
                  id='paymentToDate'
                  label='Payment To Date'
                  margin='normal'
                  variant='outlined'
                  value={filters?.paymentToDate}
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                  //error={isError.fromDate}
                  onChange={(e: any) => {
                    e.target.value.length < 257 && setFilters({...filters!, paymentToDate: e.target.value})
                  }}
                  //helperText={isError.toDate ? errorText.toDateError : ''}
                />
              </Box>
              <Box className={classes.row}>
                <TextField
                  className={classes.textField}
                  id='notificationFromDate'
                  label='Notification From Date'
                  margin='normal'
                  variant='outlined'
                  value={filters?.notificationFromDate}
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                  //error={isError.fromDate}
                  onChange={(e: any) => {
                    e.target.value.length < 257 && setFilters({...filters!, notificationFromDate: e.target.value})
                  }}
                  //helperText={isError.fromDate ? errorText.fromDateError : ''}
                />
                <Box className={classes.rowSpace} />
                <TextField
                  className={classes.textField}
                  id='notificationToDate'
                  label='Notification To Date'
                  margin='normal'
                  variant='outlined'
                  value={filters?.notificationToDate}
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                  //error={isError.fromDate}
                  onChange={(e: any) => {
                    e.target.value.length < 257 && setFilters({...filters!, notificationToDate: e.target.value})
                  }}
                  //helperText={isError.toDate ? errorText.toDateError : ''}
                />
              </Box>
            </>
          )}
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
)

export default InvoiceFiltersDrawer
