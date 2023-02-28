import {useState} from 'react'
import {useMutation} from 'react-query'
import {Link} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {makeStyles, Box, Container, Button, TextField, Grid} from '@material-ui/core'
import {getLogin} from 'api/authApi'
import {setToast, setSpinner} from 'store/action/globalActions'
import LogoIcon from 'lib/atom/icons/logoIcon/logoIcon'
import bgLogin from '../../../images/beach.gif'
import hrMangoLogo from '../../../images/logoHR.png'
import {spacing, hrmangoColors, fontWeight400} from 'lib/hrmangoTheme'
import {ErrorMessages} from 'type/errorMessage'
import {Global} from 'components/organism/shell'

import {getToken} from 'lib/authentication/authentication'
import {ModalRoleEnums} from 'type/user/roles'
import {isAllowed} from 'utility'
import {loadUserFromJwt} from 'store/action/contextActions'
import {HOME_URL} from 'lib/constants/urls'

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
  hrMangoLogo: {
    zIndex: 9,
    padding: '0',
    marginLeft: '-36%',
    position: 'absolute',
    borderRadius: '0%'
  }
}))

const LoginPage = () => {
  caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))))
  const classes = useStyles()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const dispatch = useDispatch()
  const [isError, setIsError] = useState({
    userName: false,
    password: false
  })
  const [errorText, setErrorText] = useState({
    userNameError: 'Please enter a valid email',
    passwordError: 'Please enter the password'
  })

  const login = useMutation(() => getLogin(username, password), {
    onMutate: () => {
      dispatch(setSpinner(true))
    },
    onSuccess: () => {
      dispatch(setSpinner(false))
      const usersAction = loadUserFromJwt(getToken()) as ReturnType<typeof loadUserFromJwt>
      isAllowed(usersAction?.payload.roles, [ModalRoleEnums.Applicant])
      window.location.assign(`/${HOME_URL}`)
    },
    onError: (error?: ErrorMessages) => {
      const cacheError = error?.message

      if (cacheError === 'Invalid token specified') {
        if ('caches' in window) {
          // window.location.reload()
        }
      } else {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Invalid authentication, please insert a valid email address and password`,
            type: 'error'
          })
        )
        let userNameError = {text: '', error: false}
        let passwordError = {text: '', error: false}

        error?.fieldMessages.forEach((fieldMessage) => {
          if (fieldMessage.fieldId === 'userName') {
            userNameError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'password') {
            passwordError = {text: fieldMessage.message, error: true}
          }
        })

        setErrorText({
          userNameError: userNameError.text,
          passwordError: passwordError.text
        })
        setIsError({
          userName: userNameError.error,
          password: passwordError.error
        })
      }
    },
    retry: 0
  })

  return (
    <>
      <Global />

      <Grid container justifyContent='center' alignItems='center'>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} className={classes.imageContainer} />
        <div className={classes.hrMangoLogo} />
        <img src={hrMangoLogo} className={classes.hrMangoLogo} width='380px' />
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <Box
            component='main'
            sx={{
              alignContent: 'center'
            }}
          >
            <Container>
              <Box sx={{py: '48px', justifyContent: 'center', display: 'flex'}}>
                <LogoIcon width='50.794' height='32' viewBox='0 0 50 32' />
                <Box className={classes.logoText}>
                  <span>GateKeeper</span>
                  <Box className={classes.logoSubText}>
                    <span>by HRMango</span>
                  </Box>
                </Box>
              </Box>
              <Box>
                <TextField
                  required
                  className={classes.textField}
                  id='email-required'
                  label='Email Address'
                  margin='normal'
                  type='email'
                  variant='outlined'
                  value={username}
                  error={isError.userName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value)
                  }}
                  helperText={isError.userName ? errorText.userNameError : ''}
                />
                <TextField
                  required
                  className={classes.textField}
                  id='password-required'
                  fullWidth
                  label='Password'
                  margin='normal'
                  type='password'
                  variant='outlined'
                  value={password}
                  error={isError.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value)
                  }}
                  helperText={isError.password ? errorText.passwordError : ''}
                />
              </Box>
              <Link to='/forgotPassword'>Forgot your password?</Link>

              <Box sx={{py: '48px'}}>
                <Button
                  className={classes.button}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  onClick={() => {
                    setIsError({
                      userName: !username.replace(/\s+/g, '').length,
                      password: !password.replace(/\s+/g, '').length
                    })
                    if (username.replace(/\s+/g, '').length && password.replace(/\s+/g, '').length) {
                      login.mutate()
                    }
                  }}
                >
                  Log me in
                </Button>
                <Box>
                  <br></br>
                  Don't have an account? <Link to='/createNewAccount'>Register</Link>
                </Box>
              </Box>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
export {LoginPage}
