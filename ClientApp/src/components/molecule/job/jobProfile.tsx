import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {LocationState} from 'type'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {Box, Container, TextField, MenuItem, Button, Link, FormControl} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {Company, HiringManager, Job, Contact, SortEnumType, CompanySortInput} from 'graphql/types.generated'
import {JobType, JobExternalType, JobSource, JobStatus, Territory, JobVertical} from 'type/job/jobEnums'
import {setToast, setSpinner} from 'store/action/globalActions'
import {ErrorMessages} from 'type/errorMessage'
import {create, update} from 'api/jobApi'
import {Save, MoreVert} from '@material-ui/icons'
import {useGetCompanyDataQuery} from 'graphql/Company/Queries/GetCompanyDataQuery.generated'
import {routes} from 'router'
import {useGetHiringManagersQuery} from 'graphql/Company/GetHiringManagersQuery.generated'
import {useGetJobByIdQuery} from 'graphql/Jobs/Queries/GetJobByIdQuery.generated'
import {useGetContactsQuery} from 'graphql/Contact/Queries/GetContactsQuery.generated'
import {ContactModal} from '../contact/contactModal'
import {DateTimePicker} from '@material-ui/pickers'
//import DateFnsUtils from '@date-io/date-fns'
import enLocale from 'date-fns/locale/en-US'
import DateFnsTzUtils from 'lib/atom/datePicker/DateFnsTzUtils'
import MuiPickersTzUtilsProvider from 'lib/atom/datePicker/MuiPickersTzUtilsProvider'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

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
  jobVertical: '',
  internalReference: ''
}

