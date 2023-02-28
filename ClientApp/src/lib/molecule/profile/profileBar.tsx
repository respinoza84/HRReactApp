/*
  @author  Oliver Zamora
  @description Search Bar component
*/

import {useState} from 'react'

import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {makeStyles, IconButton, Box, Divider, Menu, MenuItem, Paper, ListItemIcon, Tooltip} from '@material-ui/core'

import {ExitToApp, AccountCircle} from '@material-ui/icons'

import {withRouter, RouteComponentProps} from 'react-router'

import {spacing, hrmangoColors} from '../../hrmangoTheme'
import {loginRedirect, removeToken} from 'lib/authentication/authentication'
import {setSpinner} from 'store/action/globalActions'
import {logout} from 'api/authApi'

import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'

type ProfileBarType = {
  userName?: string
  setToast?: any
}

export const ProfileBar = withRouter(({history, setToast, userName}: RouteComponentProps & ProfileBarType) => {
  const useStyles = makeStyles(({palette, typography, breakpoints, zIndex, shadows}: any) => ({
    userIcon: {
      color: hrmangoColors.white,
      '& .MuiIconButton-root': {
        padding: spacing[0]
      },
      '& p': {
        ...typography.caption,
        color: palette.common.white,
        marginLeft: spacing[12],
        marginRight: spacing[24],
        marginBottom: spacing[0],
        marginTop: spacing[0]
      }
    },
    accountIcon: {
      color: hrmangoColors.grey,
      backgroundColor: hrmangoColors.white,
      padding: '7px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center'
    },
    menuIcon: {
      color: hrmangoColors.white,
      opacity: 0.87,
      marginTop: spacing[4]
    },
    menu: {
      boxShadow: shadows[3],
      marginTop: spacing[48]
    },
    menuItem: {
      '&:focus': {
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: hrmangoColors.lightGray
        }
      }
    }
  }))
  const classes = useStyles()

  const dispatch = useDispatch()
  const onLogout = useMutation(() => logout(), {
    onMutate: () => {
      dispatch(setSpinner(true))
    },
    onSuccess: () => {
      dispatch(setSpinner(false))
      return Promise.resolve(loginRedirect())
    },
    onError: () => {
      dispatch(setSpinner(false))
      dispatch(
        setToast({
          message: `Error`,
          type: 'error'
        })
      )
    },
    retry: 0
  })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box className={classes.userIcon}>
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleClick}
          //size='small'
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <AccountCircle fontSize='small' className={classes.accountIcon} />
          <p>{userName && userName}</p>
        </IconButton>
      </Tooltip>
      <Paper key='menuAccount'>
        <Menu
          elevation={0}
          anchorEl={anchorEl}
          id='account-menu'
          key='account-menu'
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          classes={{paper: classes.menu}}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          <MenuItem
            className={classes.menuItem}
            onClick={() => {
              isAllowed(CurrentUserCache.roles, [ModalRoleEnums.Company])
                ? history.push('/platform/CompanyProfile')
                : history.push('/platform/profile')
            }}
          >
            <ListItemIcon>
              <AccountCircle fontSize='small' />
            </ListItemIcon>
            Profile
          </MenuItem>
          {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator, ModalRoleEnums.Level1]) && (
            <MenuItem
              className={classes.menuItem}
              onClick={() => {
                history.push('/platform/userManagement')
              }}
            >
              <ListItemIcon>
                <AccountCircle fontSize='small' />
              </ListItemIcon>
              User Management
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            className={classes.menuItem}
            onClick={() => {
              removeToken()
              onLogout.mutate()
            }}
          >
            <ListItemIcon>
              <ExitToApp fontSize='small' />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Paper>
    </Box>
  )
})
