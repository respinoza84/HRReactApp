/*
  @author  Oliver Zamora
  @description Nav Tab
*/
import {Tabs, Tab} from '@material-ui/core'
import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles} from '@material-ui/core/styles'

import {spacing, hrmangoColors, palette} from '../../hrmangoTheme'

export type NavTabType = {
  getFilteredNavTab: (id) => any[]
  value: any
  onChange: (event: any, newValue: number) => void
  id?: any
  orientation?: any
}

export const NavTab = withRouter(
  ({history, location, getFilteredNavTab, value, id, onChange, orientation}: NavTabType & RouteComponentProps) => {
    const useStyles = makeStyles(({typography}) => ({
      rootTab: {
        ...typography.button,
        color: hrmangoColors.lightVariant,
        minWidth: '220px'
      },
      tabContainer: {
        flexDirection: 'row',
        justifyContent: 'left'
      },
      tabs: {
        '& button:first-of-type': {
          marginLeft: spacing[0]
        },
        '& .MuiTab-root': {
          textTransform: 'capitalize',
          //padding: `${spacing[16]}px ${spacing[24]}px`,
          color: hrmangoColors.grey,
          backgroundColor: palette.grey[50]
        },
        '& .MuiTabs-indicator': {
          backgroundColor: hrmangoColors.mediumGray,
          opacity: 1,
          left: 0
        }
      }
    }))
    const classes = useStyles()

    return (
      <div className={classes.rootTab}>
        <Tabs
          orientation={orientation ?? 'vertical'}
          variant='scrollable'
          value={value}
          onChange={onChange}
          aria-label='Vertical tabs'
          className={classes.tabs}
        >
          {getFilteredNavTab(id).map((item) => (
            <Tab key={item.tabItem} label={item.tabItem} classes={{wrapper: classes.tabContainer}} />
          ))}
        </Tabs>
      </div>
    )
  }
)
