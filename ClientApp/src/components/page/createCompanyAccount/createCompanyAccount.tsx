import {makeStyles, Box, Container, Grid, Button, TextField} from '@material-ui/core'
import {spacing, hrmangoColors, fontWeight400} from 'lib/hrmangoTheme'
import {Global} from 'components/organism/shell'
import bgLogin from '../../../images/bgLogin.png'
import LogoIcon from 'lib/atom/icons/logoIcon/logoIcon'
import {useHistory} from 'react-router'
import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {createCompanyAccountService} from 'api/companyApi'
import {setToast, setSpinner} from 'store/action/globalActions'
import {ErrorMessages} from 'type/errorMessage'
import {Link} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  label: {
    ...theme.typography.overline,
    color: hrmangoColors.onSurfaceLight.mediumEmphasis,
    marginBottom: spacing[0],

    textTransform: 'uppercase'
  },
  textField: {
    width: '80%',
    marginBottom: spacing[32],
    '& .MuiFilledInput-input': {
      padding: '16px 13px',
      height: spacing[48],
      cornerRadius: '8px'
    }
  },
  button: {
    backgroundColor: hrmangoColors.dark,
    color: hrmangoColors.white
  },
  imageContainer: {
    height: '100%',
    width: '100%',
    //borderWidth: 5,
    borderTopRightRadius: '32px',
    borderBottomRightRadius: '32px',
    backfaceVisibility: 'hidden',
    objectFit: 'contain',
    background: `url(${bgLogin}) no-repeat center`,
    backgroundSize: 'cover'
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  logoText: {
    paddingLeft: spacing[8],
    fontFamily: 'OpenSans-Bold, Open Sans',
    color: hrmangoColors.dark,
    fontWeight: fontWeight400,
    fontSize: 18,
    lineHeight: 1.428,
    letterSpacing: '0.25px'
  },
  logoSubText: {
    display: 'flex',
    justifyContent: 'end',
    fontSize: 10
  },
  forgotPasswordTitle: {
    color: '4d4d4d',
    fontSize: 28,
    fontFamily: 'OpenSans-Bold, Open Sans'
  }
}))

