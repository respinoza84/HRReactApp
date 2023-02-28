/*
  @author Oliver Zamora
  @description the userModal component.
*/
import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'

import {
  makeStyles,
  Container,
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Checkbox,
  FormLabel,
  Radio,
  Button
} from '@material-ui/core'
import {setToast, setSpinner} from 'store/action/globalActions'

import {spacing, typography} from 'lib/hrmangoTheme'
import HRModal from '../../page/shared/modal'
import {updateUser, createUser} from 'api/authApi'
import {User} from 'graphql/types.generated'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'
import {isAllowed} from 'utility'

type userModalType = {
  open: boolean
  user?: User
  setUser?: any
  onClose: () => void
  refetch: () => void
}

const UserModal = ({onClose, user, setUser, refetch, open}: userModalType) => {
  const useStyles = makeStyles(({hrmangoColors}) => ({
    content: {
      borderBottom: `1px solid ${hrmangoColors.lightGray}`,
      borderTop: `1px solid ${hrmangoColors.lightGray}`,
      //...hrmangoTypography.button,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      padding: `${spacing[12]}px ${spacing[24]}px ${spacing[48]}px`,
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      }
    },
    button: {
      ...typography.buttonGreen,
      //textTransform: 'capitalize'
      //...typography.button
      padding: `${spacing[10]}px ${spacing[16]}px`,
      margin: spacing[12]
    },
    buttonDense: {
      ...typography.buttonDense,
      textTransform: 'capitalize',
      padding: `${spacing[10]}px ${spacing[16]}px`,
      margin: spacing[12]
    },
    submitButton: {
      color: hrmangoColors.onSurfaceDark.highEmphasis
    },
    buttonContent: {
      padding: `${spacing[8]}px ${spacing[16]}px`,
      display: 'flex',
      justifyContent: 'end'
    },
    textField: {
      '& .MuiFilledInput-input': {
        padding: '16px 13px'
      }
    }
  }))
  const classes = useStyles()

  const dispatch = useDispatch()

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

  const userCall = useMutation(
    (roleChanges?: string[]) =>
      user?.passwordReset !== undefined
        ? updateUser({
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            email: user?.email ?? '',
            roles: roleChanges ?? [],
            passwordReset: user?.passwordReset,
            isAccountClosed: user?.isAccountClosed
          })
        : createUser({
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            email: user?.email ?? '',
            roles: roleChanges ?? []
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
            message:
              user?.passwordReset !== undefined
                ? `User successfully modified`
                : `User successfully created and notified`,
            type: 'success'
          })
        )
        refetch()
        onClose()
      },
      retry: 0
    }
  )

  return (
    <HRModal header='User Information' open={open} onClose={onClose}>
      <div className={classes.content}>
        <Container maxWidth='sm'>
          <TextField
            required
            className={classes.textField}
            id='firstName-required'
            fullWidth
            label='First Name'
            margin='normal'
            variant='outlined'
            value={user?.firstName}
            error={isError.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUser({...user, firstName: e.target.value})
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
            value={user?.lastName}
            error={isError.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUser({...user, lastName: e.target.value})
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
            value={user?.email}
            error={isError.email}
            helperText={isError.email ? errorText.emailError : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUser({...user, email: e.target.value})
              setIsError({...isError, email: false})
            }}
          />
          <FormControl component='div' fullWidth style={{paddingTop: `${spacing[16]}px`}}>
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{tabIndex: -1}}
                  checked={user?.roles?.find((x) => x.toString() === ModalRoleEnums.HiringManager) ? true : false}
                  onChange={(e: any) => {
                    const rolesChange =
                      [user?.roles?.find((x) => x.toString() !== ModalRoleEnums.HiringManager)?.toString()] ?? []
                    if (e.target.checked) rolesChange.push(ModalRoleEnums.HiringManager)
                    setUser({...user, roles: rolesChange})
                  }}
                  name='hiringManagement'
                />
              }
              label='Display as Hiring Manager'
            />
          </FormControl>
          {user?.passwordReset !== undefined && (
            <>
              <FormControl component='div' fullWidth style={{paddingTop: `${spacing[16]}px`}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      inputProps={{tabIndex: -1}}
                      checked={user?.passwordReset}
                      onChange={(e: any) => {
                        setUser({...user, passwordReset: e.target.checked})
                      }}
                      name='passwordReset'
                    />
                  }
                  label='Reset the password'
                />
              </FormControl>
              <FormControl component='div' fullWidth style={{paddingTop: `${spacing[16]}px`}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      inputProps={{tabIndex: -1}}
                      checked={user?.isAccountClosed}
                      onChange={(e: any) => {
                        setUser({...user, isAccountClosed: e.target.checked})
                      }}
                      name='isAccountClosed'
                    />
                  }
                  label='Is the Account Closed?'
                />
              </FormControl>
            </>
          )}
          <FormControl component='div' fullWidth style={{paddingTop: `${spacing[16]}px`}}>
            <FormLabel component='legend'>Roles</FormLabel>
            <RadioGroup
              row
              value={user?.roles?.find((x) => x.toString() !== ModalRoleEnums.HiringManager)?.toString()}
              onChange={(e: any) => {
                const hmRole = user?.roles?.find((x) => x.toString() === ModalRoleEnums.HiringManager)?.toString()
                const rolesChange = hmRole !== undefined ? [hmRole] : []
                rolesChange.push(e.target.value)
                setUser({...user, roles: rolesChange})
              }}
            >
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <FormControlLabel
                  value={ModalRoleEnums.Administrator}
                  control={<Radio inputProps={{tabIndex: -1}} name='administrator' />}
                  label='Administrator'
                />
              )}
              <FormControlLabel
                value={ModalRoleEnums.Level1}
                control={<Radio inputProps={{tabIndex: -1}} name='level1' />}
                label='Level 1'
              />
              <FormControlLabel
                value={ModalRoleEnums.Level2}
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
                  firstName: !user?.firstName?.replace(/\s+/g, '').length,
                  lastName: !user?.lastName?.replace(/\s+/g, '').length,
                  email: !user?.email?.replace(/\s+/g, '').length
                })
                if (
                  user?.firstName?.replace(/\s+/g, '').length &&
                  user?.lastName?.replace(/\s+/g, '').length &&
                  user?.email?.replace(/\s+/g, '').length
                ) {
                  userCall.mutate(user?.roles?.map((x) => x.toString()))
                }
              }}
            >
              {user?.passwordReset !== undefined ? 'Update ' : 'Create '}
              User
            </Button>
          </Box>
        </Container>
      </div>
    </HRModal>
  )
}

export default UserModal
