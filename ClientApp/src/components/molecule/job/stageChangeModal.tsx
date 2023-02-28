/*
  @author Oliver Zamora
  @description the stageChangesModal component.
*/
import {useEffect, useState} from 'react'
import {makeStyles, Button, TextField, Box, MenuItem} from '@material-ui/core'
import {useMutation} from 'react-query'
import {useDispatch} from 'react-redux'

import {setToast, setSpinner} from 'store/action/globalActions'
import {OfferStatus, NonSelectionReason, JobType, Frequency} from 'type/job/jobEnums'
import {spacing, typography} from 'lib/hrmangoTheme'
import HRModal from '../../page/shared/modal'
import {stageChange} from 'api/jobApi'
//import {format, utcToZonedTime} from 'date-fns-tz'
import enLocale from 'date-fns/locale/en-US'
import {DateTimePicker} from '@material-ui/pickers'
import DateFnsTzUtils from 'lib/atom/datePicker/DateFnsTzUtils'
import MuiPickersTzUtilsProvider from 'lib/atom/datePicker/MuiPickersTzUtilsProvider'
import {format} from 'date-fns'
import {useGetBillingSettingsByIdAsyncQuery} from 'graphql/Billing/GetBillingSettingsQuery.generated'
//import {BillingSettings} from 'graphql/types.generated'

type stageChangeModalType = {
  open: boolean
  applicant: any
  setApplicant: any
  refetch: any
  refetchActivies: any
  onClose: () => void
}