export const CreateCompanyAccount = ({match}) => {
  const history = useHistory()

  const classes = useStyles()
  const dispatch = useDispatch()

  const [inputValue, setInputValue] = useState({
    companyName: '',
    Address: '',
    phoneNumber: '',
    websiteUrl: '',
    email: ''
  })

  const [isError, setIsError] = useState({
    companyName: false,
    Address: false,
    phoneNumber: false,
    email: false,
    websiteUrl: false
  })
  const [errorText, setErrorText] = useState({
    companyNameError: 'Please enter the Company name',
    AddressError: 'Please enter your Address',
    phoneNumberError: 'Please enter a phone number',
    emailError: 'Please enter the email',
    websiteUrlError: 'Please enter your Website'
  })

  const createCompany = useMutation(
    () =>
      createCompanyAccountService({
        companyName: inputValue.companyName,
        addressLine: inputValue.Address,
        phoneNumber: inputValue.phoneNumber,
        webSite: inputValue.websiteUrl,
        email: inputValue.email
      }),
    {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error: ErrorMessages) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Error with creating the company`,
            type: 'error'
          })
        )
        let companyNameError = {text: '', error: false}
        let AddressError = {text: '', error: false}
        let phoneNumberError = {text: '', error: false}
        let emailError = {text: '', error: false}
        let websiteUrlError = {text: '', error: false}

        error.fieldMessages.forEach((fieldMessage) => {
          if (fieldMessage.fieldId === 'companyName') {
            companyNameError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'Address') {
            AddressError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'PhoneNumber') {
            phoneNumberError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'Email') {
            emailError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'websiteUrl') {
            websiteUrlError = {text: fieldMessage.message, error: true}
          }
        })
        setErrorText({
          companyNameError: companyNameError.text,
          AddressError: AddressError.text,
          phoneNumberError: phoneNumberError.text,
          emailError: emailError.text,
          websiteUrlError: websiteUrlError.text
        })
        setIsError({
          companyName: companyNameError.error,
          Address: AddressError.error,
          phoneNumber: phoneNumberError.error,
          email: emailError.error,
          websiteUrl: websiteUrlError.error
        })
      },
      onSuccess: () => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Company has been Created`,
            type: 'success'
          })
        )
        history.push('/creationSuccess')
      },
      retry: 0
    }
  )

  return (
    <>
      <Global />
      <Grid container justifyContent='center' alignItems='center'>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} className={classes.imageContainer} />
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <Box
            component='main'
            sx={{
              alignContent: 'center'
            }}
          >
            <Container>
              <Box sx={{py: '8px', justifyContent: 'center', display: 'flex', marginRight: 120}}>
                <LogoIcon width='50.794' height='32' viewBox='0 0 50 32' />
                <Box className={classes.logoText}>
                  <span>GateKeeper</span>
                  <Box className={classes.logoSubText}>
                    <span>by HRMango</span>
                  </Box>
                </Box>
              </Box>
              <Box sx={{justifyContent: 'center', display: 'flex', marginRight: 100}}>
                <Box
                  className={classes.logoText}
                  style={{
                    marginLeft: 30,
                    flex: 1,
                    flexDirection: 'row',
                    textAlign: 'center',
                    marginRight: 40,
                    fontFamily: 'OpenSans-Bold, Open Sans'
                  }}
                >
                  <h4 className={classes.forgotPasswordTitle}>Create a Company Account</h4>
                  <span>
                    Need to create an applicant account? <Link to='/createNewAccount'>Go back</Link>
                  </span>
                </Box>
              </Box>
              <Box sx={{justifyContent: 'center', display: 'flex', marginRight: 100}}>
                <Box
                  className={classes.logoText}
                  style={{
                    marginLeft: 65,
                    flex: 1,
                    flexDirection: 'row',
                    textAlign: 'center',
                    marginRight: 10,
                    fontFamily: 'OpenSans-Bold, Open Sans'
                  }}
                ></Box>
              </Box>
              <Box sx={{marginLeft: 80, alignItems: 'center', marginRight: 80}}>
                <TextField
                  required
                  className={classes.textField}
                  id='company-name-required'
                  fullWidth
                  label='Company Name *'
                  margin='normal'
                  type='text'
                  variant='outlined'
                  value={inputValue.companyName}
                  error={isError.companyName}
                  helperText={isError.companyName ? errorText.companyNameError : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInputValue({...inputValue, companyName: e.target.value})
                    setIsError({...isError, companyName: false})
                  }}
                />
                <TextField
                  required
                  className={classes.textField}
                  id='address-required'
                  fullWidth
                  label='Address *'
                  margin='normal'
                  type='text'
                  variant='outlined'
                  value={inputValue.Address}
                  error={isError.Address}
                  helperText={isError.Address ? errorText.AddressError : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInputValue({...inputValue, Address: e.target.value})
                    setIsError({...isError, Address: false})
                  }}
                />
                <TextField
                  required
                  className={classes.textField}
                  id='phone-number-required'
                  fullWidth
                  label='Phone Number *'
                  margin='normal'
                  type='text'
                  variant='outlined'
                  value={inputValue.phoneNumber}
                  error={isError.phoneNumber}
                  helperText={isError.Address ? errorText.phoneNumberError : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInputValue({...inputValue, phoneNumber: e.target.value})
                    setIsError({...isError, phoneNumber: false})
                  }}
                />
                <TextField
                  required
                  className={classes.textField}
                  id='Website-Url-Optional'
                  fullWidth
                  label='Website URL *'
                  margin='normal'
                  type='text'
                  variant='outlined'
                  value={inputValue.websiteUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInputValue({...inputValue, websiteUrl: e.target.value})
                  }}
                />
                <TextField
                  required
                  className={classes.textField}
                  id='Email-required'
                  fullWidth
                  label='Email'
                  margin='normal'
                  type='text'
                  variant='outlined'
                  value={inputValue.email}
                  error={isError.email}
                  helperText={isError.email ? errorText.emailError : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInputValue({...inputValue, email: e.target.value})
                    setIsError({...isError, email: false})
                  }}
                />
                <Box sx={{py: 2, alignItems: 'center', marginRight: 85}}>
                  <Button
                    className={classes.button}
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                    onClick={() => createCompany.mutate()}
                  >
                    Send Request
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default CreateCompanyAccount
