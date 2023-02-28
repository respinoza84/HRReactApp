/*
  @author  Oliver Zamora
  @description Search Bar component
*/

import {useState} from 'react'

import {IconButton, makeStyles, Divider, Menu, MenuItem, ListItemIcon, Tooltip} from '@material-ui/core'

import {Add, Business, People, Work} from '@material-ui/icons'
import {withRouter, RouteComponentProps} from 'react-router'
import {spacing, hrmangoColors} from '../../hrmangoTheme'

type AddBarType = {
  setToast?: any
}

export const AddBar = withRouter(({history, setToast}: RouteComponentProps & AddBarType) => {
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
    addIcon: {
      color: hrmangoColors.white
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div className={classes.userIcon}>
      <Tooltip title='Add'>
        <IconButton
          onClick={handleClick}
          //size='small'
          aria-controls={open ? 'add-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Add fontSize='small' className={classes.addIcon} />
        </IconButton>
      </Tooltip>
      <div key='menuAdd'>
        <Menu
          elevation={0}
          anchorEl={anchorEl}
          id='add-menu'
          key='add-menu'
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
              history.push('/platform/companyDetail', {
                title: 'New Company' as any,
                color: '#5BC24C' as any
              })
            }}
          >
            <ListItemIcon>
              <Business htmlColor='#5BC24C' fontSize='small' />
            </ListItemIcon>
            Add Company
          </MenuItem>
          <Divider />
          <MenuItem
            className={classes.menuItem}
            onClick={() => {
              history.push('/platform/candidateDetail', {
                title: 'New Candidate' as any,
                color: '#F5B025' as any
              })
            }}
          >
            <ListItemIcon>
              <People htmlColor='#F5B025' fontSize='small' />
            </ListItemIcon>
            Add Candidate
          </MenuItem>
          <Divider />
          <MenuItem
            className={classes.menuItem}
            onClick={() => {
              history.push('/platform/jobDetail', {
                title: 'New Job' as any,
                color: '#0091D0' as any
              })
            }}
          >
            <ListItemIcon>
              <Work htmlColor='#0091D0' fontSize='small' />
            </ListItemIcon>
            Add Job
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
})
