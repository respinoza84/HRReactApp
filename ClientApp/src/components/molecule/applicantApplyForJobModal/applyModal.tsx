/*
  @author Oliver Zamora
  @description the deleteModal component.
*/

import {makeStyles, Button} from '@material-ui/core'
import {spacing, typography} from 'lib/hrmangoTheme'
import HRModal from '../../page/shared/modal'
import CurrentUserCache from 'lib/utility/currentUser'

type applyCandidateModalType = {
  id: number | undefined
  name: string | null | undefined
  open: boolean
  entityName: string
  onClose: () => void
  onApplyClick: () => void
}

const ApplyJobModal = ({onApplyClick, onClose, id, name, open, entityName}: applyCandidateModalType) => {
  let currentUser: number | undefined = 0 ?? 0

  currentUser = CurrentUserCache?.userId!
  const useStyles = makeStyles(({hrmangoColors}) => ({
    content: {
      borderBottom: `1px solid ${hrmangoColors.lightGray}`,
      borderTop: `1px solid ${hrmangoColors.lightGray}`,
      //...hrmangoTypography.button,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      padding: `${spacing[12]}px ${spacing[24]}px ${spacing[48]}px`
    },
    button: {
      ...typography.buttonGreen,
      //textTransform: 'capitalize'
      //...typography.button
      padding: `${spacing[10]}px ${spacing[16]}px`,
      margin: spacing[12]
    },
    buttonDense: {
      ...typography.buttonDense,
      textTransform: 'capitalize',
      padding: `${spacing[10]}px ${spacing[16]}px`,
      margin: spacing[12]
    },
    submitButton: {
      color: hrmangoColors.onSurfaceDark.highEmphasis
    },
    buttonContent: {
      padding: `${spacing[8]}px ${spacing[16]}px`,
      display: 'flex',
      justifyContent: 'end'
    }
  }))
  const classes = useStyles()

  return (
    <HRModal header={`Apply to this ${entityName}`} open={open} onClose={onClose}>
      <div className={classes.content}>
        Are you sure you want to apply the {entityName} {name} {id} {currentUser}?
      </div>
      <div className={classes.buttonContent}>
        <Button color='secondary' onClick={onClose} className={classes.buttonDense}>
          CANCEL
        </Button>
        <Button
          className={`${classes.button} ${classes.submitButton}`}
          variant='contained'
          color='secondary'
          onClick={onApplyClick}
        >
          Apply
        </Button>
      </div>
    </HRModal>
  )
}

export default ApplyJobModal
