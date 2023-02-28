import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {LocationState} from 'type'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {Box, Container, TextField, MenuItem, Button, Grid} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {HiringManager, Job, SortEnumType} from 'graphql/types.generated'
import {JobType, JobExternalType, JobSource, Territory} from 'type/job/jobEnums'
import {setToast, setSpinner} from 'store/action/globalActions'
import {ErrorMessages} from 'type/errorMessage'
import {create, update} from 'api/jobApi'
import {Save} from '@material-ui/icons'
import {routes} from 'router'
import {useGetHiringManagersQuery} from 'graphql/Company/GetHiringManagersQuery.generated'
import {useGetJobByIdQuery} from 'graphql/Jobs/Queries/GetJobByIdQuery.generated'
import {useGetContactsQuery} from 'graphql/Contact/Queries/GetContactsQuery.generated'
import {ContactModal} from '../../contact/contactModal'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {User} from 'type/user/user'
import {getProfileInfo} from 'api/authApi'
import {requestRecruiter} from 'type/candidate/candidateEnums'

const defaultJob = {
  id: 0,
  jobName: '',
  companyId: 0,
  jobType: '',
  jobExternalType: '',
  contactId: 0,
  statusId: 0,
  jobOwnerShip: '',
  jobSource: '',
  jobDescription: '',
  city: '',
  state: '',
  zipCode: '',
  numOfPositions: 1,
  territory: '',
  numOfCandidates: 0,
  timeOffer: new Date(),
  timeFill: new Date(),
  career: '',
  payRange: '',
  payRange1: '',
  jobVertical: ''
}

