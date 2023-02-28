/*
  @author Rodney Espinoza
  @description the activated Modal component.
*/

import {makeStyles, Button} from '@material-ui/core'
import {spacing, typography} from 'lib/hrmangoTheme'
import HRModal from '../../page/shared/modal'

type activatedCandidateModalType = {
  id: number | undefined
  name: string | null | undefined
  open: boolean
  entityName: string
  onClose: () => void
  onActivatedClick: () => void
}

const ActivedModal = ({onActivatedClick, onClose, id, name, open, entityName}: activatedCandidateModalType) => {
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
    <HRModal header={`Activate ${entityName}`} open={open} onClose={onClose}>
      <div className={classes.content}>
        Are you sure you want to activate the {entityName} {name}?
      </div>
      <div className={classes.buttonContent}>
        <Button color='secondary' onClick={onClose} className={classes.buttonDense}>
          CANCEL
        </Button>
        <Button
          className={`${classes.button} ${classes.submitButton}`}
          variant='contained'
          color='secondary'
          onClick={onActivatedClick}
        >
          Activate
        </Button>
      </div>
    </HRModal>
  )
}

export default ActivedModal
