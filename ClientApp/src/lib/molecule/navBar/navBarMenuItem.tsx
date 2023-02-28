/*
  @author  Oliver Zamora
  @description menu item component for horizontal nav bar
*/
import {Tab /* Menu, MenuItem*/} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {/*spacing, */ hrmangoColors} from '../../hrmangoTheme'
import {Role, FeatureRole} from '../../type/security'
import {Home /*, Business, Work, People, InsertChart*/} from '@material-ui/icons'
//import {getHRMangoUrl} from '../../utility'

type SubMenuItemType = {
  subMenuItem: string
  id: string
  url: string
  roles?: Role[]
  requiredFeatureRole?: FeatureRole
  isFeatureAllowed?: boolean
  hasFeatureRoleAccess?: boolean
}

type MenuItemType = {
  menuId: string
  menuItem: string
  menuUrl: string
  menuIcon: string
  subMenuItems?: SubMenuItemType[]
  /*setAnchorEl: (value: any) => void
  anchorEl: any
  index: number*/
  onClick?: any
}

const NavBarMenuItem = ({
  menuId,
  menuItem,
  menuUrl,
  menuIcon,
  subMenuItems,
  /*anchorEl,
  setAnchorEl,
  index,*/
  onClick
}: MenuItemType) => {
  const useStyles = makeStyles(({shadows, typography}) => ({
    menu: {
      boxShadow: shadows[3]
      //marginTop: spacing[48]
    },
    menuItem: {
      '&:focus': {
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          flexGrow: 1,
          color: hrmangoColors.lightGray
        }
      }
    }
  }))
  const classes = useStyles()

  /*const handleClose = (event: MouseEvent<EventTarget>) => {
    setAnchorEl(null)
  }*/

  return (
    <Tab
      label={menuItem}
      icon={<Home />}
      className={classes.menu}
      onClick={() => {
        onClick(`/${menuUrl}`)
      }}
    />

    /*<Menu
      key={`subMenu-${menuItem}-${menuId}`}
      id={`subMenu-${menuItem}-${menuId}`}
      anchorEl={anchorEl && anchorEl[index]}
      open={Boolean(anchorEl && anchorEl[index])}
      className={classes.menu}
      onClose={handleClose}
      aria-labelledby={`menu-tab-${menuItem}-${menuId}`}    
    >
      {subMenuItems?.map((item) => {
        return (
          <MenuItem
            key={item.id}
            className={classes.menuItem}
            onClick={() => {
              setAnchorEl(null)
              onClick(`/${item.url}`)
            }}
          >
            {item.subMenuItem}
          </MenuItem>
        )
      })}
    </Menu>*/
  )
}

export default NavBarMenuItem
