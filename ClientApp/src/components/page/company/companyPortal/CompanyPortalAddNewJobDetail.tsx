import {useState, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {Box} from '@material-ui/core'
import {NavTab} from 'lib/molecule/navTab'
import {spacing, hrmangoColors, typography, shadows} from 'lib/hrmangoTheme'
import {CompanyHeader} from '../../../molecule/company/companyHeader'
import {CompanyProfile} from '../../../molecule/company/companyProfile'
import {JobTable} from '../../../molecule/company/jobTable'
import {ActivityTable} from '../../../molecule/company/activityTable'
import {DocumentTable} from '../../../molecule/document/documentTable'
import {CandidateTable} from '../../../molecule/company/candidateTable'
import {NoteTable} from '../../../molecule/note/noteTable'
import {ContactTable} from 'components/molecule/company/contactTable'
import {LocationState} from 'type'
import {ModalRoleEnums} from 'type/user/roles'
import {isAllowed} from 'utility'
import CurrentUserCache from 'lib/utility/currentUser'
import {BillingPage} from '../../billingPage'

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

type TabItemType = {
  tabId: string
  tabItem: string
  roles?: ModalRoleEnums[]
}

const tabItems: TabItemType[] = [
  {
    tabId: '0',
    tabItem: 'Profile'
  },
  {
    tabId: '1',
    tabItem: 'Contact & Address'
  },
  {
    tabId: '2',
    tabItem: 'Jobs & Activities'
  },
  {
    tabId: '3',
    tabItem: 'Documents & Notes'
  },
  {
    tabId: '4',
    tabItem: 'Billing',
    roles: [ModalRoleEnums.Administrator]
  }
]

export const getFilteredNavTab = (companyId): TabItemType[] =>
  tabItems
    .filter((item) => companyId || item.tabId === '0')
    .filter((item) => isAllowed(item.roles, CurrentUserCache?.roles || []))
    .map((item) => ({
      tabId: item.tabId,
      tabItem: item.tabItem
    }))

const CompanyPortalAddNewJobDetail = withRouter(
  ({match, location}: RouteComponentProps<{companyId: string}, StaticContext, LocationState>) => {
    function TabPanel(props: TabPanelProps) {
      const {children, value, index, ...other} = props

      return (
        <div
          role='tabpanel'
          hidden={value !== index}
          id={`vertical-tabpanel-${index}`}
          aria-labelledby={`vertical-tab-${index}`}
          {...other}
        >
          {value === index && <Box p={3}>{children}</Box>}
        </div>
      )
    }
    const useStyles = makeStyles((theme: Theme) => ({
      root: {
        flexGrow: 1,
        display: 'flex',
        marginTop: spacing[16],
        marginLeft: spacing[24]
      },
      tabPanel: {
        boxShadow: shadows[20],
        fontWeight: typography.fontWeightMedium,
        backgroundColor: hrmangoColors.white,
        borderTopRightRadius: '24px',
        borderBottomRightRadius: '24px',
        borderBottomLeftRadius: '24px',
        width: '-webkit-fill-available',
        marginRight: '32px',
        '& .MuiContainer-root': {
          padding: spacing[0]
        }
      },
      button: {
        backgroundColor: hrmangoColors.green,
        color: hrmangoColors.white,
        padding: '13px 24px',
        borderRadius: '8px',
        boxShadow: shadows[7],
        textTransform: 'capitalize'
      },
      spinner: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
    }))

    const classes = useStyles()
    const [value, setValue] = useState(parseInt(location?.state?.params?.tab ?? 0))
    const companyId = match.params.companyId

    const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
      setValue(newValue)
    }

    return (
      <>
        <Box>
          <CompanyHeader />
        </Box>
        <div className={classes.root}>
          <NavTab getFilteredNavTab={getFilteredNavTab} value={value} onChange={handleChange} id={companyId} />
          <Box className={classes.tabPanel}>
            <TabPanel value={value} index={0}>
              <CompanyProfile />
            </TabPanel>
            <TabPanel value={companyId ? value : null} index={1}>
              <ContactTable />
              <CandidateTable />
            </TabPanel>
            <TabPanel value={companyId ? value : null} index={2}>
              <JobTable />
              <ActivityTable />
            </TabPanel>
            <TabPanel value={companyId ? value : null} index={3}>
              <DocumentTable entityId={parseInt(companyId)} entityName='Company' />
              <NoteTable entityId={parseInt(companyId)} entityName='Company' />
            </TabPanel>
            <TabPanel value={companyId ? value : null} index={4}>
              <BillingPage loaded={false} />
            </TabPanel>
          </Box>
        </div>
      </>
    )
  }
)

export {CompanyPortalAddNewJobDetail}
