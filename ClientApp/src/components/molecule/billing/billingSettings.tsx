import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {LocationState} from 'type'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {Box, Container, TextField, MenuItem, Button, InputAdornment, FormControl} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {BillingSettings as BillingSettingsProperties} from 'graphql/types.generated'
import {setToast, setSpinner} from 'store/action/globalActions'
//import {ErrorMessages} from 'type/errorMessage'
import {createSettings, updateSettings} from 'api/billingApi'
import {Save} from '@material-ui/icons'

import {useGetBillingSettingsByIdAsyncQuery} from 'graphql/Billing/GetBillingSettingsQuery.generated'
import {Terms} from 'type/billing/billingEnums'
import {DateTimePicker} from '@material-ui/pickers'
import enLocale from 'date-fns/locale/en-US'
import MuiPickersTzUtilsProvider from 'lib/atom/datePicker/MuiPickersTzUtilsProvider'
import DateFnsTzUtils from 'lib/atom/datePicker/DateFnsTzUtils'

const defaultBillingSettings = {
  companyId: 0,
  jobId: 0,
  executiveFeeSalary: 0,
  executiveFeePercentage: 0,
  sharedRiskPerHireFee: 0,
  sharedRiskMonthlyFee: 0,
  contractorOverridePercentage: 0,
  directHirePercentage: 0,
  executiveFeeOwed: 0,
  directHireSalary: 0,
  directFeeOwed: 0,
  contractorOverridePerHour: 0,
  contractorHourlyRate: 0,
  contractorClientInvoiceAmount: 0,
  sharedRiskMonthlyRenewalDate: new Date(),
  contractValidalityDate: new Date(),
  terms: ''
}

