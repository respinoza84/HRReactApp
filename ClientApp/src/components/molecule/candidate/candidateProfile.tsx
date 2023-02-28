import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {LocationState} from 'type'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {
  Box,
  Container,
  TextField,
  MenuItem,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch
} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {Candidate} from 'graphql/types.generated'
import {
  WorkType,
  CandidateSource,
  Status,
  Marketing,
  TimeZone,
  NoticePeriod,
  Territory
} from 'type/candidate/candidateEnums'
import {setToast, setSpinner} from 'store/action/globalActions'
//import {ErrorMessages} from 'type/errorMessage'
import {create, update} from 'api/candidateApi'
import {Save} from '@material-ui/icons'
import InputMask from 'react-input-mask'
//import {format, utcToZonedTime} from 'date-fns-tz'
import {useGetCandidateByIdQuery} from 'graphql/Candidates/Queries/GetCandidateByIdQuery.generated'
import {routes} from 'router'
import {DateTimePicker} from '@material-ui/pickers'
//import DateFnsUtils from '@date-io/date-fns'
import enLocale from 'date-fns/locale/en-US'
import DateFnsTzUtils from 'lib/atom/datePicker/DateFnsTzUtils'
import MuiPickersTzUtilsProvider from 'lib/atom/datePicker/MuiPickersTzUtilsProvider'

const defaultCandidate = {
  id: 0,
  firstName: '',
  prefferedName: '',
  lastName: '',
  displayAs: '',
  department: '',
  owner: '',
  jobTitle: '',
  jobName: '',
  currentEmployer: '',
  source: '',
  status: '',
  email: '',
  cellPhone: '',
  workPhone: '',
  noticePeriod: '',
  summary: '',
  workType: '',
  timeZone: '',
  marketing: '',
  dateLastContacted: undefined,
  dateResumeSent: undefined,
  territory: '',
  byEmail: false,
  byPhone: false,
  byText: false,
  rigthToRepresent: false,
  privateRecord: true,
  errorCode: 0,
  errorMessage: ''
}

