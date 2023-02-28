import {makeStyles} from '@material-ui/core/styles'
import {hrmangoTheme} from 'lib/hrmangoTheme'
import {Global} from 'components/organism/shell'
import {ExternalRouter} from 'router/externalRouter'

type CustomTheme = {
  [Key in keyof typeof hrmangoTheme]: typeof hrmangoTheme[Key]
}

declare module '@material-ui/core/styles' {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}
const ExternalShell = () => {
  const useStyles = makeStyles(({breakpoints}) => ({
    mainPage: {
      height: '100%',
      width: '100%',
      position: 'relative',
      minWidth: 1024,
      display: 'flex',
      flexDirection: 'column'
    },
    mainContent: {
      height: '100%',
      //marginLeft: 184,
      [breakpoints.down(1024)]: {
        marginLeft: 0
      },
      overflow: 'auto'
    }
  }))
  const classes = useStyles()

  return (
    <div className={classes.mainPage}>
      <div className={classes.mainContent}>
        <Global />
        <ExternalRouter />
      </div>
    </div>
  )
}

export {ExternalShell}
