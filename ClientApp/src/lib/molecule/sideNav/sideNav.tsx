/*
  @author  Oliver Zamora
  @description Side Nav
*/

import {useEffect} from 'react'
//import {makeStyles} from '@material-ui/core'
import {withRouter, RouteComponentProps} from 'react-router'

//import {spacing, hrmangoColors} from '../../hrmangoTheme'
import {Feature, Role, FeatureRole} from '../../type/security'
import {DASHBOARD_URL, REQUISITION_URL, NEW_REQ_URL} from '../../constants/urls'
import {isRoleAllowed} from '../../utility'
import SideNavMenuItem from './sideNavMenuItem'

type SubMenuItemType = {
  subMenuItem: string
  id: string
  url: string
  roles?: Role[]
  requiredFeatureRole?: FeatureRole
  hasFeatureRoleAccess?: boolean
}

type MenuItemType = {
  menuId: number
  menuItem: string
  subMenuItems: SubMenuItemType[]
  requiredFeature?: Feature
}

export type SideNavType = {
  showNav?: boolean
  roles?: Role[]
}

const menuItems: MenuItemType[] = [
  {
    menuId: 0,
    menuItem: 'Requisition',
    subMenuItems: [
      {
        subMenuItem: 'Requisitions',
        id: 'reqs',
        url: REQUISITION_URL,
        roles: ['Administrator']
      },
      {
        subMenuItem: 'New',
        id: 'new-reqs',
        url: NEW_REQ_URL,
        roles: ['Administrator']
      }
    ]
  },
  {
    menuId: 1,
    menuItem: 'Candidate',
    subMenuItems: [
      {
        subMenuItem: 'Candidates',
        id: 'candidates-list',
        url: DASHBOARD_URL,
        roles: ['Administrator']
      },
      {
        subMenuItem: 'Add',
        id: 'candidates-add',
        url: DASHBOARD_URL,
        roles: ['Administrator']
      },
      {
        subMenuItem: 'In Queue',
        id: 'candidates-queue',
        url: DASHBOARD_URL,
        roles: ['Administrator']
      },
      {
        subMenuItem: 'Folders',
        id: 'candidates-folder',
        url: DASHBOARD_URL,
        roles: ['Administrator']
      },
      {
        subMenuItem: 'To do',
        id: 'candidates-todo',
        url: DASHBOARD_URL,
        roles: ['Administrator']
      },
      {
        subMenuItem: 'On boarding',
        id: 'candidates-onboarding',
        url: DASHBOARD_URL,
        roles: ['Administrator']
      }
    ]
  },
  {
    menuId: 2,
    menuItem: 'Reports',
    subMenuItems: [
      {
        subMenuItem: 'Standard Reports',
        id: 'reports-stamdard',
        url: DASHBOARD_URL,
        roles: ['Administrator']
      }
    ]
  },
  {
    menuId: 3,
    menuItem: 'Settings',
    subMenuItems: [
      {
        subMenuItem: 'Change password',
        id: 'settings-changepassword',
        url: DASHBOARD_URL,
        roles: ['Administrator']
      },
      {
        subMenuItem: 'Edit my account',
        id: 'settings-editaccount',
        url: DASHBOARD_URL,
        roles: ['Administrator']
      }
    ]
  },
  {
    menuId: 4,
    menuItem: 'Applicant',
    subMenuItems: [
      {
        subMenuItem: 'Profile',
        id: 'applicant-profile',
        url: DASHBOARD_URL,
        roles: ['Applicant']
      }
    ]
  }
]

export const getFilteredSideNav = (roles: Role[]): MenuItemType[] =>
  menuItems.map((item) => ({
    menuId: item.menuId,
    menuItem: item.menuItem,
    subMenuItems: item.subMenuItems
      .filter((item) => isRoleAllowed(item.roles, roles || []))
      .map((item) => ({
        id: item.id,
        subMenuItem: item.subMenuItem,
        url: item.url
      }))
  }))

export const SideNav = withRouter(({history, location, showNav, roles}: SideNavType & RouteComponentProps) => {
  /*const useStyles = makeStyles(() => ({
    sideNavContainer: {
      width: '100%',
      '& ul': {
        margin: spacing[0]
      },
      '& ul:first-of-type': {
        borderTop: `1px solid ${hrmangoColors.outline}`
      }
    }
  }))
  const classes = useStyles()*/

  useEffect(() => {
    menuItems.map((item) => item.subMenuItems.filter((item) => `/${item.url}` === history.location.pathname))
  }, []) // eslint-disable-line

  return (
    <>
      {roles &&
        getFilteredSideNav(roles).map((item) =>
          item.subMenuItems.length ? (
            <SideNavMenuItem
              key={item.menuId}
              menuId={item.menuId}
              menuItem={item.menuItem}
              subMenuItems={item.subMenuItems}
              showNav={showNav}
              onClick={history.push}
              location={location}
            />
          ) : (
            <></>
          )
        )}
    </>
  )
})
