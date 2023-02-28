import {useState, useRef} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {useHistory} from 'react-router'
import {DropzoneArea} from 'material-ui-dropzone'
import {externalRoutes} from 'router/externalRouter'

import {
  Box,
  Container,
  TextField,
  Button,
  InputAdornment,
  Chip,
  Checkbox,
  FormControlLabel,
  Step,
  StepLabel,
  Stepper,
  StepContent
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {setToast, setSpinner} from 'store/action/globalActions'
import {makeStyles} from '@material-ui/core'
import InputMask from 'react-input-mask'
import {Save} from '@material-ui/icons'

import {hrmangoColors, spacing, typography} from 'lib/hrmangoTheme'
import {JobDetailType} from 'type/job/jobDetail'
import {Candidate} from 'graphql/types.generated'
import {loadReCaptcha, ReCaptcha} from 'react-recaptcha-v3'
import {createExternal} from 'api/candidateApi'
import {addExternalDocument} from 'api/documentsApi'

//import {format} from 'date-fns'

const defaultCandidate = {
  id: 0,
  firstName: '',
  lastName: '',
  displayAs: '',
  email: '',
  cellPhone: '',
  department: '',
  jobTitle: '',
  status: '',
  noticePeriod: '',
  prefferedName: '',
  address: {
    street: '',
    zipCode: '',
    city: '',
    state: '',
    country: ''
  },
  skills: [],
  educations: [],
  experiences: [],
  document: {
    fileName: '',
    blobPath: '',
    blobName: '',
    fileType: '',
    fileSize: ''
  }
}

const useStyles = makeStyles(() => ({
  dataContainer: {
    padding: `${spacing[24]}px 0px 0px`
  },
  rowHeader: {
    ...typography.h6
  },
  row: {
    display: 'flex',
    //justifyContent: 'center',
    paddingLeft: spacing[48],
    paddingRight: spacing[48],
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px'
    },
    '& .MuiFormGroup-root': {
      flexWrap: 'nowrap'
    }
  },
  rowSpace: {
    padding: spacing[32]
  },
  textField: {
    width: '50%',
    '& .MuiFilledInput-input': {
      padding: '16px 13px'
    },
    '& .MuiFilledInput-root': {
      backgroundColor: hrmangoColors.lightestGray
    }
  },
  step: {
    backgroundColor: hrmangoColors.lightestGray
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

const ApplicantDetails = ({job}: JobDetailType) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  let recaptcha
  const [recaptchaToken, setRecaptchaToken] = useState<string | undefined>(undefined)
  const [candidate, setCandidate] = useState<Candidate>(defaultCandidate)
  const [isError, setIsError] = useState({
    firstName: false,
    lastName: false,
    cellPhone: false,
    email: false,
    street: false,
    zipCode: false,
    city: false,
    state: false,
    country: false,
    jobTitle: false,
    skills: false,
    linkedIn: false,
    facebook: false,
    twitter: false
  })
  const [errorText] = useState({
    firstNameError: 'Please enter a valid First Name',
    lastNameError: 'Please enter a valid Last Name',
    cellPhoneError: 'Please enter a valid Cell Phone',
    emailError: 'Please enter a valid Email',
    streetError: 'Please enter a valid Street',
    zipCodeError: 'Please enter a valid Zip/Postal Code',
    cityError: 'Please enter a valid City',
    stateError: 'Please enter a valid State',
    countryError: 'Please enter a valid Country',
    jobTitleError: 'Please enter a valid Job Title',
    skillsError: 'Please enter a valid Skills',
    linkedInError: 'Please enter a valid linkedIn',
    facebookError: 'Please enter a valid facebook',
    twitterError: 'Please enter a valid twitter'
  })
  const [activeStep, setActiveStep] = useState(0)

  const history = useHistory()
  const goToJobDetails = () => {
    history.push(`${externalRoutes.JobDetail}`, {
      params: job
    })
  }
  const handleEducationInputChange = (e, index) => {
    const {id, value, checked} = e.target
    const list = [...candidate!.educations!]
    list[index][id] = value ? value : checked
    setCandidate({
      ...candidate,
      educations: list
    })
  }

  const handleExperienceInputChange = (e, index) => {
    const {id, value, checked} = e.target
    const list = [...candidate!.experiences!]
    list[index][id] = value ? value : checked
    setCandidate({
      ...candidate,
      experiences: list
    })
  }

  const addEducationalDetail = () => {
    setActiveStep(candidate.educations?.length!)
    setCandidate({
      ...candidate,
      educations: [...candidate.educations!, {school: '', degree: '', major: '', currentlyPursuing: false}]
    })
  }

  const addExperienceDetail = () => {
    setActiveStep(candidate.experiences?.length!)
    setCandidate({
      ...candidate,
      experiences: [...candidate.experiences!, {ocuppation: '', company: '', summary: '', currentlyWorkHere: false}]
    })
  }

  const createCandidate = useMutation(
    () => createExternal(job?.id?.toString() ?? '', recaptchaToken ?? '', {...candidate}),
    {
      onMutate: () => {
        //dispatch(setSpinner(true))
      },
      onError: (error: any) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `There was an error processing your application, please try again later`,
            type: 'error'
          })
        )
      },
      onSuccess: (data: any) => {
        dispatch(setSpinner(false))
        data.json().then((candidate) => {
          dispatch(
            setToast({
              message: `Successfully applied for this Job`,
              type: 'success'
            })
          )
        })
        goToJobDetails()
      },
      retry: 0
    }
  )

  const saveFile = useMutation(
    ({item, event}: any) =>
      addExternalDocument({
        fileName: item.name,
        fileContents: event.target.result.replace(/^.+?(;base64),/, '')
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
            document: {
              fileName: document.name,
              fileType: document.type,
              fileSize: document.size,
              entityName: 'Candidate',
              blobPath: document.urlPath,
              blobName: document.fileName
            }
          })
        })
      },
      retry: 0
    }
  )

  loadReCaptcha('6LdX-JogAAAAABfjV2FxJOMEKIXcERwxteqw-q8v')

  const verifyCallback = (token) => {
    setRecaptchaToken(token)
    recaptchaToken && createCandidate.mutate()
  }

  const updateToken = () => {
    dispatch(setSpinner(true))
    // you will get a new token in verifyCallback
    recaptcha.execute()
  }

  return (
    <div className={classes.dataContainer}>
      <Container>
        <Box className={classes.rowHeader}>Basic Info</Box>
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
        </Box>
        <Box className={classes.row}>
          <InputMask
            ref={useRef<HTMLDivElement>(null)}
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
        </Box>
      </Container>
      <Container style={{paddingTop: spacing[48]}}>
        <Box className={classes.rowHeader}>Address Information</Box>
        <Box className={classes.row}>
          <TextField
            required
            className={classes.textField}
            id='street'
            label='Street'
            margin='normal'
            variant='outlined'
            value={candidate?.address?.addressLine1}
            error={isError.street}
            onChange={(e: any) => {
              setCandidate({...candidate!, address: {...candidate.address, addressLine1: e.target.value}})
            }}
            fullWidth
            helperText={isError.street ? errorText.streetError : ''}
          />
        </Box>
        <Box className={classes.row}>
          <TextField
            required
            className={classes.textField}
            id='zipCode'
            label='Zip/Postal Code'
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
        </Box>
        <Box className={classes.row}>
          <TextField
            required
            className={classes.textField}
            id='city'
            label='City'
            margin='normal'
            variant='outlined'
            value={candidate?.address?.city}
            error={isError.city}
            onChange={(e: any) => {
              setCandidate({...candidate!, address: {...candidate.address, city: e.target.value}})
            }}
            fullWidth
            helperText={isError.city ? errorText.cityError : ''}
          />
        </Box>
        <Box className={classes.row}>
          <TextField
            required
            className={classes.textField}
            id='state'
            label='State/Province'
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
            required
            className={classes.textField}
            id='country'
            label='Country'
            margin='normal'
            variant='outlined'
            value={candidate?.address?.country}
            error={isError.country}
            onChange={(e: any) => {
              setCandidate({...candidate!, address: {...candidate.address, country: e.target.value}})
            }}
            fullWidth
            helperText={isError.country ? errorText.countryError : ''}
          />
        </Box>
      </Container>
      <Container style={{paddingTop: spacing[48]}}>
        <Box className={classes.rowHeader}>Professional Details</Box>
        <Box className={classes.row}>
          <TextField
            required
            className={classes.textField}
            id='jobTitle'
            label='Current Job Title'
            margin='normal'
            variant='outlined'
            value={candidate?.jobTitle}
            error={isError.jobTitle}
            onChange={(e: any) => {
              setCandidate({...candidate!, jobTitle: e.target.value})
            }}
            fullWidth
            helperText={isError.jobTitle ? errorText.jobTitleError : ''}
          />
        </Box>
        <Box className={classes.row}>
          <Autocomplete
            multiple
            id='tags-filled'
            className={classes.textField}
            options={[]}
            onChange={(e: any) => {
              setCandidate({...candidate!, skills: [{skillSet: e.target.value}]})
            }}
            freeSolo
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant='outlined' label={option} {...getTagProps({index})} />
              ))
            }
            renderInput={(params) => <TextField {...params} variant='filled' label='Skill Set' placeholder='Skill' />}
            fullWidth
          />
        </Box>
      </Container>
      <Container style={{paddingTop: spacing[48]}}>
        <Box className={classes.rowHeader}>Educational Details</Box>
        <div>
          <div style={{cursor: 'pointer', color: '#0091D0'}} onClick={addEducationalDetail}>
            {'+ Add'}
          </div>

          <Stepper className={classes.step} activeStep={activeStep} orientation='vertical'>
            {candidate.educations?.map((input, i) => (
              <Step expanded={activeStep >= i}>
                <StepLabel></StepLabel>
                <StepContent>
                  <>
                    <Box className={classes.row}>
                      <TextField
                        required
                        className={classes.textField}
                        id='school'
                        label='Institute/School'
                        margin='normal'
                        variant='outlined'
                        value={input.school}
                        //error={isError.school}
                        onChange={(e: any) => {
                          handleEducationInputChange(e, i)
                        }}
                        fullWidth
                        //helperText={isError.school ? errorText.schoolError : ''}
                      />
                    </Box>
                    <Box className={classes.row}>
                      <TextField
                        required
                        className={classes.textField}
                        id='major'
                        label='Major/Deparment'
                        margin='normal'
                        variant='outlined'
                        value={input.major}
                        //error={isError.major}
                        onChange={(e: any) => {
                          handleEducationInputChange(e, i)
                        }}
                        fullWidth
                        //helperText={isError.major ? errorText.majorError : ''}
                      />
                    </Box>
                    <Box className={classes.row}>
                      <TextField
                        required
                        className={classes.textField}
                        id='degree'
                        label='Degree'
                        margin='normal'
                        variant='outlined'
                        value={input.degree}
                        //error={isError.degree}
                        onChange={(e: any) => {
                          handleEducationInputChange(e, i)
                        }}
                        fullWidth
                        //helperText={isError.degree ? errorText.degreeError : ''}
                      />
                    </Box>
                    <Box className={classes.row}>
                      <TextField
                        className={classes.textField}
                        id='startDate'
                        label={`Start Date`}
                        margin='normal'
                        variant='outlined'
                        value={input.startDate}
                        InputLabelProps={{
                          shrink: true
                        }}
                        //error={isError.startDate}
                        onChange={(e: any) => {
                          handleEducationInputChange(e, i)
                        }}
                        type='date'
                        //helperText={isError.startDate ? errorText.startDateError : ''}
                      />
                      <Box className={classes.rowSpace} />
                      <TextField
                        className={classes.textField}
                        id='endDate'
                        label={`End Date`}
                        margin='normal'
                        variant='outlined'
                        value={input.endDate}
                        InputLabelProps={{
                          shrink: true
                        }}
                        //error={isError.endDate}
                        onChange={(e: any) => {
                          handleEducationInputChange(e, i)
                        }}
                        type='date'
                        //helperText={isError.endDate ? errorText.endDateError : ''}
                      />
                    </Box>
                    <Box className={classes.row}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            id='currentlyPursuing'
                            checked={input.currentlyPursuing}
                            onChange={(e: any) => {
                              handleEducationInputChange(e, i)
                            }}
                          />
                        }
                        label='Currently pursuing'
                      />
                    </Box>
                  </>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>
      </Container>
      <Container style={{paddingTop: spacing[48]}}>
        <Box className={classes.rowHeader}>Experience Details</Box>
        <div>
          <div style={{cursor: 'pointer', color: '#0091D0'}} onClick={addExperienceDetail}>
            {'+ Add'}
          </div>

          <Stepper className={classes.step} activeStep={activeStep} orientation='vertical'>
            {candidate.experiences?.map((input, i) => (
              <Step expanded={activeStep >= i}>
                <StepLabel></StepLabel>
                <StepContent>
                  <>
                    <Box className={classes.row}>
                      <TextField
                        required
                        className={classes.textField}
                        id='ocuppation'
                        label='Occupation / Title'
                        margin='normal'
                        variant='outlined'
                        value={input.ocuppation}
                        //error={isError.ocuppation}
                        onChange={(e: any) => {
                          handleExperienceInputChange(e, i)
                        }}
                        fullWidth
                        //helperText={isError.ocuppation ? errorText.ocuppationError : ''}
                      />
                    </Box>
                    <Box className={classes.row}>
                      <TextField
                        required
                        className={classes.textField}
                        id='company'
                        label='Company'
                        margin='normal'
                        variant='outlined'
                        value={input.company}
                        //error={isError.company}
                        onChange={(e: any) => {
                          handleExperienceInputChange(e, i)
                        }}
                        fullWidth
                        //helperText={isError.company ? errorText.companyError : ''}
                      />
                    </Box>
                    <Box className={classes.row}>
                      <TextField
                        required
                        className={classes.textField}
                        id='summary'
                        label='Summary'
                        margin='normal'
                        variant='outlined'
                        value={input.summary}
                        //error={isError.summary}
                        onChange={(e: any) => {
                          handleExperienceInputChange(e, i)
                        }}
                        fullWidth
                        //helperText={isError.summary ? errorText.summaryError : ''}
                      />
                    </Box>
                    <Box className={classes.row}>
                      <TextField
                        className={classes.textField}
                        id='fromDate'
                        label={`From Date`}
                        margin='normal'
                        variant='outlined'
                        value={input.fromDate}
                        InputLabelProps={{
                          shrink: true
                        }}
                        //error={isError.fromDate}
                        onChange={(e: any) => {
                          handleExperienceInputChange(e, i)
                        }}
                        type='date'
                        //helperText={isError.fromDate ? errorText.fromDateError : ''}
                      />
                      <Box className={classes.rowSpace} />
                      <TextField
                        className={classes.textField}
                        id='toDate'
                        label={`To Date`}
                        margin='normal'
                        variant='outlined'
                        value={input.toDate}
                        InputLabelProps={{
                          shrink: true
                        }}
                        //error={isError.toDate}
                        onChange={(e: any) => {
                          handleExperienceInputChange(e, i)
                        }}
                        type='date'
                        //helperText={isError.toDate ? errorText.toDateError : ''}
                      />
                    </Box>
                    <Box className={classes.row}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            id='currentlyWorkHere'
                            checked={input.currentlyWorkHere}
                            onChange={(e: any) => {
                              handleExperienceInputChange(e, i)
                            }}
                          />
                        }
                        label='I currently work here'
                      />
                    </Box>
                  </>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>
      </Container>
      <Container style={{paddingTop: spacing[48]}}>
        <Box className={classes.rowHeader}>Social Network</Box>
        <Box className={classes.row}>
          <TextField
            className={classes.textField}
            id='linkedIn'
            label='LinkedIn'
            margin='normal'
            variant='outlined'
            value={candidate?.linkedIn}
            error={isError.linkedIn}
            onChange={(e: any) => {
              setCandidate({...candidate!, linkedIn: e.target.value})
            }}
            fullWidth
            helperText={isError.linkedIn ? errorText.linkedInError : ''}
          />
        </Box>
        <Box className={classes.row}>
          <TextField
            className={classes.textField}
            id='facebook'
            label='Facebook'
            margin='normal'
            variant='outlined'
            value={candidate?.facebook}
            error={isError.facebook}
            onChange={(e: any) => {
              setCandidate({...candidate!, facebook: e.target.value})
            }}
            fullWidth
            helperText={isError.facebook ? errorText.facebookError : ''}
          />
        </Box>
        <Box className={classes.row}>
          <TextField
            className={classes.textField}
            id='twitter'
            label='Twitter'
            margin='normal'
            variant='outlined'
            value={candidate?.twitter}
            error={isError.twitter}
            onChange={(e: any) => {
              setCandidate({...candidate!, twitter: e.target.value})
            }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>@</InputAdornment>
            }}
            fullWidth
            helperText={isError.twitter ? errorText.twitterError : ''}
          />
        </Box>
      </Container>
      <Container style={{paddingTop: spacing[48]}}>
        <Box className={classes.rowHeader}>Attachment Information</Box>
        <Box className={classes.row}>
          <DropzoneArea
            showPreviews={true}
            maxFileSize={26214400}
            filesLimit={1}
            useChipsForPreview
            showFileNamesInPreview={false}
            showPreviewsInDropzone={false}
            dropzoneText={`Upload your resume or drag and drop it here. Only .doc, .docx, .pdf, .odt, .rtf`}
            dropzoneClass={classes.dropzone}
            onDrop={(fileObjects) => {
              fileObjects.forEach((item) => {
                const reader = new FileReader()
                reader.onloadend = (event: any) => {
                  if (event.target.readyState === FileReader.DONE) {
                    saveFile.mutate({item, event})
                  }
                }
                reader.readAsDataURL(item)
              })
            }}
          />
        </Box>
      </Container>

      <Box style={{display: 'flex', justifyContent: 'end', margin: `${spacing[24]}px`}}>
        <ReCaptcha
          ref={(ref) => (recaptcha = ref)}
          sitekey='6LdX-JogAAAAABfjV2FxJOMEKIXcERwxteqw-q8v'
          action='submitApplication'
          verifyCallback={verifyCallback}
        />
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
              cellPhone: !candidate.cellPhone?.replace(/\s+/g, '').length,
              email: !candidate.email?.replace(/\s+/g, '').length,
              street: !candidate.address?.addressLine1?.replace(/\s+/g, '').length,
              zipCode: !candidate.address?.zipCode?.replace(/\s+/g, '').length,
              city: !candidate.address?.city?.replace(/\s+/g, '').length,
              state: !candidate.address?.state?.replace(/\s+/g, '').length,
              country: !candidate.address?.country?.replace(/\s+/g, '').length
            })
            if (
              candidate.firstName?.replace(/\s+/g, '').length &&
              candidate.lastName?.replace(/\s+/g, '').length &&
              candidate.cellPhone?.replace(/\s+/g, '').length &&
              candidate.email?.replace(/\s+/g, '').length &&
              candidate.address?.addressLine1?.replace(/\s+/g, '').length &&
              candidate.address?.zipCode?.replace(/\s+/g, '').length &&
              candidate.address?.city?.replace(/\s+/g, '').length &&
              candidate.address?.state?.replace(/\s+/g, '').length &&
              candidate.address?.country?.replace(/\s+/g, '').length
            ) {
              updateToken()
            }
          }}
        >
          <Save fontSize='small' color='inherit' /> Submit Application
        </Button>
      </Box>
    </div>
  )
}

export {ApplicantDetails}