export type candidateType = {
  onClose?: () => void
  setApplicantModalOpen?: any
  setSelectedValue?: any
}
const CandidateProfile = withRouter(
  ({
    match,
    location,
    history,
    onClose,
    setApplicantModalOpen,
    setSelectedValue
  }: RouteComponentProps<{candidateId: string}, StaticContext, LocationState> & candidateType) => {
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
    const [candidate, setCandidate] = useState<Candidate>(defaultCandidate)
    const classes = useStyles()
    const dispatch = useDispatch()
    const [isError, setIsError] = useState({
      firstName: false,
      prefferedName: false,
      lastName: false,
      displayAs: false,
      jobTitle: false,
      department: false,
      candidateOwner: false,
      candidateSource: false,
      candidateStatus: false,
      summary: false,
      cellPhone: false,
      workPhone: false,
      email: false,
      workType: false,
      marketing: false,
      noticePeriod: false,
      dateLastContacted: false,
      dateResumeSent: false,
      territory: false,
      timeZone: false,
      currentEmployer: false
    })
    const [errorText, setErrorText] = useState({
      firstNameError: 'Please enter a valid First Name',
      prefferedNameError: 'Please enter a valid Preffered Name',
      lastNameError: 'Please enter a valid Last Name',
      displayAsError: 'Please enter a valid Display As',
      jobTitleError: 'Please enter a valid Job Title',
      departmentError: 'Please enter a valid Department',
      candidateOwnerError: 'Please enter a valid Candidate Owner',
      candidateSourceError: 'Please enter a valid Candidate Source',
      candidateStatusError: 'Please enter a valid Status',
      summaryError: 'Please enter a valid Summary',
      cellPhoneError: 'Please enter a valid Cell Phone',
      workPhoneError: 'Please enter a valid Work Phone',
      territoryError: 'Please enter a valid Territory',
      emailError: 'Please enter a valid Email',
      workTypeError: 'Please enter a valid Work Type',
      marketingError: 'Please enter a valid Marketing',
      noticePeriodError: 'Please enter a valid Notice Period',
      dateLastContactedError: 'Please enter a valid Date',
      dateResumeSentError: 'Please enter a valid Date',
      timeZoneError: 'Please enter a valid Time Zone',
      currentEmployerError: 'Please enter a valid Current Employer'
    })

    const createCandidate = useMutation((id: any) => (id !== 0 ? update(id, candidate) : create('0', {...candidate})), {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error: any) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Error saving the candidate: ${error.errorMessage}`,
            type: 'error'
          })
        )

        let firstNameError = {text: '', error: false}
        let prefferedNameError = {text: '', error: false}
        let lastNameError = {text: '', error: false}
        let displayAsError = {text: '', error: false}
        let jobTitleError = {text: '', error: false}
        let departmentError = {text: '', error: false}
        let candidateOwnerError = {text: '', error: false}
        let candidateSourceError = {text: '', error: false}
        let candidateStatusError = {text: '', error: false}
        let summaryError = {text: '', error: false}
        let cellPhoneError = {text: '', error: false}
        let workPhoneError = {text: '', error: false}
        let territoryError = {text: '', error: false}
        let emailError = {text: '', error: false}
        let workTypeError = {text: '', error: false}
        let marketingError = {text: '', error: false}
        let noticePeriodError = {text: '', error: false}
        let dateLastContactedError = {text: '', error: false}
        let dateResumeSentError = {text: '', error: false}
        let timeZoneError = {text: '', error: false}
        let currentEmployerError = {text: '', error: false}

        error?.fieldMessages.forEach((fieldMessage) => {
          if (fieldMessage.fieldId === 'firstName') {
            firstNameError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'prefferedName') {
            prefferedNameError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'lastName') {
            lastNameError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'displayAs') {
            displayAsError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'jobTitle') {
            jobTitleError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'department') {
            departmentError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'candidateOwner') {
            candidateOwnerError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'candidateSource') {
            candidateSourceError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'candidateStatus') {
            candidateStatusError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'summary') {
            summaryError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'cellPhone') {
            cellPhoneError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'workPhone') {
            workPhoneError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'email') {
            emailError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'workType') {
            workTypeError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'marketing') {
            marketingError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'noticePeriod') {
            noticePeriodError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'dateLastContacted') {
            dateLastContactedError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'dateResumeSent') {
            dateResumeSentError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'territory') {
            territoryError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'timeZone') {
            timeZoneError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'currentEmployer') {
            currentEmployerError = {text: fieldMessage.message, error: true}
          }
        })

        setErrorText({
          firstNameError: firstNameError.text,
          prefferedNameError: prefferedNameError.text,
          lastNameError: lastNameError.text,
          displayAsError: displayAsError.text,
          jobTitleError: jobTitleError.text,
          departmentError: departmentError.text,
          candidateOwnerError: candidateOwnerError.text,
          candidateSourceError: candidateSourceError.text,
          candidateStatusError: candidateStatusError.text,
          summaryError: summaryError.text,
          cellPhoneError: cellPhoneError.text,
          workPhoneError: workPhoneError.text,
          territoryError: territoryError.text,
          emailError: emailError.text,
          workTypeError: workTypeError.text,
          marketingError: marketingError.text,
          noticePeriodError: noticePeriodError.text,
          dateLastContactedError: dateLastContactedError.text,
          dateResumeSentError: dateResumeSentError.text,
          timeZoneError: timeZoneError.text,
          currentEmployerError: currentEmployerError.text
        })
        setIsError({
          firstName: firstNameError.error,
          prefferedName: prefferedNameError.error,
          lastName: lastNameError.error,
          displayAs: displayAsError.error,
          jobTitle: jobTitleError.error,
          department: departmentError.error,
          candidateOwner: candidateOwnerError.error,
          candidateSource: candidateSourceError.error,
          candidateStatus: candidateStatusError.error,
          summary: summaryError.error,
          cellPhone: cellPhoneError.error,
          workPhone: workPhoneError.error,
          territory: territoryError.error,
          email: emailError.error,
          workType: workTypeError.error,
          marketing: marketingError.error,
          noticePeriod: noticePeriodError.error,
          dateLastContacted: dateLastContactedError.error,
          dateResumeSent: dateResumeSentError.error,
          timeZone: timeZoneError.error,
          currentEmployer: currentEmployerError.error
        })
      },
      onSuccess: (data: any) => {
        dispatch(setSpinner(false))
        data.json().then((candidate) => {
          dispatch(
            setToast({
              message: `${candidate.displayAs} successfully saved.`,
              type: 'success'
            })
          )
          !onClose &&
            history.push(`${routes.CandidateDetail}/${candidate.code}`, {
              header: {
                title: candidate.displayAs,
                owner: candidate.owner,
                type: candidate.workType,
                color: location && location.state && location.state.header?.color
              },
              backUrl: history.location.state.backUrl,
              backState: history.location.state.backState
            })
          onClose && onClose()
          setApplicantModalOpen && setApplicantModalOpen(true)
          setSelectedValue && setSelectedValue(candidate)
        })
      },
      retry: 0
    })

    const candidateId = match.params.candidateId
    const {data, isSuccess, isFetching, refetch} = useGetCandidateByIdQuery(
      {
        candidateId: parseInt(candidateId)
      },
      {enabled: false}
    )

    useEffect(() => {
      if (candidateId) refetch()
      // eslint-disable-next-line
    }, [candidateId])

    useEffect(() => {
      dispatch(setSpinner(isFetching))
      // eslint-disable-next-line
    }, [isFetching])

    useEffect(() => {
      if (data) {
        setCandidate({...data?.candidateById, id: parseInt(match.params.candidateId)})
      }
      // eslint-disable-next-line
    }, [data?.candidateById, isSuccess])

    return (
      <div>
        <Container>
          <Box className={classes.rowHeader}>Candidate Details</Box>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              required
              className={classes.textField}
              id='firstName'
              label='First Name'
              margin='normal'
              variant='outlined'
              value={candidate?.firstName}
              error={isError.firstName}
              onChange={(e: any) => {
                e.target.value.length < 257 &&
                  setCandidate({
                    ...candidate!,
                    firstName: e.target.value,
                    displayAs: `${e.target.value} ${candidate.lastName}`
                  })
              }}
              fullWidth
              helperText={isError.firstName ? errorText.firstNameError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='prefferedName'
              label='Preffered Name'
              margin='normal'
              variant='outlined'
              value={candidate.prefferedName ?? undefined}
              error={isError.prefferedName}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, prefferedName: e.target.value})
              }}
              fullWidth
              helperText={isError.prefferedName ? errorText.prefferedNameError : ''}
            />
          </Box>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              required
              className={classes.textField}
              id='lastName'
              label='Last Name'
              margin='normal'
              variant='outlined'
              value={candidate?.lastName}
              error={isError.lastName}
              onChange={(e: any) => {
                e.target.value.length < 257 &&
                  setCandidate({
                    ...candidate!,
                    lastName: e.target.value,
                    displayAs: `${candidate.firstName} ${e.target.value}`
                  })
              }}
              fullWidth
              helperText={isError.lastName ? errorText.lastNameError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              tabIndex={-1}
              className={classes.textField}
              required
              disabled
              id='displayAs'
              label='Display As'
              margin='normal'
              variant='outlined'
              value={candidate.displayAs ?? undefined}
              error={isError.displayAs}
              fullWidth
              helperText={isError.displayAs ? errorText.displayAsError : ''}
            />
          </Box>
          <Box className={classes.row} tabIndex={-1}>
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='jobTitle'
              label='Job Title'
              margin='normal'
              variant='outlined'
              value={candidate?.jobTitle}
              error={isError.jobTitle}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, jobTitle: e.target.value})
              }}
              fullWidth
              helperText={isError.jobTitle ? errorText.jobTitleError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='department'
              label='Department'
              margin='normal'
              variant='outlined'
              value={candidate?.department}
              error={isError.department}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, department: e.target.value})
              }}
              fullWidth
              helperText={isError.department ? errorText.departmentError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              className={classes.textField}
              id='currentEmployer'
              inputProps={{tabIndex: -1}}
              label='Current Employer'
              margin='normal'
              variant='outlined'
              value={candidate.currentEmployer ?? undefined}
              error={isError.currentEmployer}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, currentEmployer: e.target.value})
              }}
              fullWidth
              helperText={isError.currentEmployer ? errorText.currentEmployerError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              required
              className={classes.textField}
              id='candidateOwner'
              label='Candidate Owner'
              margin='normal'
              variant='outlined'
              value={candidate?.owner}
              error={isError.candidateOwner}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, owner: e.target.value})
              }}
              fullWidth
              helperText={isError.candidateOwner ? errorText.candidateOwnerError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              required
              select
              className={classes.textField}
              id='candidateStatus'
              label='Candidate Status'
              margin='normal'
              variant='outlined'
              value={candidate.status ?? ''}
              error={isError.candidateStatus}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, status: e.target.value})
              }}
              fullWidth
              helperText={isError.candidateStatus ? errorText.candidateStatusError : ''}
            >
              {Status.map((option) => (
                <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='candidateSource'
              label='Candidate Source'
              margin='normal'
              variant='outlined'
              value={candidate.source ?? undefined}
              error={isError.candidateSource}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, source: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.candidateSource ? errorText.candidateSourceError : ''}
            >
              {CandidateSource.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Container>
        <Container style={{paddingTop: spacing[48]}}>
          <Box className={classes.rowHeader}>Contact Summary</Box>
          <Box className={classes.row}>
            <InputMask
              value={candidate?.cellPhone}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, cellPhone: e.target.value})
              }}
              mask='(999) 999-9999'
            >
              <TextField
                required
                className={classes.textField}
                id='cellPhone'
                label='Cell Phone'
                margin='normal'
                variant='outlined'
                error={isError.cellPhone}
                fullWidth
                helperText={isError.cellPhone ? errorText.cellPhoneError : ''}
              />
            </InputMask>
            <Box className={classes.rowSpace} />
            <InputMask
              value={candidate?.workPhone}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, workPhone: e.target.value})
              }}
              mask='(999) 999-9999'
            >
              <TextField
                inputProps={{tabIndex: -1}}
                className={classes.textField}
                id='workPhone'
                label='Work Phone'
                margin='normal'
                variant='outlined'
                error={isError.workPhone}
                fullWidth
                helperText={isError.workPhone ? errorText.workPhoneError : ''}
              />
            </InputMask>
          </Box>
          <Box className={classes.row}>
            <TextField
              required
              className={classes.textField}
              id='email'
              label='Email'
              margin='normal'
              variant='outlined'
              value={candidate?.email}
              error={isError.email}
              onChange={(e: any) => {
                setCandidate({...candidate!, email: e.target.value.toString()})
              }}
              fullWidth
              helperText={isError.email ? errorText.emailError : ''}
            />
            <Box className={classes.rowSpace} />
            <FormControl component='div' fullWidth />
          </Box>
        </Container>
        <Container style={{paddingTop: spacing[48]}}>
          <Box className={classes.rowHeader}>Work & Personal Information</Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='summary'
              label='Summary'
              margin='normal'
              variant='outlined'
              value={candidate.summary}
              error={isError.summary}
              onChange={(e: any) => {
                setCandidate({...candidate!, summary: e.target.value})
              }}
              fullWidth
              multiline={true}
              minRows={3}
              helperText={isError.summary ? errorText.summaryError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='workType'
              label='Work Type'
              margin='normal'
              variant='outlined'
              value={candidate?.workType}
              error={isError.workType}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, workType: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.workType ? errorText.workTypeError : ''}
            >
              {WorkType.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='marketing'
              label='Marketing'
              margin='normal'
              variant='outlined'
              value={candidate?.marketing}
              error={isError.marketing}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, marketing: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.marketing ? errorText.marketingError : ''}
            >
              {Marketing.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='timeZone'
              label='Time Zone'
              margin='normal'
              variant='outlined'
              value={candidate.timeZone ?? undefined}
              error={isError.timeZone}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, timeZone: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.timeZone ? errorText.timeZoneError : ''}
            >
              {TimeZone.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='noticePeriod'
              label='Notice Period'
              margin='normal'
              variant='outlined'
              value={candidate?.noticePeriod}
              error={isError.noticePeriod}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, noticePeriod: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.noticePeriod ? errorText.noticePeriodError : ''}
            >
              {NoticePeriod.map((option) => (
                <MenuItem key={option.value} value={option.value}>
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
                id='dateLastContacted'
                label='Date Last Contacted'
                format='yyyy-MM-dd hh:mm a (z)'
                value={candidate.dateLastContacted}
                onChange={(date: any) => {
                  setCandidate({...candidate!, dateLastContacted: date})
                }}
              />
            </MuiPickersTzUtilsProvider>
            <Box className={classes.rowSpace} />
            <FormControl component='div' fullWidth>
              <FormLabel component='legend'>Communication</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      inputProps={{tabIndex: -1}}
                      checked={candidate.byEmail}
                      onChange={(e: any) => {
                        setCandidate({...candidate!, byEmail: e.target.checked})
                      }}
                      name='email'
                    />
                  }
                  label='Email'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      inputProps={{tabIndex: -1}}
                      checked={candidate.byPhone}
                      onChange={(e: any) => {
                        setCandidate({...candidate!, byPhone: e.target.checked})
                      }}
                      name='phone'
                    />
                  }
                  label='Phone'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      inputProps={{tabIndex: -1}}
                      checked={candidate.byText}
                      onChange={(e: any) => {
                        setCandidate({...candidate!, byText: e.target.checked})
                      }}
                      name='text'
                    />
                  }
                  label='Text'
                />
              </FormGroup>
            </FormControl>
          </Box>
          <Box className={classes.row} style={{paddingTop: spacing[16]}}>
            <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
              <DateTimePicker
                inputProps={{tabIndex: -1}}
                autoOk
                inputVariant='outlined'
                variant='inline'
                id='dateResumeSent'
                label='Date Resume Sent'
                format='yyyy-MM-dd hh:mm a (z)'
                value={candidate.dateResumeSent}
                onChange={(date: any) => {
                  setCandidate({...candidate!, dateResumeSent: date})
                }}
              />
            </MuiPickersTzUtilsProvider>

            <Box className={classes.rowSpace} />
            <FormControl component='fieldset' fullWidth>
              <FormLabel component='legend'>Right to Represent?</FormLabel>
              <Switch
                inputProps={{tabIndex: -1}}
                checked={candidate.rigthToRepresent}
                onChange={(e: any) => {
                  setCandidate({...candidate!, rigthToRepresent: e.target.checked})
                }}
              />
            </FormControl>
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='territory'
              label='Territory'
              margin='normal'
              variant='outlined'
              value={candidate.territory}
              error={isError.territory}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, territory: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.territory ? errorText.territoryError : ''}
            >
              {Territory.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Box className={classes.rowSpace} />
            <FormControl component='fieldset' fullWidth>
              <FormLabel component='legend' style={{paddingTop: `${spacing[16]}px`}}>
                Private Record
              </FormLabel>
              <Switch
                inputProps={{tabIndex: -1}}
                checked={candidate.privateRecord}
                onChange={(e: any) => {
                  setCandidate({...candidate!, privateRecord: e.target.checked})
                }}
              />
            </FormControl>
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
                firstName: !candidate.firstName?.replace(/\s+/g, '').length,
                lastName: !candidate.lastName?.replace(/\s+/g, '').length,
                displayAs: !candidate.displayAs?.replace(/\s+/g, '').length,
                candidateStatus: !candidate.status?.replace(/\s+/g, '').length,
                cellPhone: !candidate.cellPhone?.replace(/\s+/g, '').length,
                email: !candidate.email?.replace(/\s+/g, '').length,
                candidateOwner: !candidate.owner?.replace(/\s+/g, '').length
              })
              if (
                candidate.firstName?.replace(/\s+/g, '').length &&
                candidate.lastName?.replace(/\s+/g, '').length &&
                candidate.displayAs?.replace(/\s+/g, '').length &&
                candidate.status?.replace(/\s+/g, '').length &&
                candidate.cellPhone?.replace(/\s+/g, '').length &&
                candidate.email?.replace(/\s+/g, '').length &&
                candidate.owner?.replace(/\s+/g, '').length
              ) {
                createCandidate.mutate(candidate.id)
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

export {CandidateProfile}
