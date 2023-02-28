import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import {spacing, typography} from 'lib/hrmangoTheme'
import {Email, Comment, Dehaze} from '@material-ui/icons'
import EmailModal from '../email/emailModal'

export type CompanyActionsDrawerType = {
  loaded?: boolean
  closeHandler: Function
  companyId: number
}

const useStyles = makeStyles(({palette, hrmangoColors}) => ({
  wrapper: {
    '& h2, h3, h4': {
      margin: spacing[0]
    },
    '& h2': {
      ...typography.h4
    },
    '& input.MuiAutocomplete-input:first-child': {
      font: 'inherit !important',
      color: 'currentColor !important',
      margin: '0px !important'
    },
    '& .MuiButton-outlinedPrimary:hover': {
      border: `1px solid ${palette.primary.light}`,
      background: 'none'
    }
  },
  header: {
    display: 'flex',
    width: '100%',
    borderBottom: '1px solid ' + hrmangoColors.outline,
    backgroundColor: hrmangoColors.menuBar
  },
  headerLeft: {
    width: '50%',
    margin: `${spacing[10]}px`
  },
  headerRight: {
    width: '50%',
    textAlign: 'right',
    margin: `${spacing[10]}px`
  },
  closeIcon: {
    color: hrmangoColors.dark,
    cursor: 'pointer'
  },
  section: {
    margin: `${spacing[16]}px`
  },
  bottomSection: {
    padding: `12px ${spacing[24]}px`,
    paddingBottom: '10px',
    borderBottom: '1px solid ' + hrmangoColors.outline
  },
  separator: {
    borderBottom: '1px solid ' + hrmangoColors.outline
  },
  label: {
    color: hrmangoColors.onSurfaceLight.mediumEmphasis,
    ...typography.body2
  },
  date: {
    color: hrmangoColors.onSurfaceLight.highEmphasis,
    ...typography.body2
  },
  buttonsWrapper: {
    margin: `${spacing[32]}px ${spacing[24]}px`,
    marginTop: `${spacing[16]}px`,
    display: 'flex',
    position: 'absolute',
    bottom: '80px',
    width: '355px',
    '& .Mui-disabled': {
      backgroundColor: hrmangoColors.lightGray,
      color: hrmangoColors.white
    }
  },
  button: {
    ...typography.buttonGreen,
    //fontWeight: typography.fontWeightMedium,
    width: '50%'
  },
  buttonReset: {
    ...typography.buttonDense,
    //fontWeight: typography.fontWeightMedium,
    marginLeft: '12px',
    border: `1px solid ${palette.primary.light}`,
    width: '50%'
  },
  textField: {
    '& .MuiFilledInput-input': {
      padding: '16px 13px'
    }
  }
}))

const CompanyActionsDrawer = ({closeHandler, companyId}: CompanyActionsDrawerType) => {
  const classes = useStyles()

  const [emailModalOpen, setEmailModalOpen] = useState(false)

  const handleClose = () => {
    closeHandler()
  }

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <div className={classes.headerLeft}>
            <h3>
              <Dehaze fontSize='small' color='inherit' /> Actions Menu
            </h3>
          </div>
          <div className={classes.headerRight}>
            <span title='Close'>
              <CloseIcon className={classes.closeIcon} onClick={handleClose} />
            </span>
          </div>
        </div>
        <div
          className={classes.bottomSection}
          style={{cursor: 'pointer'}}
          onClick={() => {
            setEmailModalOpen(true)
          }}
        >
          <span>
            <Email fontSize='small' color='inherit' /> Send an email
          </span>
        </div>
        <div className={classes.bottomSection}>
          <Comment fontSize='small' color='inherit' /> Add a note
        </div>
      </div>
      <EmailModal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} />
    </>
  )
}

export default CompanyActionsDrawer
