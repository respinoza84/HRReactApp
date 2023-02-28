import {useState, useEffect} from 'react'
import * as React from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {LocationState} from 'type'
import {DropzoneArea} from 'material-ui-dropzone'
import {addExternalImage} from 'api/documentsApi'
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
  Switch,
  Radio,
  RadioGroup,
  InputAdornment,
  Modal
} from '@material-ui/core'

import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {Candidate} from 'graphql/types.generated'
import {
  WorkType,
  //CandidateSource,
  //Status,
  Marketing,
  TimeZone,
  NoticePeriod,
  lookingJob
} from 'type/candidate/candidateEnums'
import {setToast, setSpinner} from 'store/action/globalActions'
import {createApplicant, update} from 'api/candidateApi'
import {Save} from '@material-ui/icons'
import InputMask from 'react-input-mask'
import {useGetCandidateByUserIdQuery} from 'graphql/Candidates/Queries/GetCandidateByUserId.generated'

import {DateTimePicker} from '@material-ui/pickers'
//import DateFnsUtils from '@date-io/date-fns'
import enLocale from 'date-fns/locale/en-US'
import DateFnsTzUtils from 'lib/atom/datePicker/DateFnsTzUtils'
import MuiPickersTzUtilsProvider from 'lib/atom/datePicker/MuiPickersTzUtilsProvider'
import CurrentUserCache from 'lib/utility/currentUser'
import {Country} from 'type/company/contactEnums'

const defaultCandidate = {
  id: 0,
  userId: 0,
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
  lookingJob: 1,
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
  rigthToRepresent: true,
  privateRecord: true,
  errorCode: 0,
  errorMessage: '',
  country: 'United States',
  rate: 0,
  address: {
    addressLine1: '',
    zipCode: '',
    city: '',
    state: '',
    country: 'United States'
  },
  isDeleted: false,
  document: {
    fileName: '',
    blobPath: '',
    blobName: '',
    fileType: '',
    fileSize: ''
  }
}