const BillingSettings = withRouter(
  ({
    match,
    location,
    history
  }: RouteComponentProps<{companyId: string; jobId: string}, StaticContext, LocationState>) => {
    const useStyles = makeStyles((theme: Theme) => ({
      rowHeader: {
        ...typography.h6
      },
      row: {
        display: 'flex',
        paddingLeft: spacing[48],
        paddingRight: spacing[48],
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px'
        },
        '& .MuiFormGroup-root': {
          flexWrap: 'nowrap'
        },
        '& .MuiFormControl-root': {
          minWidth: '45%'
        }
      },
      rowSpace: {
        padding: spacing[32]
      },
      textField: {
        '& .MuiFilledInput-input': {
          padding: '16px 13px'
        }
      },
      button: {
        ...typography.buttonGreen,
        textTransform: 'capitalize'
      },
      menuItem: {
        '&:focus': {
          '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: hrmangoColors.lightGray
          }
        }
      }
    }))
    const [settings, setSettings] = useState<BillingSettingsProperties>(defaultBillingSettings)
    const classes = useStyles()
    const dispatch = useDispatch()
    const [isError, setIsError] = useState({
      executiveFeePercentage: false,
      executiveFeeSalary: false,
      sharedRiskPerHireFee: false,
      sharedRiskMonthlyFee: false,
      contractorOverridePercentage: false,
      directHirePercentage: false,
      executiveFeeOwed: false,
      directHireSalary: false,
      directFeeOwed: false,
      contractorOverridePerHour: false,
      contractorHourlyRate: false,
      contractorClientInvoiceAmount: false,
      terms: false
    })
    const [errorText, setErrorText] = useState({
      executiveFeePercentageError: 'Please enter a valid Executive Fee Percentage',
      executiveFeeSalaryError: 'Please enter a valid Executive Fee Salary',
      sharedRiskPerHireFeeError: 'Please enter a valid Shared Risk Percentage',
      sharedRiskMonthlyFeeError: 'Please enter a valid Shared Risk Monthly',
      contractorOverridePercentageError: 'Please enter a valid Contractor Override Percentage',
      directHirePercentageError: 'Please enter a valid Direct Hire Percentage',
      executiveFeeOwedError: 'Please enter a valid Executive Fee Owed',
      directHireSalaryError: 'Please enter a valid Direct Hire Salary',
      directFeeOwedError: 'Please enter a valid Direct Fee Owed',
      contractorOverridePerHourError: 'Please enter a valid Contractor Override Per Hour',
      contractorHourlyRateError: 'Please enter a valid Contractor Hourly Rate',
      contractorClientInvoiceAmountError: 'Please enter a valid Contractor Client Invoice Amount',
      termsError: 'Please enter a valid Terms'
    })

    const createBillingSettings = useMutation(
      (id: any) => (id && id !== 0 ? updateSettings(id, settings) : createSettings(settings)),
      {
        onMutate: () => {
          dispatch(setSpinner(true))
        },
        onError: (error: any) => {
          dispatch(setSpinner(false))
          dispatch(
            setToast({
              message: `Error saving the billing settings: ${error.errorMessage}`,
              type: 'error'
            })
          )

          let executiveFeePercentageError = {text: '', error: false}
          const executiveFeeSalaryError = {text: '', error: false}
          let sharedRiskPerHireFeeError = {text: '', error: false}
          let sharedRiskMonthlyFeeError = {text: '', error: false}
          let contractorOverridePercentageError = {text: '', error: false}
          let directHirePercentageError = {text: '', error: false}
          let termsError = {text: '', error: false}
          const executiveFeeOwedError = {text: '', error: false}
          const directHireSalaryError = {text: '', error: false}
          const directFeeOwedError = {text: '', error: false}
          const contractorOverridePerHourError = {text: '', error: false}
          const contractorHourlyRateError = {text: '', error: false}
          const contractorClientInvoiceAmountError = {text: '', error: false}

          error?.fieldMessages.forEach((fieldMessage) => {
            if (fieldMessage.fieldId === 'executiveFeePercentage') {
              executiveFeePercentageError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'sharedRiskPerHireFee') {
              sharedRiskPerHireFeeError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'sharedRiskMonthlyFee') {
              sharedRiskMonthlyFeeError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'contractorOverridePercentage') {
              contractorOverridePercentageError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'directHirePercentage') {
              directHirePercentageError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'terms') {
              termsError = {text: fieldMessage.message, error: true}
            }
          })

          setErrorText({
            executiveFeePercentageError: executiveFeePercentageError.text,
            executiveFeeSalaryError: executiveFeeSalaryError.text,
            sharedRiskPerHireFeeError: sharedRiskPerHireFeeError.text,
            sharedRiskMonthlyFeeError: sharedRiskMonthlyFeeError.text,
            contractorOverridePercentageError: contractorOverridePercentageError.text,
            directHirePercentageError: directHirePercentageError.text,
            executiveFeeOwedError: executiveFeeOwedError.text,
            directHireSalaryError: directHireSalaryError.text,
            directFeeOwedError: directFeeOwedError.text,
            contractorOverridePerHourError: contractorOverridePerHourError.text,
            contractorHourlyRateError: contractorHourlyRateError.text,
            contractorClientInvoiceAmountError: contractorClientInvoiceAmountError.text,
            termsError: termsError.text
          })
          setIsError({
            executiveFeePercentage: executiveFeePercentageError.error,
            executiveFeeSalary: executiveFeeSalaryError.error,
            sharedRiskPerHireFee: sharedRiskPerHireFeeError.error,
            sharedRiskMonthlyFee: sharedRiskMonthlyFeeError.error,
            contractorOverridePercentage: contractorOverridePercentageError.error,
            directHirePercentage: directHirePercentageError.error,
            executiveFeeOwed: executiveFeeOwedError.error,
            directHireSalary: directHireSalaryError.error,
            directFeeOwed: directFeeOwedError.error,
            contractorOverridePerHour: contractorOverridePerHourError.error,
            contractorHourlyRate: contractorHourlyRateError.error,
            contractorClientInvoiceAmount: contractorClientInvoiceAmountError.error,
            terms: termsError.error
          })
        },
        onSuccess: (data: any) => {
          dispatch(setSpinner(false))
          dispatch(
            setToast({
              message: `Billing settings successfully saved.`,
              type: 'success'
            })
          )
          refetch()
        },
        retry: 0
      }
    )

    const companyId = match.params.companyId ?? 0
    const jobId = match.params.jobId ?? 0
    const {data, isSuccess, isFetching, refetch} = useGetBillingSettingsByIdAsyncQuery(
      {
        companyId: parseInt(companyId),
        jobId: parseInt(jobId)
      },
      {enabled: false}
    )

    useEffect(() => {
      if (companyId || jobId) refetch()
      // eslint-disable-next-line
    }, [companyId, jobId])

    useEffect(() => {
      dispatch(setSpinner(isFetching))
      // eslint-disable-next-line
    }, [isFetching])

    useEffect(() => {
      setSettings({
        ...data?.billingSettingsById,
        companyId: match.params.companyId
          ? parseInt(match.params.companyId)
          : data?.billingSettingsById?.companyId ?? null,
        jobId: match.params.jobId ? parseInt(match.params.jobId) : data?.billingSettingsById?.jobId ?? null,
        id: match.params.companyId
          ? data?.billingSettingsById?.id
          : match.params.jobId && data?.billingSettingsById?.jobId
          ? data?.billingSettingsById?.id
          : null
      })
      // eslint-disable-next-line
    }, [data?.billingSettingsById, isSuccess])

    return (
      <div>
        <Container>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              className={classes.textField}
              id='executiveFeeSalary'
              label='Executive Fee Salary'
              margin='normal'
              variant='outlined'
              value={settings?.executiveFeeSalary}
              error={isError.executiveFeePercentage}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, executiveFeeSalary: e.target.value})
              }}
              fullWidth
              helperText={isError.executiveFeeSalary ? errorText.executiveFeeSalaryError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='executiveFeePercentage'
              label='Executive Fee Percentage'
              margin='normal'
              variant='outlined'
              value={settings?.executiveFeePercentage}
              error={isError.executiveFeePercentage}
              InputProps={{
                endAdornment: <InputAdornment position='end'>%</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, executiveFeePercentage: e.target.value})
              }}
              fullWidth
              helperText={isError.executiveFeePercentage ? errorText.executiveFeePercentageError : ''}
            />
          </Box>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='executiveFeeOwed'
              label='Executive Fee Owed'
              margin='normal'
              variant='outlined'
              value={settings?.executiveFeeOwed}
              error={isError.executiveFeeOwed}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, executiveFeeOwed: e.target.value})
              }}
              fullWidth
              helperText={isError.executiveFeeOwed ? errorText.executiveFeeOwedError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='directHireSalary'
              label='Direct Hire Salary'
              margin='normal'
              variant='outlined'
              value={settings?.directHireSalary}
              error={isError.directHireSalary}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, directHireSalary: e.target.value})
              }}
              fullWidth
              helperText={isError.directHireSalary ? errorText.directHireSalaryError : ''}
            />
          </Box>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              className={classes.textField}
              id='directHirePercentage'
              label='Direct Hire Percentage'
              margin='normal'
              variant='outlined'
              value={settings?.directHirePercentage}
              error={isError.directHirePercentage}
              InputProps={{
                endAdornment: <InputAdornment position='end'>%</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, directHirePercentage: e.target.value})
              }}
              fullWidth
              helperText={isError.directHirePercentage ? errorText.directHirePercentageError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='directFeeOwed'
              label='Direct Fee Owed'
              margin='normal'
              variant='outlined'
              value={settings?.directFeeOwed}
              error={isError.directFeeOwed}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, directFeeOwed: e.target.value})
              }}
              fullWidth
              helperText={isError.directFeeOwed ? errorText.directFeeOwedError : ''}
            />
          </Box>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='sharedRiskMonthlyFee'
              label='Shared Risk Monthly Fee'
              margin='normal'
              variant='outlined'
              value={settings?.sharedRiskMonthlyFee}
              error={isError.sharedRiskMonthlyFee}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, sharedRiskMonthlyFee: e.target.value})
              }}
              fullWidth
              helperText={isError.sharedRiskMonthlyFee ? errorText.sharedRiskMonthlyFeeError : ''}
            />
            <Box className={classes.rowSpace} />
            <div style={{paddingTop: spacing[16], minWidth: '45%'}}>
              <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
                <DateTimePicker
                  inputProps={{tabIndex: -1}}
                  autoOk
                  inputVariant='outlined'
                  variant='inline'
                  id='sharedRiskMonthlyRenewalDate'
                  label='Shared Risk Monthly Renewal Date'
                  format='yyyy-MM-dd hh:mm a (z)'
                  value={settings.sharedRiskMonthlyRenewalDate}
                  onChange={(date: any) => {
                    setSettings({...settings!, sharedRiskMonthlyRenewalDate: date})
                  }}
                  fullWidth
                />
              </MuiPickersTzUtilsProvider>
            </div>
          </Box>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='sharedRiskPerHireFee'
              label='Shared Risk Per Hire Fee'
              margin='normal'
              variant='outlined'
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
              value={settings.sharedRiskPerHireFee ?? undefined}
              error={isError.sharedRiskPerHireFee}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, sharedRiskPerHireFee: e.target.value})
              }}
              fullWidth
              helperText={isError.sharedRiskPerHireFee ? errorText.sharedRiskPerHireFeeError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='contractorHourlyRate'
              label='Contractor Hourly Rate'
              margin='normal'
              variant='outlined'
              value={settings?.contractorHourlyRate}
              error={isError.contractorHourlyRate}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, contractorHourlyRate: e.target.value})
              }}
              fullWidth
              helperText={isError.contractorHourlyRate ? errorText.contractorHourlyRateError : ''}
            />
          </Box>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='contractorOverridePercentage'
              label='Contractor Override Percentage'
              margin='normal'
              variant='outlined'
              value={settings?.contractorOverridePercentage}
              error={isError.contractorOverridePercentage}
              InputProps={{
                endAdornment: <InputAdornment position='end'>%</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, contractorOverridePercentage: e.target.value})
              }}
              fullWidth
              helperText={isError.contractorOverridePercentage ? errorText.contractorOverridePercentageError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='contractorOverridePerHour'
              label='Contractor Override Per Hour'
              margin='normal'
              variant='outlined'
              value={settings?.contractorOverridePerHour}
              error={isError.contractorOverridePerHour}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, contractorOverridePerHour: e.target.value})
              }}
              fullWidth
              helperText={isError.contractorOverridePerHour ? errorText.contractorOverridePerHourError : ''}
            />
          </Box>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='contractorClientInvoiceAmount'
              label='Contractor Client Invoice Amount'
              margin='normal'
              variant='outlined'
              value={settings?.contractorClientInvoiceAmount}
              error={isError.contractorClientInvoiceAmount}
              InputProps={{
                endAdornment: <InputAdornment position='end'>$</InputAdornment>
              }}
              onChange={(e: any) => {
                e.target.value.length < 257 &&
                  setSettings({...settings!, contractorClientInvoiceAmount: e.target.value})
              }}
              fullWidth
              helperText={isError.contractorClientInvoiceAmount ? errorText.contractorClientInvoiceAmountError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              select
              className={classes.textField}
              id='terms'
              label='Terms'
              margin='normal'
              variant='outlined'
              value={settings.terms ?? ''}
              error={isError.terms}
              onChange={(e: any) => {
                e.target.value.length < 257 && setSettings({...settings!, terms: e.target.value})
              }}
              fullWidth
              helperText={isError.terms ? errorText.termsError : ''}
            >
              {Terms.map((option) => (
                <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box className={classes.row} style={{paddingTop: spacing[16]}}>
            <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
              <DateTimePicker
                inputProps={{tabIndex: -1}}
                autoOk
                inputVariant='outlined'
                variant='inline'
                id='contractValidalityDate'
                label='Contract Validality Date'
                format='yyyy-MM-dd hh:mm a (z)'
                value={settings.contractValidalityDate}
                onChange={(date: any) => {
                  setSettings({...settings!, contractValidalityDate: date})
                }}
                fullWidth
              />
            </MuiPickersTzUtilsProvider>
            <Box className={classes.rowSpace} />
            <FormControl component='div' fullWidth />
          </Box>
        </Container>

        <Box style={{display: 'flex', justifyContent: 'end', margin: `${spacing[24]}px`}}>
          <Button
            size='large'
            type='submit'
            variant='contained'
            className={classes.button}
            onClick={() => {
              setIsError({
                ...isError,
                /*executiveFeePercentage: !settings.executiveFeePercentage,
                sharedRiskPerHireFee: !settings.sharedRiskPerHireFee,
                sharedRiskMonthlyFee: !settings.sharedRiskMonthlyFee,
                contractorOverridePercentage: !settings.contractorOverridePercentage,
                directHirePercentage: !settings.directHirePercentage,*/
                terms: !settings.terms?.replace(/\s+/g, '').length
              })
              if (settings.terms?.replace(/\s+/g, '').length) {
                createBillingSettings.mutate(settings.id)
              }
            }}
          >
            <Save fontSize='small' color='inherit' /> Save
          </Button>
        </Box>
      </div>
    )
  }
)

export {BillingSettings}
