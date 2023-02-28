/*
  @author  Oliver Zamora
  @description Side Nav
*/

import {useState} from 'react'
import {AppBar, Tab, Tabs} from '@material-ui/core'
import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles} from '@material-ui/core/styles'

import {spacing, hrmangoColors, fontWeight600} from '../../hrmangoTheme'
import {Role, FeatureRole} from '../../type/security'
import {
  HOME_URL,
  JOB_URL,
  COMPANY_URL,
  CANDIDATE_URL,
  CANDIDATEFORCOMPANY_URL,
  REPORT_URL,
  CONTACT_URL,
  BILLING_INVOICES,
  JOB_APPLICANTURL,
  JOB_COMPANYURL,
  BILLINGCOMPANY_INVOICES
} from '../../constants/urls'
import {Home, Business, Work, People, InsertChart, ContactMail, MonetizationOn} from '@material-ui/icons'
import {ModalRoleEnums} from 'type/user/roles'
import {isAllowed} from 'utility'

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
  subMenuItems?: SubMenuItemType[]
  icon: any
  url: string
  color: string
  roles?: ModalRoleEnums[]
}

export type NavBarType = {
  showNav?: boolean
  roles?: ModalRoleEnums[]
}

const menuItems: MenuItemType[] = [
  {
    menuId: 0,
    menuItem: 'Home',
    icon: <Home htmlColor='#E9573F' fontSize='small' />,
    url: HOME_URL,
    color: '#E9573F',
    roles: [ModalRoleEnums.Applicant, ModalRoleEnums.Administrator, ModalRoleEnums.Company]
  },
  {
    menuId: 1,
    menuItem: 'Contacts',
    icon: <ContactMail htmlColor='#4154BF' fontSize='small' />,
    url: CONTACT_URL,
    color: '#4154BF',
    roles: [ModalRoleEnums.Administrator, ModalRoleEnums.Level1]
  },
  {
    menuId: 2,
    menuItem: 'Companies',
    icon: <Business htmlColor='#5BC24C' fontSize='small' />,
    url: COMPANY_URL,
    color: '#5BC24C',
    roles: [ModalRoleEnums.Administrator, ModalRoleEnums.Level1]
  },
  {
    menuId: 3,
    menuItem: 'Jobs',
    icon: <Work htmlColor='#0091D0' fontSize='small' />,
    url: JOB_URL,
    color: '#0091D0',
    roles: [ModalRoleEnums.Administrator, ModalRoleEnums.Level1]
  },
  {
    menuId: 3,
    menuItem: 'Jobs',
    icon: <Work htmlColor='#0091D0' fontSize='small' />,
    url: JOB_APPLICANTURL,
    color: '#0091D0',
    roles: [ModalRoleEnums.Applicant]
  },
  {
    menuId: 3,
    menuItem: 'Jobs',
    icon: <Work htmlColor='#0091D0' fontSize='small' />,
    url: JOB_COMPANYURL,
    color: '#0091D0',
    roles: [ModalRoleEnums.Company]
  },
  {
    menuId: 4,
    menuItem: 'Candidates',
    icon: <People htmlColor='#F5B025' fontSize='small' />,
    url: CANDIDATE_URL,
    color: '#F5B025',
    roles: [ModalRoleEnums.Administrator, ModalRoleEnums.Level1]
  },
  {
    menuId: 4,
    menuItem: 'Candidates',
    icon: <People htmlColor='#F5B025' fontSize='small' />,
    url: CANDIDATEFORCOMPANY_URL,
    color: '#F5B025',
    roles: [ModalRoleEnums.Company]
  },
  {
    menuId: 5,
    menuItem: 'Reporting',
    icon: <InsertChart htmlColor='#967ADC' fontSize='small' />,
    url: REPORT_URL,
    color: '#967ADC',
    roles: [ModalRoleEnums.Administrator, ModalRoleEnums.Level1]
  },
  {
    menuId: 6,
    menuItem: 'Billing',
    icon: <MonetizationOn htmlColor='#009474' fontSize='small' />,
    url: BILLING_INVOICES,
    color: '#009474',
    roles: [ModalRoleEnums.Administrator]
  },
  {
    menuId: 6,
    menuItem: 'Billing',
    icon: <MonetizationOn htmlColor='#009474' fontSize='small' />,
    url: BILLINGCOMPANY_INVOICES,
    color: '#009474',
    roles: [ModalRoleEnums.Company]
  }
]

export const getFilteredNavBar = (roles: ModalRoleEnums[]): MenuItemType[] =>
  menuItems
    .filter((item) => isAllowed(item.roles, roles || []))
    .map((item) => ({
      menuId: item.menuId,
      menuItem: item.menuItem,
      icon: item.icon,
      url: item.url,
      color: item.color
      /*subMenuItems: item.subMenuItems
      .filter((item) => isRoleAllowed(item.roles, roles || []))
      .map((item) => ({
        id: item.id,
        subMenuItem: item.subMenuItem,
        url: item.url
      }))*/
    }))

export const NavBar = withRouter(({history, location, showNav, roles}: NavBarType & RouteComponentProps) => {
  const useStyles = makeStyles(({typography, shadows}: any) => ({
    navItems: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    rootTab: {
      '& .MuiTabs-flexContainer': {
        backgroundColor: hrmangoColors.menuBar
      },
      '& .MuiTab-root': {
        textTransform: 'capitalize',
        minWidth: 60
      },
      '& .MuiTab-labelIcon .MuiTab-wrapper > *:first-child': {
        margin: 0
      },
      '& .MuiTab-wrapper': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: `${spacing[16]}px`,
        paddingLeft: `${spacing[16]}px`
      },
      '& .MuiTab-labelIcon': {
        minHeight: 48
      },
      '& .MuiTab-textColorInherit.Mui-selected': {
        color: hrmangoColors.dark,
        fontWeight: fontWeight600
      }
    },
    tabContainer: {
      color: hrmangoColors.grey,
      opacity: 1,
      padding: spacing[0],
      zIndex: 1,
      '& .MuiSvgIcon-root': {
        paddingRight: spacing[8]
      }
    },
    tabs: {
      '& button:first-of-type': {
        marginLeft: spacing[0]
      }
    }
  }))
  const classes = useStyles()

  const [tab, setTab] = useState(0)
  const [color, setColor] = useState<string | undefined>('#E9573F')
  //const [anchorEl, setAnchorEl] = useState<any>(null)
  const handleChange = (event: any, label: number) => {
    setTab(label)
    const item = roles && getFilteredNavBar(roles).find((item) => item.menuId === label)
    setColor(item?.color)
    // setAnchorEl(event.currentTarget)
  }

  /*const handleClick = (event: any, index: number) => {
    setAnchorEl({[index]: event.currentTarget})
  }*/

  return (
    <div className={classes.rootTab}>
      <AppBar position='static' color='default'>
        <Tabs
          value={tab}
          onChange={handleChange}
          className={classes.tabs}
          aria-label='tabs'
          TabIndicatorProps={{style: {backgroundColor: color}}}
        >
          {roles &&
            getFilteredNavBar(roles).map((item) => (
              <Tab
                key={`${item.menuId}`}
                id={`${item.menuId}`}
                label={item.menuItem}
                icon={item.icon}
                className={classes.tabContainer}
                onClick={() => {
                  history.push({
                    pathname: `/${item.url}`,
                    state: {
                      header: {
                        title: item.menuItem,
                        color: item.color
                      }
                    }
                  })
                }}
              />
            ))}
        </Tabs>
      </AppBar>
    </div>
  )
})
