import {useState} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {makeStyles, Box, Container, Grid, Button, TextField} from '@material-ui/core'
import {useHistory} from 'react-router'
import {setToast, setSpinner} from 'store/action/globalActions'
import {createAplicantAccountService} from 'api/authApi'
import {spacing, hrmangoColors, fontWeight400} from 'lib/hrmangoTheme'
import {Global} from 'components/organism/shell'
import bgLogin from '../../../images/bgLogin.png'
import LogoIcon from 'lib/atom/icons/logoIcon/logoIcon'

const useStyles = makeStyles((theme) => ({
  label: {
    ...theme.typography.overline,
    color: hrmangoColors.onSurfaceLight.mediumEmphasis,
    marginBottom: spacing[0],

    textTransform: 'uppercase'
  },
  textField: {
    width: '100%',
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
    fontSize: 28
  }
}))

export const CreateAplicantAccount = ({match}) => {
  const roles = ['3']
  const history = useHistory()

  const classes = useStyles()
  const dispatch = useDispatch()

  const [inputValue, setInputValue] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isError, setIsError] = useState({
    newPassword: false,
    email: false,
    confirmPassword: false
  })
  const [errorText, setErrorText] = useState({
    emailError: 'Please enter a email',
    newPasswordError: 'Please enter the new password',
    confirmPasswordError: 'Please enter the confirmed password'
  })

  const createAplicant = useMutation(
    () =>
      createAplicantAccountService({
        email: inputValue.email,
        roles: roles,
        newPassword: inputValue.newPassword,
        confirmPassword: inputValue.confirmPassword
      }),
    {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error: any) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: error.Message[0],
            type: 'error'
          })
        )
        const emailError = {text: '', error: false}
        let newPasswordError = {text: '', error: false}
        let confirmPasswordError = {text: '', error: false}

        error.fieldMessages.forEach((fieldMessage) => {
          if (fieldMessage.fieldId === 'newPassword') {
            newPasswordError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'confirmPassword') {
            confirmPasswordError = {text: fieldMessage.message, error: true}
          }
        })
        setErrorText({
          emailError: emailError.text,
          newPasswordError: newPasswordError.text,
          confirmPasswordError: confirmPasswordError.text
        })
        setIsError({
          email: emailError.error,
          newPassword: newPasswordError.error,
          confirmPassword: confirmPasswordError.error
        })
      },
      onSuccess: () => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Applicant Account Created`,
            type: 'success'
          })
        )
        history.push('/applicantCreationSuccess')
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
              <Box sx={{py: '8px', justifyContent: 'center', display: 'flex'}}>
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
                    marginLeft: 65,
                    flex: 1,
                    flexDirection: 'row',
                    textAlign: 'center',
                    marginRight: 10,
                    fontFamily: 'OpenSans-Bold, Open Sans'
                  }}
                >
                  <h4 className={classes.forgotPasswordTitle}>Create an Applicant Account</h4>
                  <span>
                    Need to create company account? <Link to='/createNewAccount'>Go back</Link>
                  </span>
                </Box>
              </Box>
              <Box sx={{marginLeft: 80, alignItems: 'center', marginRight: 80}}>
                <TextField
                  required
                  className={classes.textField}
                  id='email-required'
                  fullWidth
                  label='Email'
                  margin='normal'
                  type='email'
                  variant='outlined'
                  value={inputValue.email}
                  error={isError.email}
                  helperText={isError.email ? errorText.emailError : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInputValue({...inputValue, email: e.target.value})
                    setIsError({...isError, email: false})
                  }}
                />
                <TextField
                  required
                  className={classes.textField}
                  id='new-password-required'
                  fullWidth
                  label='New Password'
                  margin='normal'
                  type='password'
                  variant='outlined'
                  value={inputValue.newPassword}
                  error={isError.newPassword}
                  helperText={isError.newPassword ? errorText.newPasswordError : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInputValue({...inputValue, newPassword: e.target.value})
                    setIsError({...isError, newPassword: false})
                  }}
                />
                <TextField
                  required
                  className={classes.textField}
                  id='confirm-password-required'
                  fullWidth
                  label='Password Confirmation'
                  margin='normal'
                  type='password'
                  variant='outlined'
                  value={inputValue.confirmPassword}
                  error={isError.confirmPassword}
                  helperText={isError.confirmPassword ? errorText.confirmPasswordError : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInputValue({...inputValue, confirmPassword: e.target.value})
                    setIsError({...isError, confirmPassword: false})
                  }}
                />
                <Box sx={{py: 2}}>
                  <Button
                    className={classes.button}
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                    onClick={() => createAplicant.mutate()}
                  >
                    Create Account
                  </Button>
                </Box>
                Have an account already?{' '}
                <Link to='/login'>
                  <span>Log In</span>
                </Link>
              </Box>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default CreateAplicantAccount
