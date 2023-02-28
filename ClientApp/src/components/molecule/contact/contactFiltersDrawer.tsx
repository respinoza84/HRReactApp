import {useState} from 'react'

import {Button, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

import {spacing, typography} from 'lib/hrmangoTheme'
//import {ContactFilterInput} from 'graphql/types.generated'
import {FilterList} from '@material-ui/icons'

export type ContactFiltersDrawerType = {
  loaded: boolean
  defaultFilters: any // CompanyFilterInput
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
    width: '355px'
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
  }
}))

const ContactFiltersDrawer = ({loaded, defaultFilters, applyHandler, closeHandler}: ContactFiltersDrawerType) => {
  const classes = useStyles()

  const [filters, setFilters] = useState</*ContactFilterInput*/ any>()

  /*const showReset = useMemo(() => {
    return filters?.fromDate !== defaultFilters?.fromDate || filters?.toDate !== defaultFilters?.toDate
  }, [filters]) // eslint-disable-line*/

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
            <FilterList fontSize='small' color='inherit' /> Filter Contact
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
          id='companyName'
          label='Company Name'
          margin='normal'
          variant='outlined'
          value={filters?.companyName}
          //error={isError.companyName}
          onChange={(e: any) => {
            //e.target.value.length < 257 && dispatch({type: 'setFilters', ...filters!, companyName: e.target.value})
            setFilters({...filters!, companyName: e.target.value})
          }}
          fullWidth
          //helperText={isError.companyName ? errorText.companyNameError : ''}
        />
        <TextField
          className={classes.textField}
          id='state'
          label='State'
          margin='normal'
          variant='outlined'
          value={filters?.state}
          //error={isError.companyName}
          onChange={(e: any) => {
            //e.target.value.length < 257 && dispatch({type: 'setFilters', ...filters!, companyName: e.target.value})
            setFilters({...filters!, state: e.target.value})
          }}
          fullWidth
          //helperText={isError.companyName ? errorText.companyNameError : ''}
        />
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

        <Button variant='outlined' className={classes.buttonReset} onClick={handleReset} /*disabled={!showReset}*/>
          RESET ALL
        </Button>
      </div>
    </div>
  )
}

export default ContactFiltersDrawer
