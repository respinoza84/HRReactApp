import {useState, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {Box} from '@material-ui/core'
import {NavTab} from 'lib/molecule/navTab'
import {spacing, hrmangoColors, typography, shadows} from 'lib/hrmangoTheme'
import {ReportHeader} from 'components/molecule/report/reportHeader'
import {CompanyReport} from 'components/molecule/report/companyReport'
import {JobReport} from 'components/molecule/report/jobReport'
import {ApplicantReport} from 'components/molecule/report/applicantReport'
import {MetricReport} from 'components/molecule/report/metricReport'

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
    tabItem: 'Companies'
  },
  {
    tabId: '1',
    tabItem: 'Jobs'
  },
  {
    tabId: '2',
    tabItem: 'Applicants'
  },
  {
    tabId: '3',
    tabItem: 'Metrics'
  }
]

export const getFilteredNavTab = (): TabItemType[] =>
  tabItems.map((item) => ({
    tabId: item.tabId,
    tabItem: item.tabItem
  }))

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
    marginRight: '32px',
    '& .MuiAutocomplete-popper': {
      marginTop: '80px',
      opacity: 0.9
    },
    '& .MuiContainer-root': {
      padding: spacing[0]
    }
  },
  tabPanelExt: {
    boxShadow: shadows[20],
    fontWeight: typography.fontWeightMedium,
    backgroundColor: hrmangoColors.white,
    borderTopRightRadius: '24px',
    borderBottomRightRadius: '24px',
    borderBottomLeftRadius: '24px',
    marginRight: '32px',
    '& .MuiAutocomplete-popper': {
      marginTop: '80px',
      opacity: 0.9
    },
    '& .MuiContainer-root': {
      padding: spacing[0]
    },
    width: '-webkit-fill-available'
  }
}))

const ReportPage = withRouter(({match, location, history}: RouteComponentProps) => {
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
  const classes = useStyles()
  const [value, setValue] = useState(0)

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <>
      <Box>
        <ReportHeader />
      </Box>
      <div className={classes.root}>
        <NavTab getFilteredNavTab={getFilteredNavTab} value={value} onChange={handleChange} />
        <Box className={classes.tabPanelExt}>
          <TabPanel value={value} index={0}>
            <CompanyReport />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <JobReport />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ApplicantReport />
          </TabPanel>
        </Box>
        <Box className={classes.tabPanel}>
          <TabPanel value={value} index={3}>
            <MetricReport />
          </TabPanel>
        </Box>
      </div>
    </>
  )
})

export {ReportPage}