const AddNewJobToCompany = withRouter(
  ({
    match,
    location,
    history
  }: RouteComponentProps<{jobId: string; companyId: string}, StaticContext, LocationState>) => {
    const useStyles = makeStyles((theme: Theme) => ({
      rowHeader: {
        ...typography.h6
      },
      row: {
        display: 'flex',
        paddingLeft: spacing[0],
        paddingRight: spacing[4],
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
        padding: spacing[48],
        display: 'grid'
      },
      textField: {
        '& .MuiFilledInput-input': {
          padding: '16px 13px'
        }
      },
      textField2: {
        width: '605px',
        '& .MuiFilledInput-input': {
          padding: '16px 13px'
        }
      },
      textArea: {
        ...typography.body1,
        width: '100%',
        height: '90%',
        paddingTop: spacing[16],
        paddingBottom: spacing[48],
        '& .ql-snow': {
          borderTopLeftRadius: spacing[8],
          borderTopRightRadius: spacing[8]
        },
        '& .ql-container': {
          borderTopLeftRadius: spacing[0],
          borderTopRightRadius: spacing[0],
          borderBottomLeftRadius: spacing[8],
          borderBottomRightRadius: spacing[8]
        }
      },
      button: {
        ...typography.buttonGreen,
        textTransform: 'capitalize'
      },
      buttonDense: {
        //...typography.buttonDense
        //padding: '16px 13px'
      },
      menuItem: {
        '&:focus': {
          '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: hrmangoColors.lightGray
          }
        }
      },
      paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1)
      },
      w: {
        height: '100px'
      }
    }))
    const [inputValue, setInputValue] = useState({
      companyId: ''
    })
    useEffect(() => {
      getProfileInfo()
        .then((response: User) => {
          setInputValue({
            ...inputValue,
            companyId: response.companyId!
          })
        })
        .catch((error: Error) => {
          dispatch(
            setToast({
              message: `Something went wrong ${error}`,
              type: 'error'
            })
          )
        })
        .finally(() => {})
    }, []) // eslint-disable-line
    const dispatch = useDispatch()
    const [job, setJob] = useState<Job>(defaultJob)
    const [payRange1, setPayRange1] = useState('')
    const classes = useStyles()
    const [owner, setOwner] = useState<HiringManager[] | null | undefined>()
    const [orderDir] = useState<SortEnumType>(SortEnumType.Asc)
    const [description, setDescription] = useState<string>('')
    const [isError, setIsError] = useState({
      jobName: false,
      companyId: false,
      jobType: false,
      jobExternalType: false,
      contactId: false,
      status: false,
      jobOwnerShip: false,
      jobSource: false,
      jobDescription: false,
      city: false,
      state: false,
      zipCode: false,
      numOfPositions: false,
      territory: false,
      timeOffer: false,
      timeFill: false,
      career: false,
      payRange: false,
      payRange1: false,
      jobVertical: false
    })
    const [errorText, setErrorText] = useState({
      jobNameError: 'Please enter a valid Job Name',
      companyIdError: 'Please enter a valid Company',
      jobTypeError: 'Please enter a valid Job Type',
      jobExternalTypeError: 'Please enter a valid Job External Type',
      contactIdError: 'Please enter a valid Contact',
      statusError: 'Please enter a valid Job Status',
      jobOwnerShipError: 'Please enter a valid Recruiter',
      jobSourceError: 'Please enter a valid Job Source',
      jobDescriptionError: 'Please enter a valid Description',
      cityError: 'Please enter a valid City',
      stateError: 'Please enter a valid State',
      zipCodeError: 'Please enter a valid Zip Code',
      numOfPositionsError: 'Please enter a valid Number of Positions',
      territoryError: 'Please enter a valid Territory',
      timeOfferError: 'Please enter a valid Date',
      timeFillError: 'Please enter a valid Date',
      careerError: 'Please enter a valid Carrer',
      payRangeError: 'Please enter a valid amount',
      payRange1Error: 'Please enter a valid amount',
      jobVerticalError: 'Please enter a valid JobVertical'
    })
    const companyId = inputValue.companyId
    const createJob = useMutation(
      (id: any) =>
        id !== 0
          ? update(id, {
              ...job!,
              jobDescription: description,
              companyId: parseInt(companyId!),
              payRange: `${setPayRange1} - ${job.payRange}`,
              statusId: 1
            })
          : create({
              ...job,
              jobDescription: description,
              companyId: parseInt(companyId!),
              payRange: `${payRange1} - ${job.payRange}`,
              statusId: 1
            }),
      {
        onMutate: () => {
          dispatch(setSpinner(true))
        },
        onError: (error: ErrorMessages) => {
          dispatch(setSpinner(false))
          dispatch(
            setToast({
              message: `Error saving the job`,
              type: 'error'
            })
          )

          let jobNameError = {text: '', error: false}
          let companyIdError = {text: '', error: false}
          let jobTypeError = {text: '', error: false}
          let jobExternalTypeError = {text: '', error: false}
          let contactIdError = {text: '', error: false}
          let statusError = {text: '', error: false}
          let jobOwnerShipError = {text: '', error: false}
          let jobSourceError = {text: '', error: false}
          let jobDescriptionError = {text: '', error: false}
          let cityError = {text: '', error: false}
          let stateError = {text: '', error: false}
          let zipCodeError = {text: '', error: false}
          let numOfPositionsError = {text: '', error: false}
          let territoryError = {text: '', error: false}
          let timeOfferError = {text: '', error: false}
          let timeFillError = {text: '', error: false}
          let careerError = {text: '', error: false}
          let payRangeError = {text: '', error: false}
          let payRange1Error = {text: '', error: false}
          let jobVerticalError = {text: '', error: false}

          error?.fieldMessages.forEach((fieldMessage) => {
            if (fieldMessage.fieldId === 'jobName') {
              jobNameError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'companyId') {
              companyIdError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'jobType') {
              jobTypeError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'jobExternalType') {
              jobExternalTypeError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'contactId') {
              contactIdError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'status') {
              statusError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'jobOwnerShip') {
              jobOwnerShipError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'jobSource') {
              jobSourceError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'jobDescription') {
              jobDescriptionError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'city') {
              cityError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'state') {
              stateError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'zipCode') {
              zipCodeError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'numOfPositions') {
              numOfPositionsError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'territory') {
              territoryError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'timeOffer') {
              timeOfferError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'timeFill') {
              timeFillError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'career') {
              careerError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'payRange') {
              payRangeError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'payRange1') {
              payRange1Error = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'jobVertical') {
              jobVerticalError = {text: fieldMessage.message, error: true}
            }
          })

          setErrorText({
            jobNameError: jobNameError.text,
            companyIdError: companyIdError.text,
            jobTypeError: jobTypeError.text,
            jobExternalTypeError: jobExternalTypeError.text,
            contactIdError: contactIdError.text,
            statusError: statusError.text,
            jobOwnerShipError: jobOwnerShipError.text,
            jobSourceError: jobSourceError.text,
            jobDescriptionError: jobDescriptionError.text,
            cityError: cityError.text,
            stateError: stateError.text,
            zipCodeError: zipCodeError.text,
            numOfPositionsError: numOfPositionsError.text,
            territoryError: territoryError.text,
            timeOfferError: timeOfferError.text,
            timeFillError: timeFillError.text,
            careerError: careerError.text,
            payRangeError: payRangeError.text,
            payRange1Error: payRange1Error.text,
            jobVerticalError: jobVerticalError.text
          })
          setIsError({
            jobName: jobNameError.error,
            companyId: companyIdError.error,
            jobType: jobTypeError.error,
            jobExternalType: jobExternalTypeError.error,
            contactId: contactIdError.error,
            status: statusError.error,
            jobOwnerShip: jobOwnerShipError.error,
            jobSource: jobSourceError.error,
            jobDescription: jobDescriptionError.error,
            city: cityError.error,
            state: stateError.error,
            zipCode: zipCodeError.error,
            numOfPositions: numOfPositionsError.error,
            territory: territoryError.error,
            timeOffer: timeOfferError.error,
            timeFill: timeFillError.error,
            career: careerError.error,
            payRange: payRangeError.error,
            payRange1: payRange1Error.error,
            jobVertical: jobVerticalError.error
          })
        },
        onSuccess: (data: any) => {
          dispatch(setSpinner(false))
          data.json().then((job) => {
            dispatch(
              setToast({
                message: `${job.jobName} successfully saved`,
                type: 'success'
              })
            )
            history.push(`${routes.JobCompanyDetail}/${job.id}`, {
              header: {
                title: `${job.jobName} | ${job.companyName}` as any,
                owner: job.jobOwnerShip,
                type: job.jobType,
                color: '#0091D0' as any
              },
              backUrl: history.location.state.backUrl,
              backState: history.location.state.backState
            })
          })
        },
        retry: 0
      }
    )

    const {data: ownerData, isSuccess: ownerIsSuccess} = useGetHiringManagersQuery(
      {skip: 0, take: 50},
      {
        enabled: true,
        refetchOnMount: 'always'
      }
    )

    useEffect(() => {
      if (ownerData) {
        setOwner(ownerData?.hiringManagers?.items)
      }
      // eslint-disable-next-line
    }, [ownerData?.hiringManagers, ownerIsSuccess])

    const {data: contactData, isSuccess: contactIsSuccess, refetch: refetchContact} = useGetContactsQuery({
      companyId: job.companyId,
      // eslint-disable-next-line
      order: {['companyName']: orderDir},
      skip: 0,
      take: 50
    })

    useEffect(() => {
      if (contactData) {
        //setContacts(contactData?.contacts?.items)
      }
      // eslint-disable-next-line
    }, [contactData?.contacts, contactIsSuccess])

    const jobId = match.params.jobId
    const {data, isSuccess, isFetching, refetch} = useGetJobByIdQuery(
      {
        jobId: parseInt(jobId)
      },
      {enabled: false}
    )

    const [contactModalOpen, setContactModalOpen] = useState(false)

    useEffect(() => {
      if (jobId) refetch()
      // eslint-disable-next-line
    }, [jobId])

    useEffect(() => {
      dispatch(setSpinner(isFetching))
      // eslint-disable-next-line
    }, [isFetching])

    useEffect(() => {
      if (data) {
        setJob({...data.jobById!})
        setDescription(data.jobById.jobDescription ?? '')
      }
      // eslint-disable-next-line
    }, [data?.jobById, isSuccess])

    return (
      <div>
        <Container>
          <Box className={classes.rowHeader}>Job Details</Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Grid container>
                <Grid item xs={12}>
                  <Box className={classes.row} sx={{width: '100%'}}>
                    <TextField
                      inputProps={{tabIndex: 0}}
                      className={classes.textField}
                      id='jobVertical'
                      label='Request a Recruiter'
                      margin='normal'
                      variant='outlined'
                      value={job?.jobVertical || 0}
                      error={isError.jobVertical}
                      onChange={(e: any) => {
                        setJob({...job!, jobVertical: e.target.value})
                      }}
                      fullWidth
                      select
                      helperText={isError.jobVertical ? errorText.jobVerticalError : ''}
                    >
                      {requestRecruiter.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.row} sx={{width: '100%'}}>
                    <TextField
                      required
                      className={classes.textField}
                      id='jobName'
                      label='Job Title'
                      margin='normal'
                      variant='outlined'
                      value={job?.jobName}
                      error={isError.jobName}
                      onChange={(e: any) => {
                        e.target.value.length < 257 &&
                          setJob({
                            ...job!,
                            jobName: e.target.value
                          })
                      }}
                      fullWidth
                      helperText={isError.jobName ? errorText.jobNameError : ''}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.row} sx={{width: '100%'}}>
                    <TextField
                      required
                      className={classes.textField}
                      id='jobType'
                      label='Job Type'
                      margin='normal'
                      variant='outlined'
                      value={job?.jobType}
                      error={isError.jobType}
                      onChange={(e: any) => {
                        e.target.value.length < 257 && setJob({...job!, jobType: e.target.value})
                      }}
                      fullWidth
                      select
                      helperText={isError.jobType ? errorText.jobTypeError : ''}
                    >
                      {JobType.map((option) => (
                        <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.row} sx={{width: '100%'}}>
                    <TextField
                      inputProps={{tabIndex: -1}}
                      className={classes.textField}
                      id='jobSource'
                      label='Job Source'
                      margin='normal'
                      variant='outlined'
                      value={job.jobSource ?? undefined}
                      error={isError.jobSource}
                      onChange={(e: any) => {
                        e.target.value.length < 257 && setJob({...job!, jobSource: e.target.value})
                      }}
                      fullWidth
                      select
                      helperText={isError.jobSource ? errorText.jobSourceError : ''}
                    >
                      {JobSource.map((option) => (
                        <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    className={classes.textField}
                    id='jobOwnerShip'
                    label='Hiring Manager'
                    margin='normal'
                    variant='outlined'
                    value={job?.jobOwnerShip}
                    error={isError.jobOwnerShip}
                    onChange={(e: any) => {
                      e.target.value.length < 257 && setJob({...job!, jobOwnerShip: e.target.value})
                    }}
                    fullWidth
                    select
                    helperText={isError.jobOwnerShip ? errorText.jobOwnerShipError : ''}
                  >
                    <MenuItem value=''>
                      <b>
                        <em>Select the Job OwnerShip *</em>
                      </b>
                    </MenuItem>
                    {owner?.map((option) => (
                      <MenuItem
                        key={option.hiringManagerName}
                        value={option.hiringManagerName}
                        className={classes.menuItem}
                      >
                        {option.hiringManagerName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    className={classes.textField}
                    id='jobExternalType'
                    label='Job External Type'
                    margin='normal'
                    variant='outlined'
                    value={job?.jobExternalType}
                    error={isError.jobExternalType}
                    onChange={(e: any) => {
                      e.target.value.length < 257 && setJob({...job!, jobExternalType: e.target.value})
                    }}
                    fullWidth
                    select
                    helperText={isError.jobExternalType ? errorText.jobExternalTypeError : ''}
                  >
                    {JobExternalType.map((option) => (
                      <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Box className={classes.row} sx={{width: '100%'}}>
                        <TextField
                          required
                          className={classes.textField}
                          id='city'
                          label='City'
                          margin='normal'
                          variant='outlined'
                          value={job?.city}
                          error={isError.city}
                          onChange={(e: any) => {
                            e.target.value.length < 257 && setJob({...job!, city: e.target.value})
                          }}
                          fullWidth
                          helperText={isError.city ? errorText.cityError : ''}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Box className={classes.row} sx={{width: '100%'}}>
                        <TextField
                          required
                          className={classes.textField}
                          id='state'
                          label='State'
                          margin='normal'
                          variant='outlined'
                          value={job?.state}
                          error={isError.state}
                          onChange={(e: any) => {
                            e.target.value.length < 257 && setJob({...job!, state: e.target.value})
                          }}
                          fullWidth
                          helperText={isError.state ? errorText.stateError : ''}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.row} sx={{width: '100%'}}>
                    <TextField
                      className={classes.textField}
                      inputProps={{tabIndex: -1}}
                      id='territory'
                      label='Territory'
                      margin='normal'
                      variant='outlined'
                      value={job.territory}
                      error={isError.territory}
                      onChange={(e: any) => {
                        e.target.value.length < 257 && setJob({...job!, territory: e.target.value})
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
                  </Box>
                </Grid>
                <Box className={classes.rowHeader}>Date & Salary Information</Box>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Box className={classes.row} sx={{width: '100%'}}>
                        <TextField
                          required
                          className={classes.textField}
                          id='SalaryFrom'
                          label='Salary From'
                          margin='normal'
                          variant='outlined'
                          error={isError.payRange}
                          onChange={(event) => setPayRange1(event.target.value)}
                          value={payRange1 || job?.payRange?.split(/\s*\-\s*/g)[0]}
                          fullWidth
                          helperText={isError.payRange ? errorText.payRange1Error : ''}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Box className={classes.row} sx={{width: '100%'}}>
                        <TextField
                          required
                          className={classes.textField}
                          id='SalaryTo'
                          label='Salary to'
                          margin='normal'
                          variant='outlined'
                          value={job?.payRange?.split(/\s*\-\s*/g)[1]}
                          error={isError.payRange}
                          onChange={(e: any) => {
                            e.target.value.length < 257 && setJob({...job!, payRange: e.target.value})
                          }}
                          fullWidth
                          helperText={isError.payRange ? errorText.payRangeError : ''}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <ReactQuill
                tabIndex={-1}
                className={classes.textArea}
                value={description}
                onChange={setDescription}
                placeholder='Job Description'
              />
            </Grid>
          </Grid>
          <Box style={{display: 'flex', justifyContent: 'end', margin: `${spacing[24]}px`}}>
            <Button
              size='large'
              type='submit'
              variant='contained'
              className={classes.button}
              onClick={() => {
                setIsError({
                  ...isError,
                  jobName: !job.jobName?.replace(/\s+/g, '').length,
                  jobType: !job.jobType?.replace(/\s+/g, '').length,
                  jobOwnerShip: !job.jobOwnerShip?.replace(/\s+/g, '').length,
                  city: !job.city?.replace(/\s+/g, '').length,
                  state: !job.state?.replace(/\s+/g, '').length,
                  payRange: !job.payRange?.replace(/\s+/g, '').length,
                  jobSource: !job.jobSource?.replace(/\s+/g, '').length,
                  jobExternalType: !job.jobExternalType?.replace(/\s+/g, '').length,
                  territory: !job.territory?.replace(/\s+/g, '').length
                })
                if (
                  job.jobName?.replace(/\s+/g, '').length &&
                  job.jobType?.replace(/\s+/g, '').length &&
                  job.jobOwnerShip?.replace(/\s+/g, '').length &&
                  job.city?.replace(/\s+/g, '').length &&
                  job.state?.replace(/\s+/g, '').length &&
                  job.payRange?.replace(/\s+/g, '').length &&
                  job.jobSource?.replace(/\s+/g, '').length &&
                  job.jobExternalType?.replace(/\s+/g, '').length &&
                  job.territory?.replace(/\s+/g, '').length
                ) {
                  console.log('aqui')
                  createJob.mutate(job.id)
                }
              }}
            >
              <Save fontSize='small' color='inherit' /> Save
            </Button>
          </Box>
        </Container>

        <ContactModal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          companyId={job.companyId}
          contactId={job.contactId}
          refetch={refetchContact}
        />
      </div>
    )
  }
)

export {AddNewJobToCompany}
