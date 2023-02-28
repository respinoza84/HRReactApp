import {useState, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {Box} from '@material-ui/core'
import {NavTab} from 'lib/molecule/navTab'
import {spacing, hrmangoColors, typography, shadows} from 'lib/hrmangoTheme'
import {CandidateProfile} from '../../molecule/candidate/candidateProfile'

import {CandidateHeader} from '../../molecule/candidate/candidateHeader'
import {JobTable} from 'components/molecule/candidate/jobTable'
import {ContactProfile} from 'components/molecule/candidate/contact'
import {ActivityTable} from 'components/molecule/candidate/activityTable'
import {DocumentTable} from 'components/molecule/document/documentTable'
import {NoteTable} from 'components/molecule/note/noteTable'
import {LocationState} from 'type'

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

type TabItemType = {
  tabId: string
  tabItem: string
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
    tabItem: 'History & Activities'
  },
  {
    tabId: '3',
    tabItem: 'Documents & Notes'
  }
]

export const getFilteredNavTab = (candidateId): TabItemType[] =>
  tabItems
    .filter((item) => candidateId || item.tabId === '0')
    .map((item) => ({
      tabId: item.tabId,
      tabItem: item.tabItem
    }))

const CandidateDetail = withRouter(
  ({match, location}: RouteComponentProps<{candidateId: string}, StaticContext, LocationState>) => {
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
        marginTop: spacing[32],
        marginLeft: spacing[12]
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
      }
    }))

    const classes = useStyles()
    const [value, setValue] = useState(parseInt(location?.state?.params?.tab ?? 0))
    const candidateId = match.params.candidateId

    const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
      setValue(newValue)
    }

    return (
      <>
        <Box>
          <CandidateHeader />
        </Box>
        <div className={classes.root}>
          <NavTab getFilteredNavTab={getFilteredNavTab} value={value} onChange={handleChange} id={candidateId} />
          <Box className={classes.tabPanel}>
            <TabPanel value={value} index={0}>
              <CandidateProfile />
            </TabPanel>
            <TabPanel value={candidateId ? value : null} index={1}>
              <ContactProfile />
            </TabPanel>
            <TabPanel value={candidateId ? value : null} index={2}>
              <JobTable />
              <ActivityTable />
            </TabPanel>
            <TabPanel value={candidateId ? value : null} index={3}>
              <DocumentTable entityId={parseInt(candidateId)} entityName='Candidate' />
              <NoteTable entityId={parseInt(candidateId)} entityName='Candidate' />
            </TabPanel>
          </Box>
        </div>
      </>
    )
  }
)

export {CandidateDetail}
