/*
  @author  Oliver Zamora
  @description menu item component for side nav
*/
import {makeStyles, Button} from '@material-ui/core'

import {spacing, hrmangoColors} from '../../hrmangoTheme'
import {Feature, Role, FeatureRole} from '../../type/security'
import {getHRMangoUrl} from '../../utility'

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
  menuId: number
  menuItem: string
  subMenuItems: SubMenuItemType[]
  requiredFeature?: Feature
  showNav?: boolean
  onClick?: any
  location?: any
  isExternal?: boolean
}

const SideNavMenuItem = ({
  menuId,
  menuItem,
  subMenuItems,
  showNav,
  onClick,
  location,
  isExternal = false
}: MenuItemType) => {
  const useStyles = makeStyles((theme) => ({
    sideNavContainer: {
      width: '100%',
      '& ul': {
        margin: spacing[0]
      },
      '& ul:first-of-type': {
        borderTop: `1px solid ${hrmangoColors.outline}`
      }
    },
    menuItem: {
      ...theme.typography.overline,
      //fontWeight: showNav ? typography.fontWeightRegular : typography.fontWeightMedium,
      color: hrmangoColors.primary[900],
      paddingLeft: spacing[16],
      margin: `${spacing[8]}px 0px`,
      textTransform: 'uppercase'
    },
    buttonText: {
      display: 'inline',
      textAlign: 'left',
      color: hrmangoColors.onSurfaceLight.mediumEmphasis
    },
    subMenuItem: {
      ...(showNav ? theme.typography.subtitle1 : theme.typography.subtitle2),
      textTransform: 'none',
      width: '100%',
      paddingLeft: spacing[16],
      '&:hover': {
        backgroundColor: `${hrmangoColors.secondary[400]}08`
      },
      display: 'flex',
      justifyContent: 'space-between'
    },
    squareButton: {
      borderRadius: spacing[0]
    },
    menuItemContainer: {
      listStyle: 'none',
      padding: spacing[0],
      borderBottom: `1px solid ${hrmangoColors.outline}`,
      paddingBottom: spacing[8]
    },
    lockIcon: {
      fontSize: spacing[16],
      color: hrmangoColors.onSurfaceLight.disabled
    },
    activeNav: {
      ...(showNav ? theme.typography.subtitle1 : theme.typography.subtitle2),
      textTransform: 'none',
      width: '100%',
      paddingLeft: spacing[16],
      backgroundColor: `${hrmangoColors.secondary[400]}08`,
      borderLeft: `2px solid ${hrmangoColors.secondary[200]}`,
      '&:hover': {
        backgroundColor: `${hrmangoColors.secondary[400]}08`
      },
      display: 'flex',
      justifyContent: 'space-between'
    }
  }))
  const classes = useStyles()
  return (
    <ul key={`${menuId}-element`} className={classes.menuItemContainer}>
      <p key={`${menuId}-p`} className={classes.menuItem}>
        {menuItem}
      </p>
      {subMenuItems.map((item) => {
        const active = location ? !!location.pathname.match(`${item.url}($|/$|/[0-9]+$)`) : true
        return (
          <li
            key={`${item.id}-element`}
            style={{
              backgroundColor: hrmangoColors.darkBlueGray
            }}
          >
            <Button
              key={`${item.id}-button`}
              disableRipple
              disabled={isExternal}
              classes={{root: classes.squareButton, text: classes.buttonText}}
              className={active ? classes.activeNav : classes.subMenuItem}
              onClick={() => {
                isExternal && onClick(`/${item.url}`.replace('//', '/'))
              }}
              href={getHRMangoUrl(item.url)}
            >
              <div key={`${item.id}-display`} style={{display: 'flex'}}>
                <div key={`${item.id}-label`}>{item.subMenuItem}</div>
              </div>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export default SideNavMenuItem