const StageChangeModal = ({onClose, applicant, open, setApplicant, refetch, refetchActivies}: stageChangeModalType) => {
  const useStyles = makeStyles(({hrmangoColors}) => ({
    content: {
      borderBottom: `1px solid ${hrmangoColors.lightGray}`,
      borderTop: `1px solid ${hrmangoColors.lightGray}`,
      //...hrmangoTypography.button,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      padding: `${spacing[12]}px ${spacing[24]}px ${spacing[48]}px`,
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      },
      '& .MuiFormControl-root': {
        minWidth: '35%'
      }
    },
    button: {
      ...typography.buttonGreen,
      //textTransform: 'capitalize'
      //...typography.button
      padding: `${spacing[10]}px ${spacing[16]}px`,
      margin: spacing[12]
    },
    buttonDense: {
      ...typography.buttonDense,
      textTransform: 'capitalize',
      padding: `${spacing[10]}px ${spacing[16]}px`,
      margin: spacing[12]
    },
    submitButton: {
      color: hrmangoColors.onSurfaceDark.highEmphasis
    },
    buttonContent: {
      padding: `${spacing[8]}px ${spacing[16]}px`,
      display: 'flex',
      justifyContent: 'end'
    },
    textField: {
      '& .MuiFilledInput-input': {
        padding: '16px 13px'
      }
    },
    menuItem: {
      '&:focus': {
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: hrmangoColors.lightGray
        }
      }
    }
  }))
  const classes = useStyles()
  const [isError] = useState({
    stageDate: false,
    note: false,
    offerStatus: false,
    nonSelecctionReason: false,
    timeStart: false
  })
  const [errorText] = useState({
    dateError: 'Please enter a valid Date',
    noteError: 'Please enter a valid note',
    offerStatusError: 'Please enter a valid Offer Status',
    nonSelecctionReasonError: 'Please enter a valid Reason',
    timeStartError: 'Please enter a valid Date'
  })
  const [percentage, setPercentage] = useState<number>(0)
  const [salary, setSalary] = useState<number>(0)
  const dispatch = useDispatch()
  //const [billingSettings, setBillingSettings] = useState<BillingSettings>()

  const updateApplicant = useMutation(() => stageChange({...applicant}), {
    onMutate: () => {
      dispatch(setSpinner(true))
    },
    onError: (error) => {
      dispatch(setSpinner(false))
      dispatch(
        setToast({
          message: `Error moving to other stage`,
          type: 'error'
        })
      )
    },
    onSuccess: (data: any) => {
      dispatch(setSpinner(false))
      data.json().then((job) => {
        dispatch(
          setToast({
            message: `Stage changed`,
            type: 'success'
          })
        )
      })
      refetch()
      refetchActivies()
      onClose()
    },
    retry: 0
  })

  const {data, isSuccess, isFetching, refetch: refetchBillingSettings} = useGetBillingSettingsByIdAsyncQuery(
    {
      companyId: 0,
      jobId: applicant.jobId
    },
    {enabled: false}
  )

  useEffect(() => {
    //setBillingSettings(data?.billingSettingsById)
    if (applicant.stageId === 5) {
      assignData(data?.billingSettingsById?.jobType)
    }
  }, [data?.billingSettingsById, isSuccess]) // eslint-disable-line

  const assignData = (jobType) => {
    if (jobType === 'Direct Hire') {
      setPercentage(data?.billingSettingsById.directHirePercentage)
      setSalary(data?.billingSettingsById.directHireSalary)
    }

    const amount =
      jobType === 'Shared Risk'
        ? data?.billingSettingsById.sharedRiskPerHireFee
        : jobType === 'Direct Hire'
        ? parseInt(data?.billingSettingsById.directHireSalary) * (data?.billingSettingsById.directHirePercentage / 100)
        : jobType === 'Contractor'
        ? data?.billingSettingsById.contractorHourlyRate
        : jobType === 'Executive Search'
        ? data?.billingSettingsById.executiveFeeSalary
        : 0
    const frequency =
      jobType === 'Shared Risk'
        ? 'Monthly'
        : jobType === 'Direct Hire'
        ? 'Yearly'
        : jobType === 'Contractor'
        ? 'Hourly'
        : jobType === 'Executive Search'
        ? 'Yearly'
        : ''
    setApplicant({...applicant!, amount: amount, jobType: jobType, frequency: frequency})
  }

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  useEffect(() => {
    if (applicant.stageId === 5) refetchBillingSettings()
  }, [open]) // eslint-disable-line

  return (
    <HRModal header='Stages Change' open={open} onClose={onClose}>
      <Box className={classes.content}>
        <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
          <DateTimePicker
            autoOk
            inputVariant='outlined'
            variant='inline'
            id='stageDate'
            label={`Stage Date`}
            format='yyyy-MM-dd hh:mm a (z)'
            value={
              applicant.stageDate ?? setApplicant({...applicant!, stageDate: format(new Date(), "yyyy-MM-dd'T'HH:mm")})
            }
            onChange={(date: any) => {
              setApplicant({...applicant!, stageDate: format(date, "yyyy-MM-dd'T'HH:mm")})
            }}
          />
        </MuiPickersTzUtilsProvider>

        <TextField
          required
          className={classes.textField}
          id='notes'
          label={`Notes`}
          margin='normal'
          variant='outlined'
          value={applicant?.note}
          InputLabelProps={{
            shrink: true
          }}
          error={isError.note}
          onChange={(e: any) => {
            e.target.value.length < 257 && setApplicant({...applicant!, note: e.target.value})
          }}
          fullWidth
          multiline={true}
          minRows={3}
          helperText={isError.note ? errorText.noteError : ''}
        />
        {applicant.stageId === 5 ? (
          <>
            <div style={{paddingTop: spacing[8]}}>
              <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
                <DateTimePicker
                  autoOk
                  inputVariant='outlined'
                  variant='inline'
                  id='timeStart'
                  label={`Time to Start`}
                  format='yyyy-MM-dd hh:mm a (z)'
                  value={
                    applicant.timeStart ??
                    setApplicant({...applicant!, timeStart: format(new Date(), "yyyy-MM-dd'T'HH:mm")})
                  }
                  onChange={(date: any) => {
                    setApplicant({...applicant!, timeStart: format(date, "yyyy-MM-dd'T'HH:mm")})
                  }}
                />
              </MuiPickersTzUtilsProvider>
            </div>
            <TextField
              className={classes.textField}
              id='jobType'
              label='Job Type'
              margin='normal'
              variant='outlined'
              value={applicant?.jobType}
              onChange={(e: any) => {
                setApplicant({...applicant!, jobType: e.target.value})
                assignData(e.target.value)
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
            {applicant?.jobType && applicant?.jobType === 'Direct Hire' && (
              <>
                <TextField
                  required
                  className={classes.textField}
                  id='frequency'
                  label='Frequency'
                  margin='normal'
                  variant='outlined'
                  value={applicant?.frequency}
                  onChange={(e: any) => {
                    setApplicant({...applicant!, frequency: e.target.value})
                  }}
                  fullWidth
                  select
                >
                  {Frequency.map((option) => (
                    <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  required
                  className={classes.textField}
                  id='percentage'
                  label='Percentage Fee'
                  margin='normal'
                  variant='outlined'
                  value={percentage}
                  onChange={(e: any) => {
                    setPercentage(e.target.value)
                    const p = parseInt(e.target.value)
                    setApplicant({...applicant!, amount: parseInt(salary.toString()) * (p / 100)})
                  }}
                  fullWidth
                />
                <TextField
                  required
                  className={classes.textField}
                  id='salary'
                  label='Salary'
                  margin='normal'
                  variant='outlined'
                  value={salary}
                  onChange={(e: any) => {
                    setSalary(e.target.value)
                    setApplicant({...applicant!, amount: parseInt(e.target.value) * (percentage / 100)})
                  }}
                  fullWidth
                />
              </>
            )}
            <TextField
              required
              className={classes.textField}
              id='amount'
              label='Amount'
              margin='normal'
              variant='outlined'
              value={applicant?.amount}
              onChange={(e: any) => {
                setApplicant({...applicant!, amount: e.target.value})
              }}
              fullWidth
            />
          </>
        ) : null}
        {applicant.stageId === 5 || applicant.stageId === 6 ? (
          <TextField
            required
            className={classes.textField}
            id='offerStatus'
            label='Offer Status'
            margin='normal'
            variant='outlined'
            disabled={true}
            value={
              applicant?.offerStatus
                ? applicant?.offerStatus
                : applicant.stageId === 5
                ? setApplicant({...applicant!, offerStatus: 'Accepted'})
                : setApplicant({...applicant!, offerStatus: 'Rejected'})
            }
            error={isError.offerStatus}
            onChange={(e: any) => {
              setApplicant({...applicant!, offerStatus: e.target.value})
            }}
            fullWidth
            select
            helperText={isError.offerStatus ? errorText.offerStatusError : ''}
          >
            {OfferStatus.map((option) => (
              <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
        {applicant.stageId === 6 ? (
          <TextField
            required
            className={classes.textField}
            id='nonSelecctionReason'
            label='Non Selecction Reason'
            margin='normal'
            variant='outlined'
            value={applicant?.nonSelecctionReason}
            error={isError.nonSelecctionReason}
            onChange={(e: any) => {
              setApplicant({...applicant!, nonSelecctionReason: e.target.value})
            }}
            fullWidth
            select
            helperText={isError.nonSelecctionReason ? errorText.nonSelecctionReasonError : ''}
          >
            {NonSelectionReason.map((option) => (
              <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </Box>
      <Box className={classes.buttonContent}>
        <Button
          color='secondary'
          onClick={() => {
            refetch()
            onClose()
          }}
          className={classes.buttonDense}
        >
          Cancel
        </Button>
        <Button
          className={`${classes.button} ${classes.submitButton}`}
          variant='contained'
          color='secondary'
          onClick={() => {
            if (applicant?.stageDate?.replace(/\s+/g, '').length) {
              updateApplicant.mutate()
            }
          }}
        >
          Save
        </Button>
      </Box>
    </HRModal>
  )
}

export default StageChangeModal
