import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {Box, Container, TextField, Button} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {BillingItem} from 'graphql/types.generated'
import {setToast, setSpinner} from 'store/action/globalActions'
//import {ErrorMessages} from 'type/errorMessage'
import {createBillingItem, updateBillingItem} from 'api/billingApi'
import {Save} from '@material-ui/icons'
//import {isNumeric} from 'utility'
import {DateTimePicker} from '@material-ui/pickers'
//import DateFnsUtils from '@date-io/date-fns'
import enLocale from 'date-fns/locale/en-US'
import DateFnsTzUtils from 'lib/atom/datePicker/DateFnsTzUtils'
import MuiPickersTzUtilsProvider from 'lib/atom/datePicker/MuiPickersTzUtilsProvider'
import {useGetBillingItemDetailByIdAsyncQuery} from 'graphql/Billing/GetBillingItemDetailByIdQuery.generated'
import '../../../custom.css'

const defaultBillingItem = {
  id: 0,
  companyId: 0,
  units: 0,
  hoursWorked: 0,
  adExp: 0,
  reqNumber: '',
  startDate: undefined,
  description: '',
  supervisor: '',
  costCenter: '',
  sharedRiskMonthly: 0,
  perPerson: 0,
  directHire: 0,
  hourly: 0
}

type billingItemType = {
  onClose: () => void
  refetch?: any
  billingItemId: any
  companyId?: any
  jobId?: any
}

