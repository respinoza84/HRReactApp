import {useState, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {Box} from '@material-ui/core'
import {NavTab} from 'lib/molecule/navTab'
import {spacing, hrmangoColors, typography, shadows} from 'lib/hrmangoTheme'

import {AddNewJobToCompany} from 'components/molecule/job/company/AddNewJobToCompany'
import {CompanyApplicants} from '../../../molecule/job/company/CompanyApplicants'
import {LocationState} from 'type'
import {ModalRoleEnums} from 'type/user/roles'
import {isAllowed} from 'utility'
import CurrentUserCache from 'lib/utility/currentUser'
import {JobCompanyHeader} from './jobCompanyHeader'
import {ActivityTable} from './activityTable'
import {JobStages} from 'components/molecule/job/jobStages'

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
    tabItem: 'Job Stages'
  },
  {
    tabId: '2',
    tabItem: 'Applicants'
  },
  {
    tabId: '3',
    tabItem: 'Activities'
  }
]

export const getFilteredNavTab = (jobId): TabItemType[] =>
  tabItems
    .filter((item) => jobId || item.tabId === '0')
    .filter((item) => isAllowed(item.roles, CurrentUserCache?.roles || []))
    .map((item) => ({
      tabId: item.tabId,
      tabItem: item.tabItem
    }))

const JobCompanyDetail = withRouter(
  ({match, location, history}: RouteComponentProps<{jobId: string}, StaticContext, LocationState>) => {
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
        '& .MuiAutocomplete-popper': {
          marginTop: '80px',
          opacity: 0.9
        },
        '& .MuiContainer-root': {
          padding: spacing[0]
        },
        principalContain: {
          backgroundColor: hrmangoColors.white,
          boxShadow: shadows[20],
          borderRadius: '16px',
          margin: `${spacing[16]}px ${spacing[32]}px`,
          fontWeight: typography.fontWeightMedium
        },
        container: {
          position: 'relative',
          padding: `${spacing[16]}px`
        }
      }
    }))

    const classes = useStyles()
    const [value, setValue] = useState(parseInt(location?.state?.params?.tab ?? 0))
    const jobId = match.params.jobId

    const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
      setValue(newValue)
    }

    return (
      <>
        <Box>
          <JobCompanyHeader />
        </Box>
        <div className={classes.root}>
          <NavTab getFilteredNavTab={getFilteredNavTab} value={value} onChange={handleChange} id={jobId} />
          <Box className={classes.tabPanel}>
            <TabPanel value={value} index={0}>
              <AddNewJobToCompany />
            </TabPanel>
            <TabPanel value={jobId ? value : null} index={1}>
              <JobStages />
            </TabPanel>
            <TabPanel value={jobId ? value : null} index={2}>
              <CompanyApplicants />
            </TabPanel>
            <TabPanel value={jobId ? value : null} index={3}>
              <ActivityTable />
            </TabPanel>
          </Box>
        </div>
      </>
    )
  }
)

export {JobCompanyDetail}
