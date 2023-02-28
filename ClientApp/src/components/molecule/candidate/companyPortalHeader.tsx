import {useState} from 'react'
import {Box, Button, Drawer} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {spacing, typography, hrmangoColors} from 'lib/hrmangoTheme'
import {Dehaze, ArrowBack} from '@material-ui/icons'
import CandidateActionsDrawer from './candidateActionsDrawer'
import {LocationState} from 'type'

const CompanyPortalHeader = withRouter(
  ({history, location, match}: RouteComponentProps<{candidateId: string}, StaticContext, LocationState>) => {
    const useStyles = makeStyles((theme: Theme) => ({
      root: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: `${spacing[24]}px ${spacing[32]}px ${spacing[16]}px ${spacing[32]}px`,
        color: `${location && location.state && location.state.header?.color}`,
        borderBottom: hrmangoColors.tableBorderStyle,
        ...typography.h5
      },
      rightMenu: {
        display: 'flex',
        justifyContent: 'end',
        marginLeft: spacing[32],
        marginRigth: spacing[32]
      },
      label: {
        marginLeft: spacing[32]
      },
      labelRight: {
        marginLeft: spacing[32],
        color: hrmangoColors.dark,
        ...typography.body1
      },
      button: {
        ...typography.buttonDense,
        marginLeft: spacing[32],
        marginBottom: spacing[24],
        textTransform: 'capitalize'
      },
      drawerPaper: {
        width: '405px',
        top: '80px',
        borderTopLeftRadius: spacing[24]
      }
    }))
    const classes = useStyles()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const goBack = () => {
      history.goBack()
    }

    const toggleDrawer = (open: boolean) => (event: any) => {
      setDrawerOpen(open)
    }

    return (
      <div className={classes.root}>
        <Box>
          <ArrowBack style={{cursor: 'pointer'}} fontSize='medium' color='primary' onClick={goBack} />
          <label className={classes.label}>{location && location.state && location.state.header?.title}</label>
        </Box>

        <Box className={classes.rightMenu}>
          {location && location.state && location.state.header?.owner && (
            <div className={classes.labelRight}>
              Owner{' '}
              <Box style={{fontWeight: typography.fontWeightBold}}>
                {location && location.state && location.state.header?.owner}
              </Box>
            </div>
          )}
          {location && location.state && location.state.header?.type && (
            <div className={classes.labelRight}>
              Type{' '}
              <Box style={{fontWeight: typography.fontWeightBold}}>
                {location && location.state && location.state.header?.type}
              </Box>
            </div>
          )}
          <div>
            <Button type='submit' variant='contained' className={classes.button} onClick={toggleDrawer(true)}>
              <Dehaze fontSize='small' color='inherit' />
            </Button>
          </div>
        </Box>
        <Drawer
          anchor={'right'}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <CandidateActionsDrawer
            closeHandler={toggleDrawer(false)}
            candidateId={parseInt(match.params.candidateId) ?? 0}
          />
        </Drawer>
      </div>
    )
  }
)

export {CompanyPortalHeader}
