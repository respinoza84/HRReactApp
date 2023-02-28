/*
  @author Oliver Zamora
  @description Shell/main page container
*/
import React, {memo, useMemo} from 'react'
import {ThemeProvider, createTheme, makeStyles} from '@material-ui/core/styles'
import TabContext from '@material-ui/lab/TabContext'
import TabList from '@material-ui/lab/TabList'
import Tab from '@material-ui/core/Tab'
import {useSelector, useDispatch} from 'react-redux'

import {IApplicationState} from 'store/reducer'
import {setActiveTab} from 'store/action/globalActions'
import {hrmangoTheme, spacing, hrmangoColors} from 'lib/hrmangoTheme'
import {MainContent} from 'components/organism/shell'
import {ConnectedNav} from 'container/molecule/connectedNav/connectedNav'

import {NavTabType} from 'lib/type/global/global'

const theme = createTheme(hrmangoTheme as any)

type CustomTheme = {
  [Key in keyof typeof hrmangoTheme]: typeof hrmangoTheme[Key]
}

declare module '@material-ui/core/styles' {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

export const Shell = memo(
  () => {
    const customMUiTheme = createTheme({...theme} as any)
    const useStyles = makeStyles(({breakpoints, shadows, typography}) => ({
      mainPage: {
        height: '100%',
        width: '100%',
        position: 'relative',
        minWidth: 1024,
        display: 'flex',
        flexDirection: 'column'
      },
      tabContainer: {
        marginLeft: 184,
        boxShadow: shadows[6],
        zIndex: 1,
        [breakpoints.down(1024)]: {
          marginLeft: 0
        }
      },
      rootTab: {
        ...typography.button,
        color: hrmangoColors.lightVariant,
        padding: `${spacing[16]}px ${spacing[24]}px`
      },
      selected: {
        backgroundColor: `${hrmangoColors.secondary[400]}`
      },
      indicator: {
        backgroundColor: hrmangoColors.secondary[200]
      }
    }))
    const classes = useStyles()
    const dispatch = useDispatch()

    const changeTab = (label: string) => {
      dispatch(setActiveTab(label))
    }

    const navTabs: NavTabType[] = useSelector((state: IApplicationState) => {
      return state.global.navTabs
    })
    const navActiveTab = useMemo(() => {
      let tab = ''
      tab = navTabs.length ? navTabs.filter((item) => item.active === true)[0].id : ''
      return tab
    }, [navTabs])

    return (
      <ThemeProvider theme={customMUiTheme}>
        <div className={classes.mainPage}>
          <ConnectedNav />
          {!!navTabs.length && (
            <div className={classes.tabContainer}>
              <TabContext value={navActiveTab}>
                <TabList
                  scrollButtons='auto'
                  variant='scrollable'
                  aria-label='nav tabs'
                  onChange={(event: React.MouseEvent<HTMLElement>, label: string) => changeTab(label)}
                  classes={{indicator: classes.indicator}}
                >
                  {navTabs.map((tab) => (
                    <Tab
                      key={tab.id}
                      id={tab.id}
                      label={tab.label}
                      value={tab.id}
                      classes={{selected: classes.selected, root: classes.rootTab}}
                    />
                  ))}
                </TabList>
              </TabContext>
            </div>
          )}
          <MainContent />
        </div>
      </ThemeProvider>
    )
  },
  (prevProps, nextProps) => {
    if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
      return true
    }
    return false
  }
)
