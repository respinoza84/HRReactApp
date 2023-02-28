import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {withRouter, RouteComponentProps} from 'react-router'
import {Box, Container, TextField, MenuItem, Button, FormControl} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, typography} from 'lib/hrmangoTheme'
import {ContactInfo} from 'graphql/types.generated'
import {Country} from 'type/company/contactEnums'
import {setToast, setSpinner} from 'store/action/globalActions'
import {ErrorMessages} from 'type/errorMessage'
import {contact} from 'api/candidateApi'
import {Save} from '@material-ui/icons'
import InputMask from 'react-input-mask'
import {useGetContactInfoByIdQuery} from 'graphql/Candidates/Queries/GetContactInfoByIdQuery.generated'

const defaultContact = {
  candidateId: 0,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  homePhone: '',
  cellPhone: '',
  workPhone: '',
  linkedIn: '',
  indeed: '',
  email: '',
  otherEmail: ''
}
const ContactProfile = withRouter(({match}: RouteComponentProps<{candidateId: string}>) => {
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
    }
  }))

  const classes = useStyles()
  const dispatch = useDispatch()
  const candidateId = match.params.candidateId
  const [contactInfo, setContact] = useState<ContactInfo>(defaultContact)

  const {data, isSuccess, isFetching} = useGetContactInfoByIdQuery(
    {
      candidateId: parseInt(candidateId)
    },
    {
      enabled: true,
      refetchOnMount: 'always'
    }
  )

  useEffect(() => {
    if (data) {
      setContact({...data?.contactInfoById, candidateId: parseInt(candidateId)})
    }
    // eslint-disable-next-line
  }, [data?.contactInfoById, isSuccess])

  useEffect(() => {
    dispatch(setSpinner(isFetching))
    // eslint-disable-next-line
  }, [isFetching])

  const updateContact = useMutation(() => contact(candidateId, contactInfo), {
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
          message: `Contact successfully saving`,
          type: 'success'
        })
      )
    },
    retry: 0
  })

  return (
    <div>
      <Container>
        <Box className={classes.rowHeader}>Address & Contact Information</Box>
        <Box className={classes.row}>
          <TextField
            required
            className={classes.textField}
            id='addressLine1'
            label='Address Line 1'
            margin='normal'
            variant='outlined'
            value={contactInfo?.addressLine1}
            //error={isError.addressLine1}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, addressLine1: e.target.value})
            }}
            fullWidth
            //InputLabelProps={{shrink: true}}
            //helperText={isError.addressLine1 ? errorText.addressLine1Error : ''}
          />
          <Box className={classes.rowSpace} />
          <InputMask
            value={contactInfo?.workPhone}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, workPhone: e.target.value})
            }}
            mask='(999) 999-9999'
          >
            <TextField
              className={classes.textField}
              id='workPhone'
              label='Work Phone'
              margin='normal'
              variant='outlined'
              //error={isError.phone}
              fullWidth
              //helperText={isError.phone ? errorText.phoneError : ''}
            />
          </InputMask>
        </Box>
        <Box className={classes.row}>
          <TextField
            className={classes.textField}
            id='addressLine2'
            label='Address Line 2'
            margin='normal'
            variant='outlined'
            value={contactInfo?.addressLine2}
            //error={isError.addressLine2}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, addressLine2: e.target.value})
            }}
            fullWidth
            //helperText={isError.addressLine2 ? errorText.addressLine2Error : ''}
          />
          <Box className={classes.rowSpace} />
          <InputMask
            value={contactInfo?.cellPhone}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, cellPhone: e.target.value})
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
              //error={isError.phone}
              fullWidth
              //helperText={isError.phone ? errorText.phoneError : ''}
            />
          </InputMask>
        </Box>
        <Box className={classes.row}>
          <TextField
            required
            className={classes.textField}
            id='city'
            label='City'
            margin='normal'
            variant='outlined'
            value={contactInfo?.city}
            //error={isError.city}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, city: e.target.value})
            }}
            fullWidth
            //helperText={isError.city ? errorText.cityError : ''}
          />
          <Box className={classes.rowSpace} />
          <TextField
            className={classes.textField}
            id='linkedIn'
            label='linkedIn'
            margin='normal'
            variant='outlined'
            value={contactInfo?.linkedIn}
            //error={isError.linkedIn}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, linkedIn: e.target.value})
            }}
            fullWidth
            //helperText={isError.linkedIn ? errorText.linkedInError : ''}
          />
        </Box>
        <Box className={classes.row}>
          <TextField
            required
            className={classes.textField}
            id='state'
            label='State'
            margin='normal'
            variant='outlined'
            value={contactInfo?.state}
            //error={isError.state}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, state: e.target.value})
            }}
            fullWidth
            //helperText={isError.state ? errorText.stateError : ''}
          />
          <Box className={classes.rowSpace} />
          <TextField
            required
            className={classes.textField}
            id='email'
            label='Email'
            margin='normal'
            variant='outlined'
            value={contactInfo?.email}
            //error={isError.email}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, email: e.target.value})
            }}
            fullWidth
            //helperText={isError.email ? errorText.emailError : ''}
          />
        </Box>
        <Box className={classes.row}>
          <TextField
            required
            className={classes.textField}
            id='zipCode'
            label='Post/ZipCode'
            margin='normal'
            variant='outlined'
            value={contactInfo?.zipCode}
            //error={isError.zipCode}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, zipCode: e.target.value})
            }}
            fullWidth
            //helperText={isError.zipCode ? errorText.zipCodeError : ''}
          />
          <Box className={classes.rowSpace} />
          <TextField
            className={classes.textField}
            id='otherEmail'
            label='Other Email'
            margin='normal'
            variant='outlined'
            value={contactInfo?.otherEmail}
            //error={isError.otherEmail}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, otherEmail: e.target.value})
            }}
            fullWidth
            //helperText={isError.otherEmail ? errorText.otherEmailError : ''}
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
            value={contactInfo?.country}
            //error={isError.country}
            onChange={(e: any) => {
              e.target.value.length < 257 && setContact({...contactInfo!, country: e.target.value})
            }}
            fullWidth
            select
            //helperText={isError.country ? errorText.countryError : ''}
          >
            {Country.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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
          onClick={() => updateContact.mutate()}
        >
          <Save fontSize='small' color='inherit' /> Save
        </Button>
      </Box>
    </div>
  )
})

export {ContactProfile}
