import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {
  makeStyles,
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox
} from '@material-ui/core'
//import {User} from 'type/user/user'
import {setToast, setSpinner} from 'store/action/globalActions'
import {createUser} from 'api/authApi'
import {spacing, hrmangoColors} from 'lib/hrmangoTheme'
import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'

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

const NewUserPage = () => {
  const classes = useStyles()
  //const [loaded, setLoaded] = useState(false)
  const dispatch = useDispatch()

  const [inputValue, setInputValue] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roles: {
      hiringManager: true,
      role: 'level1'
    }
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

  const newUser = useMutation(
    () =>
      createUser({
        firstName: inputValue.firstName,
        lastName: inputValue.lastName,
        email: inputValue.email,
        roles:
          inputValue.roles.role === 'administrator'
            ? inputValue.roles.hiringManager
              ? ['1', '5']
              : ['1']
            : inputValue.roles.role === 'level1'
            ? inputValue.roles.hiringManager
              ? ['6', '5']
              : ['6']
            : inputValue.roles.role === 'level2'
            ? inputValue.roles.hiringManager
              ? ['7', '5']
              : ['7']
            : []
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
            message: `User successfully created and notified`,
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
              New User
            </Typography>
            <Typography color='textSecondary' variant='body2'>
              User information
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
            required
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
          <FormControl component='div' fullWidth style={{paddingTop: `${spacing[16]}px`}}>
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{tabIndex: -1}}
                  checked={inputValue.roles.hiringManager}
                  onChange={(e: any) => {
                    setInputValue({...inputValue, roles: {...inputValue.roles, hiringManager: e.target.checked}})
                  }}
                  name='hiringManagement'
                />
              }
              label='Display as Hiring Manager'
            />
          </FormControl>
          <FormControl component='div' fullWidth style={{paddingTop: `${spacing[16]}px`}}>
            <FormLabel component='legend'>Roles</FormLabel>
            <RadioGroup
              row
              value={inputValue.roles.role}
              onChange={(e: any) => {
                setInputValue({...inputValue, roles: {...inputValue.roles, role: e.target.value}})
              }}
            >
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <FormControlLabel
                  value='administrator'
                  control={<Radio inputProps={{tabIndex: -1}} name='administrator' />}
                  label='Administrator'
                />
              )}
              <FormControlLabel
                value='level1'
                control={<Radio inputProps={{tabIndex: -1}} name='level1' />}
                label='Level 1'
              />
              <FormControlLabel
                value='level2'
                control={<Radio inputProps={{tabIndex: -1}} name='level2' />}
                label='Level 2'
              />
            </RadioGroup>
          </FormControl>
          <Box sx={{py: 6}}>
            <Button
              color='primary'
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              onClick={() => {
                setIsError({
                  ...isError,
                  firstName: !inputValue.firstName?.replace(/\s+/g, '').length,
                  lastName: !inputValue.lastName?.replace(/\s+/g, '').length,
                  email: !inputValue.email?.replace(/\s+/g, '').length
                })
                if (
                  inputValue.firstName?.replace(/\s+/g, '').length &&
                  inputValue.lastName?.replace(/\s+/g, '').length &&
                  inputValue.email?.replace(/\s+/g, '').length
                ) {
                  newUser.mutate()
                }
              }}
            >
              Create User
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export {NewUserPage}