export type candidateType = {
  onClose?: () => void
  setApplicantModalOpen?: any
  setSelectedValue?: any
}
const ApplicantProfile = withRouter(
  ({
    match,
    location,
    history,
    onClose,
    setApplicantModalOpen,
    setSelectedValue
  }: RouteComponentProps<{userId: string}, StaticContext, LocationState> & candidateType) => {
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
      },
      dropzone: {
        backgroundColor: hrmangoColors.white,
        minHeight: '50px',
        '& .MuiTypography-h5': {
          ...typography.body1
        }
      }
    }))

    const [candidate, setCandidate] = useState<Candidate>(defaultCandidate)
    let userId: number | undefined = 0 ?? 0
    userId = CurrentUserCache?.userId!

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
      address: false,
      city: false,
      state: false,
      zipCode: false,
      Country: false,
      email: false,
      workType: false,
      marketing: false,
      noticePeriod: false,
      lookingJob: false,
      dateLastContacted: false,
      dateResumeSent: false,
      territory: false,
      timeZone: false,
      currentEmployer: false,
      rateMount: false
      //rightToRepresent: false
    })
    const [errorText, setErrorText] = useState({
      firstNameError: 'Please enter a valid First Name',
      prefferedNameError: 'Please enter a valid Preffered Name',
      lastNameError: 'Please enter a valid Last Name',
      displayAsError: 'Please enter a valid Display As',
      jobTitleError: 'Can you help us to fill this missing field',
      departmentError: 'Please enter a valid Department',
      candidateOwnerError: 'Please enter a valid Candidate Owner',
      candidateSourceError: 'Please enter a valid Candidate Source',
      candidateStatusError: 'Please enter a valid Status',
      summaryError: 'Please enter a valid Summary',
      cellPhoneError: 'Please enter a valid Cell Phone',
      workPhoneError: 'Please enter a valid Work Phone',
      addressError: 'Please enter your Address',
      cityError: 'Please enter your City',
      stateError: 'Please enter your State',
      zipCodeError: 'Please enter your Zip Code',
      CountryError: 'Please enter a Country',
      territoryError: 'Please enter a valid Territory',
      emailError: 'Please enter a valid Email',
      workTypeError: 'Please select your Work Type',
      marketingError: 'Please make a selection',
      noticePeriodError: 'Please enter a valid Notice Period',
      lookingJobError: 'Can you help us to fill this missing field',
      dateLastContactedError: 'Please enter a valid Date',
      dateResumeSentError: 'Please enter a valid Date',
      timeZoneError: 'Please enter a valid Time Zone',
      currentEmployerError: 'Can you help us to fill this missing field',
      rateMountError: 'Please enter an amount'

      //rightToRepresent: 'Please confirm we can try to help you'
    })
    //pasar userid --> userId
    const createCandidate = useMutation(
      (id: any) => (candidate.id !== 0 ? update(id, candidate) : createApplicant('0', {...candidate})),
      {
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
          let addressError = {text: '', error: false}
          let cityError = {text: '', error: false}
          let stateError = {text: '', error: false}
          let zipCodeError = {text: '', error: false}
          let CountryError = {text: '', error: false}
          let territoryError = {text: '', error: false}
          let emailError = {text: '', error: false}
          let workTypeError = {text: '', error: false}
          let marketingError = {text: '', error: false}
          let noticePeriodError = {text: '', error: false}
          let lookingJobError = {text: '', error: false}

          let dateLastContactedError = {text: '', error: false}
          let dateResumeSentError = {text: '', error: false}
          let timeZoneError = {text: '', error: false}
          let currentEmployerError = {text: '', error: false}
          let rateMountError = {text: '', error: false}
          //let rightToRepresentError = {text: '', error: false}

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
            if (fieldMessage.fieldId === 'Address') {
              addressError = {text: fieldMessage.message, error: true}
            }

            if (fieldMessage.fieldId === 'City') {
              cityError = {text: fieldMessage.message, error: true}
            }

            if (fieldMessage.fieldId === 'State') {
              stateError = {text: fieldMessage.message, error: true}
            }

            if (fieldMessage.fieldId === 'ZipCode') {
              zipCodeError = {text: fieldMessage.message, error: true}
            }

            if (fieldMessage.fieldId === 'Country') {
              CountryError = {text: fieldMessage.message, error: true}
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
            if (fieldMessage.fieldId === 'lookingJob') {
              lookingJobError = {text: fieldMessage.message, error: true}
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
            if (fieldMessage.fieldId === 'amount') {
              rateMountError = {text: fieldMessage.message, error: true}
            }
            // if (fieldMessage.fieldId === 'rightToRepresent') {
            //   rightToRepresentError = {text: fieldMessage.message, error: true}
            // }
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
            addressError: addressError.text,
            cityError: cityError.text,
            stateError: stateError.text,
            zipCodeError: zipCodeError.text,
            CountryError: CountryError.text,
            territoryError: territoryError.text,
            emailError: emailError.text,
            workTypeError: workTypeError.text,
            marketingError: marketingError.text,
            noticePeriodError: noticePeriodError.text,
            lookingJobError: lookingJobError.text,
            dateLastContactedError: dateLastContactedError.text,
            dateResumeSentError: dateResumeSentError.text,
            timeZoneError: timeZoneError.text,
            currentEmployerError: currentEmployerError.text,
            rateMountError: rateMountError.text
            //rightToRepresentError: rightToRepresentError.text
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
            address: addressError.error,
            city: cityError.error,
            state: stateError.error,
            zipCode: zipCodeError.error,
            Country: CountryError.error,
            territory: territoryError.error,
            email: emailError.error,
            workType: workTypeError.error,
            marketing: marketingError.error,
            noticePeriod: noticePeriodError.error,
            lookingJob: lookingJobError.error,
            dateLastContacted: dateLastContactedError.error,
            dateResumeSent: dateResumeSentError.error,
            timeZone: timeZoneError.error,
            currentEmployer: currentEmployerError.error,
            rateMount: rateMountError.error
            //rightToRepresent: rightToRepresentError.error
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
          })
        },
        retry: 0
      }
    )

    //console.log(' userId  ' + userId)

    const {refetch, isFetching, data, isSuccess} = useGetCandidateByUserIdQuery(
      {
        // @ts-ignore: Argument of type 'string' is not assignable to parameter of type 'number'.
        userId: parseInt(userId)
      },
      {enabled: true}
    )
    useEffect(() => {
      if (userId) refetch()
      // eslint-disable-next-line
    }, [userId])

    useEffect(() => {
      dispatch(setSpinner(isFetching))
      // eslint-disable-next-line
    }, [isFetching])

    useEffect(() => {
      if (data) {
        //console.log(data)
        setCandidate({
          ...data?.candidateByUserId,
          id: data?.candidateByUserId.id
        })
        setIsError({
          ...isError,
          firstName: !data.candidateByUserId.firstName?.replace(/\s+/g, '').length,
          lastName: !data.candidateByUserId.lastName?.replace(/\s+/g, '').length,
          cellPhone: !data.candidateByUserId.cellPhone?.replace(/\s+/g, '').length,
          workPhone: !data.candidateByUserId.workPhone?.replace(/\s+/g, '').length,
          address: !data.candidateByUserId.address?.addressLine1?.replace(/\s+/g, '').length,
          zipCode: !data.candidateByUserId.address?.zipCode?.replace(/\s+/g, '').length,
          state: !data.candidateByUserId.address?.state?.replace(/\s+/g, '').length,
          city: !data.candidateByUserId.address?.city?.replace(/\s+/g, '').length,
          workType: !data.candidateByUserId.workType?.replace(/\s+/g, '').length,
          marketing: !data.candidateByUserId.marketing?.replace(/\s+/g, '').length,
          email: !data.candidateByUserId.email?.replace(/\s+/g, '').length,
          dateResumeSent: !data.candidateByUserId.dateResumeSent?.replace(/\s+/g, '').length
        })
      }
      // eslint-disable-next-line
    }, [data?.candidateByUserId, isSuccess])
    const imageProfile =
      candidate?.userImageUrl?.replace('avatar.svg', 'https://via.placeholder.com/150') ??
      'https://via.placeholder.com/150'
    // let profileValue = ''
    // if (!candidate?.userImageUrl) {
    //   profileValue = '  Please upload your profile picture'
    // } else {
    //   profileValue = ''
    // }
    const profileValue = !candidate?.userImageUrl ? 'avatar.svg' || ' Please upload your profile picture' : ' '
    const rateHourly = candidate.rate === 0 ? true : false
    const rateSalary = candidate.rate === 1 ? true : false
    const saveFile = useMutation(
      ({item, event, candidate}: any) =>
        addExternalImage({
          fileName: item.name,
          fileContents: event.target.result.replace(/^.+?(;base64),/, ''),
          fileType: item.type,
          fileSize: String(item.size),
          entityId: candidate.userId,
          entityName: candidate.email,
          userId: candidate.userId
        }),
      {
        onMutate: () => {
          dispatch(setSpinner(true))
        },
        onError: (error) => {
          dispatch(setSpinner(false))
          dispatch(
            setToast({
              message: `Error uploading the file`,
              type: 'error'
            })
          )
        },
        onSuccess: (data: any) => {
          dispatch(setSpinner(false))
          data.json().then((document) => {
            setCandidate({
              ...candidate!,
              userImageUrl: document.avatarUrl
            })
          })
        },
        retry: 0
      }
    )

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4
    }
    let chckError = ''
    if (!candidate.byEmail && !candidate.byPhone && !candidate.byText) {
      //console.log('false')

      chckError = 'Please make a selection'
    } else {
      //console.log('true')
      chckError = ''
    }
    //const lMessagePrivateRecord = candidate.privateRecord ? '' : 'Please confirm we can try to help you'
    const lMessageRightToRepresent = candidate.rigthToRepresent ? '' : 'Please confirm we can try to help you'

    //const chckError = lFlag  : 'Please make a selection'
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <div id='modal-modal-title'>
              <Box className={classes.rowHeader}>Attachment Information</Box>
            </div>
            <div id='modal-modal-description'>
              <Container style={{paddingTop: spacing[48]}}>
                <Box className={classes.row}>
                  <DropzoneArea
                    showPreviews={false}
                    maxFileSize={26214400}
                    filesLimit={1}
                    acceptedFiles={['image/*']}
                    dropzoneText={'Drag and drop an image here or click'}
                    // onChange={(files) => console.log('Files:', files)}
                    dropzoneClass={classes.dropzone}
                    onDrop={(fileObjects) => {
                      fileObjects.forEach((item) => {
                        const reader = new FileReader()
                        reader.onloadend = (event: any) => {
                          if (event.target.readyState === FileReader.DONE) {
                            saveFile.mutate({item, event, candidate})
                          }
                        }
                        reader.readAsDataURL(item)
                      })
                    }}
                  />
                </Box>
              </Container>
            </div>
          </Box>
        </Modal>

        <Container>
          <Box className={classes.rowHeader}>Applicant Details</Box>
          <br></br>
          <br></br>
          <Box className={classes.row}>
            <img src={imageProfile ?? 'https://via.placeholder.com/150'} alt='Avatar' height={150} width={150} />

            <Button
              onClick={handleOpen}
              style={{height: '20px', paddingLeft: '40px', marginTop: '100px', cursor: 'pointer', color: '#0091D0'}}
            >
              Edit Picture
            </Button>
            <div style={{color: '#B00020', fontSize: '14px', marginTop: '100px'}}>{profileValue}</div>
          </Box>
          <br></br>
          <br></br>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 0}}
              className={classes.textField}
              id='lookingJob'
              label='Looking For a Job?'
              margin='normal'
              variant='outlined'
              value={candidate?.lookingJob || 1}
              error={isError.lookingJob}
              onChange={(e: any) => {
                setCandidate({...candidate!, lookingJob: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.lookingJob ? errorText.lookingJobError : ''}
            >
              {lookingJob.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: 1}}
              className={classes.textField}
              id='prefferedName'
              label='Preferred Name'
              margin='normal'
              variant='outlined'
              value={candidate.prefferedName ?? ''}
              error={isError.prefferedName}
              onChange={(e: any) => {
                e.target.value.length < 257 &&
                  setCandidate({
                    ...candidate!,
                    prefferedName: e.target.value,
                    displayAs: `${e.target.value}`
                  })
              }}
              fullWidth
              helperText={isError.prefferedName ? errorText.prefferedNameError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 2}}
              required
              className={classes.textField}
              id='firstName'
              label='First Name'
              margin='normal'
              variant='outlined'
              value={candidate?.firstName ?? ''}
              error={isError.firstName}
              onChange={(e: any) => {
                e.target.value.length < 257 &&
                  setCandidate({
                    ...candidate!,
                    firstName: e.target.value,
                    displayAs: `${e.target.value} ${candidate.lastName ?? ''}`,
                    prefferedName: `${e.target.value} ${candidate.lastName ?? ''}`
                  })
              }}
              onBlur={() => {
                setIsError({
                  ...isError,
                  firstName: !candidate.firstName?.replace(/\s+/g, '').length
                })
              }}
              fullWidth
              helperText={isError.firstName ? errorText.firstNameError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: 3}}
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
                    displayAs: `${candidate.firstName} ${e.target.value}`,
                    prefferedName: `${candidate.firstName ?? ''} ${e.target.value}`
                  })
              }}
              onBlur={() => {
                setIsError({
                  ...isError,
                  lastName: !candidate.lastName?.replace(/\s+/g, '').length
                })
              }}
              fullWidth
              helperText={isError.lastName ? errorText.lastNameError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 4}}
              className={classes.textField}
              id='currentEmployer'
              label='Current Employer'
              margin='normal'
              variant='outlined'
              value={candidate.currentEmployer ?? undefined}
              error={isError.currentEmployer}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, currentEmployer: e.target.value})
              }}
              fullWidth
              //helperText={isError.currentEmployer ? errorText.currentEmployerError : ''}
            />

            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: 5}}
              id='jobTitle'
              label='Job Title'
              margin='normal'
              variant='outlined'
              value={candidate?.jobTitle || ''}
              error={isError.jobTitle}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCandidate({...candidate!, jobTitle: e.target.value})
              }}
              fullWidth
              helperText={isError.jobTitle ? errorText.jobTitleError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              className={classes.textField}
              required
              disabled
              id='displayAs'
              label='Display As'
              margin='normal'
              variant='outlined'
              value={candidate.displayAs}
              //error={isError.displayAs}
              fullWidth
              //helperText={isError.displayAs ? errorText.displayAsError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <Box className={classes.rowSpace} />
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
              onBlur={() => {
                setIsError({
                  ...isError,
                  cellPhone: !candidate.cellPhone?.replace(/\s+/g, '').length
                })
              }}
              mask='(999) 999-9999'
            >
              <TextField
                required
                inputProps={{tabIndex: 6}}
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
              onBlur={() => {
                setIsError({
                  ...isError,
                  workPhone: !candidate.workPhone?.replace(/\s+/g, '').length
                })
              }}
              mask='(999) 999-9999'
            >
              <TextField
                inputProps={{tabIndex: 7}}
                className={classes.textField}
                id='workPhone'
                label='Work Phone'
                margin='normal'
                variant='outlined'
                value={candidate?.workPhone}
                error={isError.workPhone}
                fullWidth
                //helperText={isError.workPhone ? errorText.workPhoneError : ''}
              />
            </InputMask>
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 8}}
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
            <TextField
              inputProps={{tabIndex: 9}}
              className={classes.textField}
              id='Address'
              label='Address'
              onBlur={() => {
                setIsError({
                  ...isError,
                  address: !candidate.address?.addressLine1?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={candidate?.address?.addressLine1}
              error={isError.address}
              onChange={(e: any) => {
                setCandidate({
                  ...candidate!,
                  address: {...candidate.address, addressLine1: e.target.value}
                })
              }}
              fullWidth
              helperText={isError.address ? errorText.addressError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 10}}
              className={classes.textField}
              id='City'
              label='City'
              onBlur={() => {
                setIsError({
                  ...isError,
                  city: !candidate.address?.city?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={candidate?.address?.city ?? ' '}
              error={isError.city}
              onChange={(e: any) => {
                setCandidate({...candidate!, address: {...candidate.address, city: e.target.value}})
              }}
              fullWidth
              helperText={isError.city ? errorText.cityError : ''}
            />

            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: 11}}
              className={classes.textField}
              id='State'
              label='State'
              onBlur={() => {
                setIsError({
                  ...isError,
                  state: !candidate.address?.state?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={candidate?.address?.state}
              error={isError.state}
              onChange={(e: any) => {
                setCandidate({...candidate!, address: {...candidate.address, state: e.target.value}})
              }}
              fullWidth
              helperText={isError.state ? errorText.stateError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 12}}
              className={classes.textField}
              id='ZipCode'
              label='Zip Code'
              onBlur={() => {
                setIsError({
                  ...isError,
                  zipCode: !candidate.address?.zipCode?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={candidate?.address?.zipCode}
              error={isError.zipCode}
              onChange={(e: any) => {
                setCandidate({...candidate!, address: {...candidate.address, zipCode: e.target.value}})
              }}
              fullWidth
              helperText={isError.zipCode ? errorText.zipCodeError : ''}
            />

            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: 13}}
              className={classes.textField}
              id='Country'
              label='Country'
              margin='normal'
              variant='outlined'
              value={candidate?.address?.country ?? 'United States'}
              error={isError.Country}
              onChange={(e: any) => {
                setCandidate({...candidate!, address: {...candidate.address, country: e.target.value}})
              }}
              fullWidth
              select
              //helperText={isError.Country ? errorText.CountryError : ''}
            >
              {Country.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <FormControl component='div' fullWidth />
        </Container>
        <Container style={{paddingTop: spacing[48]}}>
          <Box className={classes.rowHeader}>Work & Personal Information</Box>
          <Box className={classes.row} tabIndex={13}>
            <TextField
              inputProps={{tabIndex: 14}}
              className={classes.textField}
              id='workType'
              label='Work Type'
              onBlur={() => {
                setIsError({
                  ...isError,
                  workType: !candidate.workType?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={candidate?.workType ?? ' '}
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
            <Box className={classes.rowSpace} tabIndex={14} />
            <TextField
              inputProps={{tabIndex: 15}}
              className={classes.textField}
              id='marketing'
              label='Marketing'
              onBlur={() => {
                setIsError({
                  ...isError,
                  marketing: !candidate.marketing?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={candidate?.marketing ?? ' '}
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
              inputProps={{tabIndex: 16}}
              className={classes.textField}
              id='timeZone'
              label='Time Zone'
              margin='normal'
              variant='outlined'
              value={candidate.timeZone ?? ' '}
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
            <Box className={classes.rowSpace} tabIndex={16} />
            <TextField
              inputProps={{tabIndex: 17}}
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
          <Box className={classes.row} style={{paddingTop: spacing[16]}} tabIndex={17}>
            <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
              <DateTimePicker
                inputProps={{tabIndex: 18}}
                autoOk
                inputVariant='outlined'
                variant='inline'
                id='dateLastContacted'
                label='Date Of Last Login'
                format='yyyy-MM-dd hh:mm a (z)'
                value={candidate.modifiedDate}
                onChange={(date: any) => {
                  setCandidate({...candidate!, modifiedDate: date})
                }}
              />
            </MuiPickersTzUtilsProvider>
            <Box className={classes.row} />
            <FormControl component='div' fullWidth>
              <FormLabel component='legend'>Communication</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      inputProps={{tabIndex: 19}}
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
                      inputProps={{tabIndex: 20}}
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
                      inputProps={{tabIndex: 21}}
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
              <div style={{color: '#B00020', fontSize: '14px', marginTop: '10px'}}>{chckError}</div>
            </FormControl>
          </Box>
          <Box className={classes.row} style={{paddingTop: spacing[16]}}>
            <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
              <DateTimePicker
                inputProps={{tabIndex: 22}}
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
                onBlur={() => {
                  setIsError({
                    ...isError,
                    dateResumeSent: !candidate.dateResumeSent?.replace(/\s+/g, '').length
                  })
                }}
              />
              {/* <span
                style={{color: '#B00020', fontSize: '14px', marginTop: '57px', width: '280px', marginLeft: '-267px'}}
              >
                {isError.dateResumeSent ? errorText.dateResumeSentError : ''}
              </span> */}
            </MuiPickersTzUtilsProvider>
            <Box className={classes.rowSpace} />
            <FormControl component='fieldset'>
              <div style={{color: '#B00020', fontSize: '14px', marginTop: '10px'}}>{lMessageRightToRepresent}</div>
              <FormLabel component='legend'>Right to Represent?</FormLabel>
              <Switch
                inputProps={{tabIndex: 23}}
                checked={candidate.rigthToRepresent}
                onChange={(e: any) => {
                  setCandidate({...candidate!, rigthToRepresent: e.target.checked})
                }}
              />
              {/* <div style={{color: '#B00020', fontSize: '14px', marginTop: '10px'}}>{lMessagePrivateRecord}</div> */}
              <FormLabel component='legend' style={{paddingTop: `${spacing[16]}px`}}>
                Private Record
              </FormLabel>
              <Switch
                value={candidate?.privateRecord}
                checked={candidate?.privateRecord}
                inputProps={{tabIndex: 24}}
                onChange={(e: any) => {
                  setCandidate({...candidate!, privateRecord: e.target.checked})
                }}
              />
            </FormControl>
          </Box>

          <Box className={classes.row}>
            <FormControl component='fieldset' fullWidth>
              <FormLabel component='legend'>Desired Rate</FormLabel>
              <FormGroup row>
                <RadioGroup
                  row
                  value={candidate.rate}
                  onChange={(e: any) => {
                    setCandidate({...candidate, rate: e.target.value})
                  }}
                >
                  <FormControlLabel
                    value='0'
                    control={<Radio inputProps={{tabIndex: -1}} name='hourly' />}
                    checked={rateHourly}
                    label='Per Hour'
                    onChange={(e: any) => {
                      setCandidate({...candidate!, rate: e.target.value})
                    }}
                  />

                  <FormControlLabel
                    value='1'
                    control={<Radio inputProps={{tabIndex: -1}} name='salary' />}
                    checked={rateSalary}
                    label='Per Year'
                    onChange={(e: any) => {
                      setCandidate({...candidate!, rate: e.target.value})
                    }}
                  />
                </RadioGroup>
              </FormGroup>
            </FormControl>
          </Box>
          <Box className={classes.row}></Box>
          <Box className={classes.rowSpace}>
            <TextField
              inputProps={{tabIndex: 25}}
              className={classes.textField}
              id='rateMount'
              label='Rate Amount'
              onBlur={() => {
                setIsError({
                  ...isError,
                  rateMount: !candidate.rateMount?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={candidate?.rateMount ?? ''}
              error={isError.rateMount}
              onChange={(e: any) => {
                setCandidate({...candidate!, rateMount: e.target.value})
              }}
              InputProps={{
                startAdornment: <InputAdornment position='start'>$</InputAdornment>
              }}
              fullWidth
              helperText={isError.rateMount ? errorText.rateMountError : ''}
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
              setIsError({
                ...isError,
                firstName: !candidate.firstName?.replace(/\s+/g, '').length,
                lastName: !candidate.lastName?.replace(/\s+/g, '').length,
                displayAs: !candidate.displayAs?.replace(/\s+/g, '').length,
                cellPhone: !candidate.cellPhone?.replace(/\s+/g, '').length,
                workPhone: !candidate.workPhone?.replace(/\s+/g, '').length,
                address: !candidate.address?.addressLine1?.replace(/\s+/g, '').length,
                zipCode: !candidate.address?.zipCode?.replace(/\s+/g, '').length,
                state: !candidate.address?.state?.replace(/\s+/g, '').length,
                //Country: !candidate.address?.country?.replace(/\s+/g, '').length,
                workType: !candidate.workType?.replace(/\s+/g, '').length,
                marketing: !candidate.marketing?.replace(/\s+/g, '').length,
                email: !candidate.email?.replace(/\s+/g, '').length
              })
              if (
                candidate.firstName?.replace(/\s+/g, '').length &&
                candidate.lastName?.replace(/\s+/g, '').length &&
                candidate.displayAs?.replace(/\s+/g, '').length &&
                candidate.cellPhone?.replace(/\s+/g, '').length &&
                candidate.email?.replace(/\s+/g, '').length
              ) {
                // console.log(candidate.id)
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

export {ApplicantProfile}
