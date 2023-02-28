/*
  @author Oliver Zamora
  @description Nav 2022
*/
import {useState, useEffect, useRef /*, MouseEvent*/} from 'react'
import {makeStyles, Box} from '@material-ui/core'

import {withRouter, RouteComponentProps} from 'react-router'

import {spacing, hrmangoColors, fontWeight400} from '../../hrmangoTheme'
import {NavBar} from '../navBar'
import LogoIcon from '../../atom/icons/logoIcon/logoIcon'
import {ProfileBar} from '../profile'
import {AddBar} from '../addBar'
import {SearchBar} from '../search'
import {useOnClickOutside} from 'lib/utility/useOnClickOutside'
import {Notifications} from '@material-ui/icons'
import {ModalRoleEnums} from 'type/user/roles'

export type NavProps = {
  userName?: string
  mainHeaderTitle?: string
  resetToasts?: any
  setToast?: any
  roles?: ModalRoleEnums[]
}

export const Nav = withRouter(
  ({history, userName, mainHeaderTitle, resetToasts, setToast, roles, ...props}: RouteComponentProps & NavProps) => {
    const topHeaderHeight = 80
    const searchContainerRef = useRef<HTMLDivElement>(null)
    const [toggleSearch, setToggleSearch] = useState<boolean>(false)
    const useStyles = makeStyles(({palette, breakpoints, zIndex, shadows, typography}) => ({
      mainHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        height: topHeaderHeight,
        [breakpoints.down(1024)]: {
          marginLeft: 0
        },
        backgroundColor: hrmangoColors.dark,
        opacity: toggleSearch ? 1 : 0.87,
        alignItems: 'center',
        zIndex: 999
      },
      headerIcon: {
        marginRight: spacing[12],
        display: 'flex',
        alignItems: 'center',
        color: hrmangoColors.white
      },
      headerButtonAndTitle: {
        height: 80,
        marginLeft: spacing[8],
        display: 'flex',
        alignItems: 'center'
      },
      topHeaderRightContainer: {
        display: 'flex',
        alignItems: 'center',
        '& .MuiAutocomplete-popper': {
          marginTop: '110px',
          opacity: 1
        }
      },
      logoContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: spacing[24]
      },
      logoText: {
        paddingLeft: spacing[8],
        fontFamily: 'OpenSans-Bold, Open Sans',
        color: hrmangoColors.white,
        fontWeight: fontWeight400,
        fontSize: 18,
        lineHeight: 1.428,
        letterSpacing: '0.25px'
      },
      logoSubText: {
        display: 'flex',
        justifyContent: 'end',
        fontSize: 10
      },
      mainMenu: {
        backgroundColor: hrmangoColors.menuBar,
        zIndex: 0
      }
    }))
    const classes = useStyles()

    useOnClickOutside(searchContainerRef, () => {
      setToggleSearch(false)
    })

    useEffect(() => {
      return () => {
        resetToasts && resetToasts()
      }
    }, []) // eslint-disable-line

    return (
      <>
        <div className={classes.mainHeader}>
          <div className={classes.logoContainer}>
            <LogoIcon width='50.794' height='32' viewBox='0 0 50 32' />
            <Box className={classes.logoText}>
              <span>GateKeeper</span>
              <Box className={classes.logoSubText}>
                <span>by HRMango</span>
              </Box>
            </Box>
          </div>
          <div className={classes.topHeaderRightContainer}>
            <SearchBar
              setToast={setToast && setToast}
              resetToasts={resetToasts && resetToasts}
              setToggleSearchOff={() => setToggleSearch(false)}
            />
            <div className={classes.headerIcon}>
              <AddBar setToast={setToast} />
            </div>
            <div className={classes.headerIcon}>
              <Notifications fontSize='small' color='inherit' />
            </div>

            <ProfileBar userName={userName} setToast={setToast} />
          </div>
        </div>

        <div className={classes.mainMenu}>
          <NavBar roles={roles} />
        </div>
      </>
    )
  }
)
