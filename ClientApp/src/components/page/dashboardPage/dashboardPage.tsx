import {useState, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {Box, Typography} from '@material-ui/core'
import {NavTab} from 'lib/molecule/navTab'

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
    tabItem: 'Company'
  },
  {
    tabId: '1',
    tabItem: 'Profile'
  },
  {
    tabId: '2',
    tabItem: 'Applicants'
  },
  {
    tabId: '3',
    tabItem: 'Job Posting'
  },
  {
    tabId: '4',
    tabItem: 'Activities & Notes'
  },
  {
    tabId: '5',
    tabItem: 'History'
  }
]

export const getFilteredNavTab = (): TabItemType[] =>
  tabItems.map((item) => ({
    tabId: item.tabId,
    tabItem: item.tabItem
  }))

const DashboardPage = withRouter(({match, location, history}: RouteComponentProps) => {
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
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    )
  }
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: 224
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  }))

  const classes = useStyles()
  const [value, setValue] = useState(0)

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <NavTab getFilteredNavTab={getFilteredNavTab} value={value} onChange={handleChange} id={0} />

      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </div>
  )
})

export {DashboardPage}
