import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {Box, Container, TextField, MenuItem, Button} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {Contact} from 'graphql/types.generated'
import {Country} from 'type/company/contactEnums'
import {setToast, setSpinner} from 'store/action/globalActions'
import {ErrorMessages} from 'type/errorMessage'
import {saveContact} from 'api/companyApi'
import {Save} from '@material-ui/icons'
import InputMask from 'react-input-mask'
import HRModal from '../../page/shared/modal'
import {useGetContactByIdQuery} from 'graphql/Contact/Queries/GetContactByIdQuery.generated'

const defaultContact = {
  contactName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  website: '',
  country: 'United States'
}

type contactModalType = {
  open: boolean
  onClose: () => void
  refetch?: any
  contactId: any
  companyId: any
}

const ContactModal = ({onClose, refetch, open, companyId, contactId}: contactModalType) => {
  const useStyles = makeStyles((theme: Theme) => ({
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
    spinner: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    button: {
      ...typography.buttonGreen,
      textTransform: 'capitalize'
    },
    content: {
      borderBottom: `1px solid ${hrmangoColors.lightGray}`,
      borderTop: `1px solid ${hrmangoColors.lightGray}`,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      padding: `${spacing[12]}px ${spacing[24]}px ${spacing[48]}px`,
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      }
    }
  }))

  const [contact, setContact] = useState<Contact | undefined>({
    ...defaultContact,
    companyId: companyId,
    id: contactId
  })

  const classes = useStyles()
  const dispatch = useDispatch()
  //const [contact, setContact] = useState<Contact>(defaultContact)

  const [isError, setIsError] = useState({
    name: false,
    addressLine1: false,
    addressLine2: false,
    phone: false,
    email: false,
    website: false,
    city: false,
    state: false,
    zipCode: false,
    country: false
  })
  const [errorText] = useState({
    nameError: 'Please enter a valid contact name',
    addressLine1Error: 'Please enter a valid address',
    addressLine2Error: 'Please enter a address',
    phoneError: 'Please enter a valid phone',
    emailError: 'Please enter a valid email',
    websiteError: 'Please enter a valid web site',
    cityError: 'Please enter a valid city',
    stateError: 'Please enter a valid state',
    zipCodeError: 'Please enter a valid zip code',
    countryError: 'Please enter a valid country'
  })

  const createContact = useMutation(() => saveContact(companyId, contactId, {...contact}), {
    onMutate: () => {
      dispatch(setSpinner(true))
    },
    onError: (error: ErrorMessages) => {
      dispatch(setSpinner(false))
      dispatch(
        setToast({
          message: `Error saving the contact`,
          type: 'error'
        })
      )
    },
    onSuccess: () => {
      dispatch(setSpinner(false))
      dispatch(
        setToast({
          message: `Contact successfully saved`,
          type: 'success'
        })
      )
      refetch()
      onClose()
    },
    retry: 0
  })

  const {data, isSuccess, isFetching, refetch: refetchContact} = useGetContactByIdQuery(
    {
      contactId: parseInt(contactId),
      companyId: parseInt(companyId)
    },
    {
      enabled: false
    }
  )

  useEffect(() => {
    if (contactId && contactId !== 0) {
      refetchContact()
    }
    // eslint-disable-next-line
  }, [contactId])

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  useEffect(() => {
    setContact({
      ...(data?.contactById ?? defaultContact),
      companyId: companyId && companyId !== 0 ? companyId : data?.contactById?.companyId ?? null,
      id: contactId && contactId !== 0 ? contactId : data?.contactById?.id ?? 0
    })
  }, [data?.contactById, isSuccess])

  return (
    <HRModal header='Contact' open={open} onClose={onClose}>
      <div className={classes.content}>
        <Container>
          <Box className={classes.rowHeader}>Contact Information</Box>
          <Box className={classes.row}>
            <TextField
              required
              className={classes.textField}
              id='name'
              label='Contact Name'
              margin='normal'
              variant='outlined'
              value={contact?.contactName}
              error={isError.name}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, contactName: e.target.value})
              }}
              fullWidth
              helperText={isError.name ? errorText.nameError : ''}
            />
            <Box className={classes.rowSpace} />
            <InputMask
              value={contact?.phone}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, phone: e.target.value})
              }}
              mask='(999) 999-9999'
            >
              <TextField
                required
                className={classes.textField}
                id='phone'
                label='Telephone'
                margin='normal'
                variant='outlined'
                error={isError.phone}
                fullWidth
                helperText={isError.phone ? errorText.phoneError : ''}
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
              value={contact?.email}
              error={isError.email}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, email: e.target.value})
              }}
              fullWidth
              helperText={isError.email ? errorText.emailError : ''}
            />

            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='addressLine1'
              label='Address Line 1'
              margin='normal'
              variant='outlined'
              value={contact?.addressLine1 == null ? '' : contact?.addressLine1}
              error={isError.addressLine1}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, addressLine1: e.target.value})
              }}
              fullWidth
              helperText={isError.addressLine1 ? errorText.addressLine1Error : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              className={classes.textField}
              id='addressLine2'
              label='Address Line 2'
              margin='normal'
              variant='outlined'
              value={contact?.addressLine2 == null ? '' : contact?.addressLine2}
              error={isError.addressLine2}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, addressLine2: e.target.value})
              }}
              fullWidth
              helperText={isError.addressLine2 ? errorText.addressLine2Error : ''}
            />

            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='website'
              label='Website'
              margin='normal'
              variant='outlined'
              value={contact?.website == null ? '' : contact?.website}
              error={isError.website}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, website: e.target.value})
              }}
              fullWidth
              helperText={isError.website ? errorText.websiteError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              className={classes.textField}
              id='city'
              label='Town/City'
              margin='normal'
              variant='outlined'
              value={contact?.city == null ? '' : contact?.city}
              error={isError.city}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, city: e.target.value})
              }}
              fullWidth
              helperText={isError.city ? errorText.cityError : ''}
            />

            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='state'
              label='State'
              margin='normal'
              variant='outlined'
              value={contact?.state == null ? '' : contact?.state}
              error={isError.state}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, state: e.target.value})
              }}
              fullWidth
              helperText={isError.state ? errorText.stateError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              className={classes.textField}
              id='zipCode'
              label='Post/ZipCode'
              margin='normal'
              variant='outlined'
              value={contact?.zipCode == null ? '' : contact?.zipCode}
              error={isError.zipCode}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, zipCode: e.target.value})
              }}
              fullWidth
              helperText={isError.zipCode ? errorText.zipCodeError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='country'
              label='Country'
              margin='normal'
              variant='outlined'
              value={contact?.country == null ? '' : contact?.country}
              error={isError.country}
              onChange={(e: any) => {
                e.target.value.length < 257 && setContact({...contact!, country: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.country ? errorText.countryError : ''}
            >
              {Country.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
                name: !contact?.contactName?.replace(/\s+/g, '').length,
                phone: !contact?.phone?.replace(/\s+/g, '').length,
                email: !contact?.email?.replace(/\s+/g, '').length
              })
              if (
                contact?.contactName?.replace(/\s+/g, '').length &&
                contact?.phone?.replace(/\s+/g, '').length &&
                contact?.email?.replace(/\s+/g, '').length
              )
                createContact.mutate(contactId)
            }}
          >
            <Save fontSize='small' color='inherit' /> Save
          </Button>
        </Box>
      </div>
    </HRModal>
  )
}

export {ContactModal}
