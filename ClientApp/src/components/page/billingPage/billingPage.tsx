import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {makeStyles, Theme} from '@material-ui/core/styles'

import {spacing, hrmangoColors, shadows, typography} from 'lib/hrmangoTheme'
//import {InfoHeader} from 'components/molecule/infoHeader'
import {Box} from '@material-ui/core'
import {NavTab} from 'lib/molecule/navTab'

import {CompanyFilters} from 'type/company/companyFilters'
//import {isAllowed} from 'utility'
import {ChangeEvent, useState} from 'react'
import {ModalRoleEnums} from 'type/user/roles'
import {LocationState} from 'type'
import {BillingSettings} from 'components/molecule/billing/billingSettings'
import {BillingItems} from 'components/molecule/billing/billingItems'
import {Invoices} from 'components/molecule/billing/Invoices'

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

export type BillingType = {
  loaded: boolean
  tableFilters?: CompanyFilters
  roles?: ModalRoleEnums[]
}

type TabItemType = {
  tabId: string
  tabItem: string
  roles?: ModalRoleEnums[]
}

const items: TabItemType[] = [
  {
    tabId: '0',
    tabItem: 'Billing Settings'
  },
  {
    tabId: '1',
    tabItem: 'Billing Items'
  },
  {
    tabId: '2',
    tabItem: 'Invoices'
  }
]

export const getItems = (jobId, companyId): TabItemType[] =>
  items
    .filter((item) => (jobId && item.tabId !== '2') || companyId)
    .map((item) => ({
      tabId: item.tabId,
      tabItem: item.tabItem
    }))

const BillingPage = withRouter(
  ({
    match,
    location,
    roles
  }: BillingType & RouteComponentProps<{companyId: string; jobId: string}, StaticContext, LocationState>) => {
    function TabPanel(props: TabPanelProps) {
      const {children, value, index, ...other} = props

      return (
        <div
          role='tabpanel'
          hidden={value !== index}
          id={`h-tabpanel-${index}`}
          aria-labelledby={`h-tab-${index}`}
          {...other}
        >
          {value === index && <Box p={3}>{children}</Box>}
        </div>
      )
    }
    const useStyles = makeStyles((theme: Theme) => ({
      principalContain: {
        //backgroundColor: hrmangoColors.white,
        //boxShadow: shadows[20],
        //borderRadius: '16px',
        //margin: `${spacing[16]}px ${spacing[32]}px`,
        //fontWeight: typography.fontWeightMedium
      },
      container: {
        position: 'relative',
        padding: `${spacing[16]}px`
      },
      tabPanel: {
        boxShadow: shadows[20],
        fontWeight: typography.fontWeightMedium,
        backgroundColor: hrmangoColors.white,
        borderTopRightRadius: '24px',
        borderBottomRightRadius: '24px',
        borderBottomLeftRadius: '24px',
        width: '-webkit-fill-available',
        '& .MuiContainer-root': {
          padding: spacing[0]
        }
      }
    }))
    const classes = useStyles()
    const companyId = match.params.companyId
    const jobId = match.params.jobId
    const [value, setValue] = useState(parseInt(location?.state?.params?.billingTab ?? 0))
    const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
      setValue(newValue)
    }
    return (
      <>
        <NavTab
          getFilteredNavTab={() => getItems(jobId, companyId)}
          value={value}
          onChange={handleChange}
          id={companyId}
          orientation='horizontal'
        />
        <Box className={classes.tabPanel}>
          <TabPanel value={value} index={0}>
            <BillingSettings />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <BillingItems />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Invoices />
          </TabPanel>
        </Box>
      </>
    )
  }
)

export {BillingPage}
