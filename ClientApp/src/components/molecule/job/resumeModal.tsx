/*
  @author Oliver Zamora
  @description the resumeModal component.
*/
import {makeStyles} from '@material-ui/core'

import {spacing, typography} from 'lib/hrmangoTheme'
import HRModal from '../../page/shared/modal'
import {DocumentTable} from '../document/documentTable'

type resumeModalType = {
  open: boolean
  candidateId: any
  onClose: () => void
}

const ResumeModal = ({onClose, candidateId, open}: resumeModalType) => {
  const useStyles = makeStyles(({hrmangoColors}) => ({
    content: {
      borderBottom: `1px solid ${hrmangoColors.lightGray}`,
      borderTop: `1px solid ${hrmangoColors.lightGray}`,
      //...hrmangoTypography.button,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      padding: `${spacing[12]}px ${spacing[24]}px ${spacing[48]}px`,
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      }
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
    },
    textField: {
      '& .MuiFilledInput-input': {
        padding: '16px 13px'
      }
    }
  }))
  const classes = useStyles()

  return (
    <HRModal header='Resume & Documents' open={open} onClose={onClose}>
      <div className={classes.content}>
        <DocumentTable entityId={parseInt(candidateId)} entityName='Candidate' />
      </div>
    </HRModal>
  )
}

export default ResumeModal
