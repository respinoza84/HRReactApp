import {useState} from 'react'
import {useMutation} from 'react-query'
import {useDispatch} from 'react-redux'
import {forgotPasswordService} from 'api/authApi'
import {setToast, setSpinner} from 'store/action/globalActions'
import {ErrorMessages} from 'type/errorMessage'
import {Global} from 'components/organism/shell'
import LogoIcon from 'lib/atom/icons/logoIcon/logoIcon'
import bgLogin from '../../../images/bgLogin.png'
import {makeStyles, Box, Container, Button, TextField, Grid} from '@material-ui/core'
import {withRouter, RouteComponentProps, useHistory} from 'react-router'
import {spacing, hrmangoColors, fontWeight400} from 'lib/hrmangoTheme'

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

export const ForgotPassword = withRouter(({}: RouteComponentProps) => {
  const classes = useStyles()
  const history = useHistory()
  const [Email, setEmail] = useState<string>('')
  const dispatch = useDispatch()
  const [isError, setIsError] = useState({
    Email: false
  })
  const [errorText, setErrorText] = useState({
    EmailError: 'Please enter a valid email'
  })
  const login = useMutation(() => forgotPasswordService(Email), {
    onMutate: () => {
      dispatch(setSpinner(true))
    },
    onSuccess: () => {
      dispatch(setSpinner(false))
      history.push('/followEmailInstructions')
    },
    onError: (error?: ErrorMessages) => {
      dispatch(setSpinner(false))
      dispatch(
        setToast({
          message: `Please insert a valid email address`,
          type: 'error'
        })
      )
      let EmailError = {text: '', error: false}

      error?.fieldMessages.forEach((fieldMessage) => {
        if (fieldMessage.fieldId === 'Email') {
          EmailError = {text: fieldMessage.message, error: true}
        }
      })

      setErrorText({
        EmailError: EmailError.text
      })
      setIsError({
        Email: EmailError.error
      })
    },
    retry: 0
  })

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
                  <h4 className={classes.forgotPasswordTitle}>Forgot Password?</h4>
                  <span>No worries! It happens.</span>
                  <p>
                    Please enter your email below, and we'll send you an email with instructions so you can gain access
                    to your account.
                  </p>
                </Box>
              </Box>
              <Box sx={{marginLeft: 80, alignItems: 'center'}}>
                <TextField
                  required
                  className={classes.textField}
                  id='email-required'
                  label='Email Address'
                  margin='normal'
                  type='email'
                  variant='outlined'
                  value={Email}
                  error={isError.Email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value)
                  }}
                  helperText={isError.Email ? errorText.EmailError : ''}
                />
              </Box>
              <Box sx={{marginLeft: 80, alignItems: 'center', marginRight: 100}}>
                <Button
                  className={classes.button}
                  fullWidth
                  size='medium'
                  type='submit'
                  variant='contained'
                  onClick={() => {
                    setIsError({
                      Email: !Email.replace(/\s+/g, '').length
                    })
                    if (Email.replace(/\s+/g, '').length) {
                      login.mutate()
                    }
                  }}
                >
                  Send
                </Button>
              </Box>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </>
  )
})
export default ForgotPassword