const JobProfile = withRouter(
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
      textField2: {
        width: '605px',
        '& .MuiFilledInput-input': {
          padding: '16px 13px'
        }
      },
      textArea: {
        ...typography.body1,
        width: '100%',
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
      }
    }))
    const [job, setJob] = useState<Job>(defaultJob)
    const classes = useStyles()
    const dispatch = useDispatch()
    const [companies, setCompanies] = useState<Company[] | null | undefined>()
    const [owner, setOwner] = useState<HiringManager[] | null | undefined>()
    const [contacts, setContacts] = useState<Contact[] | null | undefined>()
    type SortCol = keyof Pick<CompanySortInput, 'companyName'>
    const [orderByCol] = useState<SortCol>('companyName')
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
      jobVertical: false
    })
    const [errorText, setErrorText] = useState({
      jobNameError: 'Please enter a valid Job Name',
      companyIdError: 'Please enter a valid Company',
      jobTypeError: 'Please enter a valid Job Type',
      jobExternalTypeError: 'Please enter a valid Job External Type',
      contactIdError: 'Please enter a valid Contact',
      statusError: 'Please enter a valid Job Status',
      jobOwnerShipError: 'Please enter a valid Job OwnerShip',
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
      payRangeError: 'Please enter a valid Carrer',
      jobVerticalError: 'Please enter a valid JobVertical'
    })

    const createJob = useMutation(
      (id: any) =>
        id !== 0 ? update(id, {...job!, jobDescription: description}) : create({...job, jobDescription: description}),
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
            history.push(`${routes.JobDetail}/${job.id}`, {
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
        setContacts(contactData?.contacts?.items)
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

    const {data: companyData, isSuccess: companiesIsSuccess} = useGetCompanyDataQuery(
      {
        filter: {},
        skip: 0,
        take: 50,
        order: {[orderByCol]: orderDir}
      },
      {
        enabled: true,
        refetchOnMount: 'always'
      }
    )

    const [contactModalOpen, setContactModalOpen] = useState(false)
    const [carrerEditOpen, setCarrerEditOpen] = useState(false)

    useEffect(() => {
      if (companyData) {
        setCompanies(companyData?.companyData?.items)
        if (!jobId) {
          const id = parseInt(location?.state?.params?.companyId ?? '0')
          const company = companyData?.companyData?.items?.find((item) => item.id === id)
          setJob({
            ...job!,
            companyId: company?.id ?? 0
          })
        }
      }
      // eslint-disable-next-line
    }, [companyData?.companyData, companiesIsSuccess])

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
        /*const dateTimeOffer = utcToZonedTime(data.jobById.timeOffer, 'UTC')
        const dateTimeFill = utcToZonedTime(data.jobById.timeFill, 'UTC')
        const formattedOfferDate = data.jobById.timeOffer && format(dateTimeOffer, "yyyy-MM-dd'T'HH:mm")
        const formattedFillDate = data.jobById.timeFill && format(dateTimeFill, "yyyy-MM-dd'T'HH:mm")
        setJob({...data.jobById!, timeOffer: formattedOfferDate, timeFill: formattedFillDate})*/
        setJob({...data.jobById!})
        setDescription(data.jobById.jobDescription ?? '')
        data.jobById.career && setCarrerEditOpen(true)
      }
      // eslint-disable-next-line
    }, [data?.jobById, isSuccess])

    return (
      <div>
        <Container>
          <Box className={classes.rowHeader}>Job Details</Box>
          <Box className={classes.row}>
            <TextField
              required
              className={classes.textField}
              id='companyId'
              label='Company'
              margin='normal'
              variant='outlined'
              value={job.companyId ?? undefined}
              error={isError.companyId}
              onChange={(e: any) => {
                const company = companies?.find((item) => item.id === e.target.value)
                setJob({...job!, companyId: company?.id ?? 0})
              }}
              fullWidth
              select
              helperText={isError.companyId ? errorText.companyIdError : ''}
            >
              <MenuItem value=''>
                <b>
                  <em>Select Your Company *</em>
                </b>
              </MenuItem>
              {companies?.map((option) => (
                <MenuItem key={option.id} value={option.id} className={classes.menuItem}>
                  {option.companyName}
                </MenuItem>
              ))}
            </TextField>
            <Box className={classes.rowSpace} />
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
          <Box className={classes.row}>
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
            <Box className={classes.rowSpace} />
            <TextField
              required
              className={classes.textField}
              id='contactId'
              label='Contact'
              margin='normal'
              variant='outlined'
              value={job.contactId}
              onClick={(e: any) => {
                setJob({...job!, contactId: e.target.value})
              }}
              error={isError.contactId}
              select
              style={{width: '90%'}}
              helperText={isError.contactId ? errorText.contactIdError : ''}
            >
              <MenuItem value=''>
                <b>
                  <em>Select the Contact *</em>
                </b>
              </MenuItem>
              {contacts?.map((option) => (
                <MenuItem key={option.id} value={option.id} className={classes.menuItem}>
                  {option.contactName}
                </MenuItem>
              ))}
            </TextField>
            <Button
              tabIndex={-1}
              className={classes.buttonDense}
              style={{width: '10%', display: 'flex', justifyContent: 'end'}}
              onClick={() => {
                job.companyId && setContactModalOpen(true)
              }}
            >
              <MoreVert fontSize='small' color='inherit' />
            </Button>
          </Box>
          <Box className={classes.row}>
            <TextField
              required
              className={classes.textField}
              id='status'
              label='Job Status'
              margin='normal'
              variant='outlined'
              value={job?.statusId}
              error={isError.status}
              onChange={(e: any) => {
                setJob({...job!, statusId: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.status ? errorText.statusError : ''}
            >
              {JobStatus.map((option) => (
                <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Box className={classes.rowSpace} />
            <TextField
              required
              disabled={!job.companyId}
              className={classes.textField}
              id='jobOwnerShip'
              label='HRMango Job OwnerShip'
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
                <MenuItem key={option.hiringManagerName} value={option.hiringManagerName} className={classes.menuItem}>
                  {option.hiringManagerName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box className={classes.row}>
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
            <Box className={classes.rowSpace} />
            {!carrerEditOpen ? (
              <TextField
                inputProps={{tabIndex: -1}}
                className={classes.textField}
                id='career'
                label='Career'
                margin='normal'
                variant='outlined'
                value={job.career}
                onChange={(e: any) => {
                  e.target.value.length < 257 && setJob({...job!, career: e.target.value})
                }}
                error={isError.career}
                fullWidth
                helperText={isError.career ? errorText.careerError : ''}
              />
            ) : (
              <Link
                style={{width: '90%', display: 'flex', justifyContent: 'end', marginTop: '28px'}}
                href={`//${job.career}`}
                target='_blank'
                rel='noreferrer'
              >
                <span style={{cursor: 'pointer', color: '#0091D0'}}>{job.career}</span>
              </Link>
            )}
            {job.career && carrerEditOpen ? (
              <Button
                className={classes.buttonDense}
                style={{width: '10%', display: 'flex', justifyContent: 'end'}}
                onClick={() => {
                  job.career && setCarrerEditOpen(false)
                }}
              >
                <MoreVert fontSize='small' color='inherit' />
              </Button>
            ) : null}
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='payRange'
              label='Pay Range'
              margin='normal'
              variant='outlined'
              value={job.payRange ?? undefined}
              onChange={(e: any) => {
                e.target.value.length < 257 && setJob({...job!, payRange: e.target.value})
              }}
              error={isError.payRange}
              fullWidth
              helperText={isError.payRange ? errorText.payRangeError : ''}
            />
            <Box className={classes.rowSpace} />
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
                  error={isError.jobVertical}
                  helperText={isError.jobVertical ? errorText.jobVerticalError : ''}
                />
              )}
              fullWidth
              inputValue={job?.jobVertical}
              onInputChange={(e: any, select: any) => {
                select?.length < 257 &&
                  setJob({
                    ...job!,
                    jobVertical: select
                  })
              }}
            />
          </Box>
          <Box className={classes.row}>
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
            <Box className={classes.rowSpace} />
            <TextField
              disabled
              className={classes.textField}
              id='internalReference'
              label='Internal Reference'
              margin='normal'
              variant='outlined'
              value={job?.internalReference}
              fullWidth
            />
          </Box>
          <FormControl component='div' fullWidth />
        </Container>

        <Container style={{paddingTop: spacing[48]}}>
          <Box className={classes.rowHeader}>Job Profile</Box>
          <Box className={classes.row}>
            <ReactQuill
              tabIndex={-1}
              className={classes.textArea}
              value={description}
              onChange={setDescription}
              placeholder='Job Description'
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              required
              className={classes.textField}
              id='city'
              label='Location City'
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
            <Box className={classes.rowSpace} />
            <TextField
              required
              className={classes.textField}
              id='state'
              label='Location State'
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
          <Box className={classes.row}>
            <TextField
              required
              className={classes.textField}
              id='zipCode'
              label='Location Zip Code'
              margin='normal'
              variant='outlined'
              value={job.zipCode ?? undefined}
              error={isError.zipCode}
              onChange={(e: any) => {
                e.target.value.length < 257 && setJob({...job!, zipCode: e.target.value})
              }}
              fullWidth
              helperText={isError.zipCode ? errorText.zipCodeError : ''}
            />
            <Box className={classes.rowSpace} />
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
          <Box className={classes.row} style={{paddingTop: spacing[16]}}>
            <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
              <DateTimePicker
                inputProps={{tabIndex: -1}}
                autoOk
                inputVariant='outlined'
                variant='inline'
                id='timeOffer'
                label={`Date Job Opened`}
                format='yyyy-MM-dd hh:mm a (z)'
                value={job.timeOffer}
                onChange={(date: any) => {
                  setJob({...job!, timeOffer: date})
                }}
              />
              <Box className={classes.rowSpace} />
              <DateTimePicker
                inputProps={{tabIndex: -1}}
                autoOk
                inputVariant='outlined'
                variant='inline'
                id='timeFill'
                label={`Goal date to be filled`}
                format='yyyy-MM-dd hh:mm a (z)'
                value={job.timeFill}
                onChange={(date: any) => {
                  setJob({...job!, timeFill: date})
                }}
              />
            </MuiPickersTzUtilsProvider>
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: -1}}
              className={classes.textField}
              id='numOfPositions'
              label='Number of positions'
              margin='normal'
              variant='outlined'
              value={job.numOfPositions ?? undefined}
              error={isError.numOfPositions}
              onChange={(e: any) => {
                e.target.value.length < 257 && setJob({...job!, numOfPositions: e.target.value})
              }}
              fullWidth
              helperText={isError.numOfPositions ? errorText.numOfPositionsError : ''}
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
                jobName: !job.jobName?.replace(/\s+/g, '').length,
                jobType: !job.jobType?.replace(/\s+/g, '').length,
                status: !job.statusId,
                companyId: !job.companyId,
                contactId: !job.contactId,
                jobOwnerShip: !job.jobOwnerShip?.replace(/\s+/g, '').length,
                city: !job.city?.replace(/\s+/g, '').length,
                state: !job.state?.replace(/\s+/g, '').length,
                zipCode: !job.zipCode?.replace(/\s+/g, '').length
              })
              if (
                job.jobName?.replace(/\s+/g, '').length &&
                job.jobType?.replace(/\s+/g, '').length &&
                job.statusId &&
                job.companyId &&
                job.contactId &&
                job.jobOwnerShip?.replace(/\s+/g, '').length &&
                job.city?.replace(/\s+/g, '').length &&
                job.state?.replace(/\s+/g, '').length &&
                job.zipCode?.replace(/\s+/g, '').length
              ) {
                createJob.mutate(job.id)
              }
            }}
          >
            <Save fontSize='small' color='inherit' /> Save
          </Button>
        </Box>
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

export {JobProfile}