const BillingItemInfo = ({onClose, refetch, companyId, jobId, billingItemId}: billingItemType) => {
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
  const [billingItem, setBillingItem] = useState<BillingItem | undefined>({
    ...defaultBillingItem,
    companyId: companyId,
    jobId: jobId
  })
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isError, setIsError] = useState({
    units: false,
    hoursWorked: false,
    adExp: false,
    reqNumber: false,
    description: false,
    supervisor: false,
    costCenter: false,
    sharedRiskMonthly: false,
    perPerson: false,
    directHire: false,
    hourly: false
  })
  const [errorText, setErrorText] = useState({
    unitsError: 'Please enter a valid Unit',
    hoursWorkedError: 'Please enter a valid Hours Worked',
    adExpError: 'Please enter a valid Ad Exp',
    reqNumberError: 'Please enter a valid Req #',
    descriptionError: 'Please enter a valid Description',
    supervisorError: 'Please enter a valid Supervisor',
    costCenterError: 'Please enter a valid Cost Center',
    sharedRiskMonthlyError: 'Please enter a valid Shared Risk Monthly',
    perPersonError: 'Please enter a valid Per Person',
    directHireError: 'Please enter a valid Direct Hire',
    hourlyError: 'Please enter a valid Hourly'
  })

  const upsertBillingItem = useMutation(
    (id: any) =>
      id !== undefined && id !== 0
        ? updateBillingItem(id, billingItem ?? defaultBillingItem)
        : createBillingItem(billingItem ?? {}),
    {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error: any) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Error saving the Billing Item: ${error.errorMessage}`,
            type: 'error'
          })
        )

        let unitsError = {text: '', error: false}
        let hoursWorkedError = {text: '', error: false}
        let adExpError = {text: '', error: false}
        let reqNumberError = {text: '', error: false}
        let descriptionError = {text: '', error: false}
        let supervisorError = {text: '', error: false}
        let costCenterError = {text: '', error: false}
        let sharedRiskMonthlyError = {text: '', error: false}
        let perPersonError = {text: '', error: false}
        let directHireError = {text: '', error: false}
        let hourlyError = {text: '', error: false}

        error?.fieldMessages.forEach((fieldMessage) => {
          if (fieldMessage.fieldId === 'units') {
            unitsError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'hoursWorked') {
            hoursWorkedError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'adExp') {
            adExpError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'reqNumber') {
            reqNumberError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'description') {
            descriptionError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'supervisor') {
            supervisorError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'costCenter') {
            costCenterError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'sharedRiskMonthly') {
            sharedRiskMonthlyError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'perPerson') {
            perPersonError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'directHire') {
            directHireError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'hourly') {
            hourlyError = {text: fieldMessage.message, error: true}
          }
        })

        setErrorText({
          unitsError: unitsError.text,
          hoursWorkedError: hoursWorkedError.text,
          adExpError: adExpError.text,
          reqNumberError: reqNumberError.text,
          descriptionError: descriptionError.text,
          supervisorError: supervisorError.text,
          costCenterError: costCenterError.text,
          sharedRiskMonthlyError: sharedRiskMonthlyError.text,
          perPersonError: perPersonError.text,
          directHireError: directHireError.text,
          hourlyError: hourlyError.text
        })
        setIsError({
          units: unitsError.error,
          hoursWorked: hoursWorkedError.error,
          adExp: adExpError.error,
          reqNumber: reqNumberError.error,
          description: descriptionError.error,
          supervisor: supervisorError.error,
          costCenter: costCenterError.error,
          sharedRiskMonthly: sharedRiskMonthlyError.error,
          perPerson: perPersonError.error,
          directHire: directHireError.error,
          hourly: hourlyError.error
        })
      },
      onSuccess: (data: any) => {
        dispatch(setSpinner(false))
        data.json().then((billingItem) => {
          dispatch(
            setToast({
              message: `${billingItem.billingNumber} successfully saved.`,
              type: 'success'
            })
          )
        })
        refetch()
        onClose()
      },
      retry: 0
    }
  )

  useEffect(() => {
    if (billingItemId) {
      refetchItem()
      setBillingItem({
        ...billingItem!,
        companyId: companyId && companyId !== 0 ? companyId : data?.billingItemDetailById?.companyId ?? null,
        jobId: jobId && jobId !== 0 ? jobId : data?.billingItemDetailById?.jobId ?? 0
      })
    }
    // eslint-disable-next-line
  }, [billingItemId])

  const {data, isSuccess, isFetching, refetch: refetchItem} = useGetBillingItemDetailByIdAsyncQuery(
    {
      itemId: parseInt(billingItemId)
    },
    {enabled: false}
  )

  useEffect(() => {
    dispatch(setSpinner(isFetching))
    // eslint-disable-next-line
  }, [isFetching])

  useEffect(() => {
    setBillingItem({
      ...data?.billingItemDetailById,
      companyId: companyId && companyId !== 0 ? companyId : data?.billingItemDetailById?.companyId ?? null,
      jobId: jobId && jobId !== 0 ? jobId : data?.billingItemDetailById?.jobId ?? 0
    })
    // eslint-disable-next-line
  }, [data?.billingItemDetailById, isSuccess])
  function checkEmpty(billingItem) {
    if (!billingItem.hoursWorked) billingItem.hoursWorked = defaultBillingItem.hoursWorked
    if (!billingItem.sharedRiskMonthly) billingItem.sharedRiskMonthly = defaultBillingItem.sharedRiskMonthly
    if (!billingItem.perPerson) billingItem.perPerson = defaultBillingItem.perPerson
    if (!billingItem.directHire) billingItem.directHire = defaultBillingItem.directHire
    if (!billingItem.units) billingItem.units = defaultBillingItem.units
    if (!billingItem.hourly) billingItem.hourly = defaultBillingItem.hourly
  }
  return (
    <div>
      <Container>
        <Box className={classes.row} tabIndex={-1}>
          <TextField
            required
            type='number'
            className={classes.textField}
            id='units'
            label='Quantity'
            margin='normal'
            variant='outlined'
            value={billingItem?.units}
            error={isError.units}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 &&
                setBillingItem({
                  ...billingItem!,
                  units: e.target.value
                })
            }}
            fullWidth
            helperText={isError.units ? errorText.unitsError : ''}
          />
          <Box className={classes.rowSpace} />
          <TextField
            type='number'
            defaultValue='0'
            inputProps={{tabIndex: -1}}
            className={classes.textField}
            id='hoursWorked'
            label='Hours Worked'
            margin='normal'
            variant='outlined'
            value={billingItem?.hoursWorked ?? 0}
            error={isError.hoursWorked}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 && setBillingItem({...billingItem!, hoursWorked: e.target.value})
            }}
            fullWidth
            helperText={isError.hoursWorked ? errorText.hoursWorkedError : ''}
          />
        </Box>
        <Box className={classes.row} tabIndex={-1}>
          <TextField
            defaultValue='0'
            className={classes.textField}
            id='adExp'
            label='Add Exp'
            margin='normal'
            variant='outlined'
            value={billingItem?.adExp}
            error={isError.adExp}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 &&
                setBillingItem({
                  ...billingItem!,
                  adExp: e.target.value
                })
            }}
            fullWidth
            helperText={isError.adExp ? errorText.adExpError : ''}
          />
          <Box className={classes.rowSpace} />
          <TextField
            tabIndex={-1}
            className={classes.textField}
            id='reqNumber'
            label='Req #'
            margin='normal'
            variant='outlined'
            value={billingItem?.reqNumber ?? 0}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 &&
                setBillingItem({
                  ...billingItem!,
                  reqNumber: e.target.value
                })
            }}
            error={isError.reqNumber}
            fullWidth
            helperText={isError.reqNumber ? errorText.reqNumberError : ''}
          />
        </Box>
        <Box className={classes.row} style={{paddingTop: spacing[16]}}>
          <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
            <DateTimePicker
              inputProps={{tabIndex: -1}}
              autoOk
              inputVariant='outlined'
              variant='inline'
              id='startDate'
              label='Start Date'
              format='yyyy-MM-dd hh:mm a (z)'
              value={billingItem?.startDate}
              onChange={(date: any) => {
                setBillingItem({...billingItem!, startDate: date})
              }}
            />
          </MuiPickersTzUtilsProvider>
          <Box className={classes.rowSpace} />
          <TextField
            className={classes.textField}
            inputProps={{tabIndex: -1}}
            id='description'
            label='Description'
            margin='normal'
            variant='outlined'
            value={billingItem?.description}
            error={isError.description}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 && setBillingItem({...billingItem!, description: e.target.value})
            }}
            fullWidth
            helperText={isError.description ? errorText.descriptionError : ''}
          />
        </Box>
        <Box className={classes.row} tabIndex={-1}>
          <TextField
            className={classes.textField}
            inputProps={{tabIndex: -1}}
            id='supervisor'
            label='Supervisor'
            margin='normal'
            variant='outlined'
            value={billingItem?.supervisor}
            error={isError.supervisor}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 && setBillingItem({...billingItem!, supervisor: e.target.value})
            }}
            fullWidth
            helperText={isError.supervisor ? errorText.supervisorError : ''}
          />
          <Box className={classes.rowSpace} />
          <TextField
            className={classes.textField}
            inputProps={{tabIndex: -1}}
            id='costCenter'
            label='Cost Center'
            margin='normal'
            variant='outlined'
            value={billingItem?.costCenter}
            error={isError.costCenter}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 && setBillingItem({...billingItem!, costCenter: e.target.value})
            }}
            fullWidth
            helperText={isError.costCenter ? errorText.costCenterError : ''}
          />
        </Box>
        <Box className={classes.row}>
          <TextField
            type='number'
            defaultValue='0'
            className={classes.textField}
            id='sharedRiskMonthly'
            inputProps={{tabIndex: -1}}
            label='Shared Risk Monthly'
            margin='normal'
            variant='outlined'
            value={billingItem?.sharedRiskMonthly ?? undefined}
            error={isError.sharedRiskMonthly}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 && setBillingItem({...billingItem!, sharedRiskMonthly: e.target.value})
            }}
            fullWidth
            helperText={isError.sharedRiskMonthly ? errorText.sharedRiskMonthlyError : ''}
          />
          <Box className={classes.rowSpace} />
          <TextField
            type='number'
            defaultValue='0'
            className={classes.textField}
            id='perPerson'
            label='Per Person'
            margin='normal'
            variant='outlined'
            value={billingItem?.perPerson}
            error={isError.perPerson}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 && setBillingItem({...billingItem!, perPerson: e.target.value})
            }}
            fullWidth
            helperText={isError.perPerson ? errorText.perPersonError : ''}
          />
        </Box>
        <Box className={classes.row}>
          <TextField
            type='number'
            defaultValue='0'
            className={classes.textField}
            id='directHire'
            label='Direct Hire'
            margin='normal'
            variant='outlined'
            value={billingItem?.directHire}
            error={isError.directHire}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 && setBillingItem({...billingItem!, directHire: e.target.value})
            }}
            fullWidth
            helperText={isError.directHire ? errorText.directHireError : ''}
          />
          <Box className={classes.rowSpace} />
          <TextField
            required
            type='number'
            defaultValue='0'
            inputProps={{tabIndex: -1}}
            className={classes.textField}
            id='hourly'
            label='Hourly'
            margin='normal'
            variant='outlined'
            value={billingItem?.hourly ?? undefined}
            error={isError.hourly}
            InputLabelProps={{shrink: true}}
            onChange={(e: any) => {
              e.target.value.length < 257 && setBillingItem({...billingItem!, hourly: e.target.value})
            }}
            fullWidth
            helperText={isError.hourly ? errorText.hourlyError : ''}
          />
        </Box>
      </Container>

      <Box style={{display: 'flex', justifyContent: 'end', margin: `${spacing[24]}px`}}>
        <Button
          size='large'
          type='submit'
          variant='contained'
          className={classes.button}
          onClick={() => {
            checkEmpty(billingItem)
            upsertBillingItem.mutate(billingItem?.id)
          }}
        >
          <Save fontSize='small' color='inherit' /> Save
        </Button>
      </Box>
    </div>
  )
}

export {BillingItemInfo}
