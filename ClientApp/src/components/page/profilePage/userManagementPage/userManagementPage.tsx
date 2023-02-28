//import {useDispatch} from 'react-redux'
//import {useMutation} from 'react-query'
import {makeStyles} from '@material-ui/core'
//import {User} from 'type/user/user'
//import {setToast, setSpinner} from 'store/action/globalActions'
import {spacing, hrmangoColors, shadows, typography} from 'lib/hrmangoTheme'
import {UserTable} from 'components/molecule/user/userTable'

const useStyles = makeStyles((theme) => ({
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
}))

const UserManagementPage = () => {
  const classes = useStyles()
  //const dispatch = useDispatch()

  return (
    <>
      <div className={classes.principalContain}>
        <div className={classes.container}>
          <UserTable />
        </div>
      </div>
    </>
  )
}

export {UserManagementPage}
