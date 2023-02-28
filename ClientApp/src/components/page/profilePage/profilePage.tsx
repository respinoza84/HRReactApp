import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {makeStyles, Box, Container, Typography, Button, TextField} from '@material-ui/core'
import {User} from 'type/user/user'
import {ErrorMessages} from 'type/errorMessage'
import {setToast, setSpinner} from 'store/action/globalActions'
import {getProfileInfo, putResetPassword} from 'api/authApi'
import {spacing, hrmangoColors} from 'lib/hrmangoTheme'

const useStyles = makeStyles((theme) => ({
  label: {
    ...theme.typography.overline,
    color: hrmangoColors.onSurfaceLight.mediumEmphasis,
    marginBottom: spacing[0],
    textTransform: 'uppercase'
  },
  textField: {
    width: '100%',
    marginBottom: spacing[12],
    '& .MuiFilledInput-input': {
      paddingTop: spacing[4],
      paddingBottom: spacing[8],
      cornerRadius: 20
    }
  }
}))

const ProfilePage = () => {
  const classes = useStyles()
  //const [loaded, setLoaded] = useState(false)
  const dispatch = useDispatch()

  const [inputValue, setInputValue] = useState({
    firstName: '',
    lastName: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isError, setIsError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  })
  const [errorText, setErrorText] = useState({
    firstNameError: 'Please enter a first name',
    lastNameError: 'Please enter a last name',
    emailError: 'Please enter a email',
    oldPasswordError: 'Please enter the old password',
    newPasswordError: 'Please enter the new password',
    confirmPasswordError: 'Please enter the confirmed password'
  })

  useEffect(() => {
    getProfileInfo()
      //.then((res: any) => res.json())
      .then((response: User) => {
        setInputValue({
          ...inputValue,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email
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

  const resetPassword = useMutation(
    () =>
      putResetPassword({
        firstName: inputValue.firstName,
        lastName: inputValue.lastName,
        email: inputValue.email,
        oldPassword: inputValue.oldPassword,
        newPassword: inputValue.newPassword,
        confirmPassword: inputValue.confirmPassword
      }),
    {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error: ErrorMessages) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Error updating the profile`,
            type: 'error'
          })
        )
        let firstNameError = {text: '', error: false}
        let lastNameError = {text: '', error: false}
        let emailError = {text: '', error: false}
        let oldPasswordError = {text: '', error: false}
        let newPasswordError = {text: '', error: false}
        let confirmPasswordError = {text: '', error: false}

        error.fieldMessages.forEach((fieldMessage) => {
          if (fieldMessage.fieldId === 'firstName') {
            firstNameError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'lastName') {
            lastNameError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'email') {
            emailError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'oldPassword') {
            oldPasswordError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'newPassword') {
            newPasswordError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'confirmPassword') {
            confirmPasswordError = {text: fieldMessage.message, error: true}
          }
        })
        setErrorText({
          firstNameError: firstNameError.text,
          lastNameError: lastNameError.text,
          emailError: emailError.text,
          oldPasswordError: oldPasswordError.text,
          newPasswordError: newPasswordError.text,
          confirmPasswordError: confirmPasswordError.text
        })
        setIsError({
          firstName: firstNameError.error,
          lastName: lastNameError.error,
          email: emailError.error,
          oldPassword: oldPasswordError.error,
          newPassword: newPasswordError.error,
          confirmPassword: confirmPasswordError.error
        })
      },
      onSuccess: () => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Profile successfully changed`,
            type: 'success'
          })
        )
      },
      retry: 0
    }
  )

  return (
    <>
      <Box
        component='main'
        sx={{
          alignItems: 'center',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth='sm'>
          <Box sx={{my: 3}}>
            <Typography color='textPrimary' variant='h5'>
              Profile
            </Typography>
            <Typography color='textSecondary' variant='body2'>
              Current user information
            </Typography>
          </Box>
          <TextField
            required
            className={classes.textField}
            id='firstName-required'
            fullWidth
            label='First Name'
            margin='normal'
            variant='outlined'
            value={inputValue.firstName}
            error={isError.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInputValue({...inputValue, firstName: e.target.value})
              setIsError({...isError, firstName: false})
            }}
            helperText={isError.firstName ? errorText.firstNameError : ''}
          />
          <TextField
            className={classes.textField}
            id='lastName-required'
            fullWidth
            label='Last Name'
            margin='normal'
            variant='outlined'
            value={inputValue.lastName}
            error={isError.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInputValue({...inputValue, lastName: e.target.value})
              setIsError({...isError, lastName: false})
            }}
            helperText={isError.lastName ? errorText.lastNameError : ''}
          />
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
            id='old-password-required'
            fullWidth
            label='Old Password'
            margin='normal'
            type='password'
            variant='outlined'
            value={inputValue.oldPassword}
            error={isError.oldPassword}
            helperText={isError.oldPassword ? errorText.oldPasswordError : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInputValue({...inputValue, oldPassword: e.target.value})
              setIsError({...isError, oldPassword: false})
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
              color='primary'
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              onClick={() => resetPassword.mutate()}
            >
              Change password
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export {ProfilePage}
