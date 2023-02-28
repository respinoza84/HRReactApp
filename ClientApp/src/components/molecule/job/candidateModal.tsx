/*
  @author Oliver Zamora
  @description the candidateModal component.
*/
import {makeStyles} from '@material-ui/core'

import {spacing} from 'lib/hrmangoTheme'
import HRModal from '../../page/shared/modal'
import {CandidateProfile} from '../candidate/candidateProfile'

type candidateModalType = {
  open: boolean
  onClose: () => void
  setApplicantModalOpen: any
  setSelectedValue: any
}

const CandidateModal = ({onClose, open, setApplicantModalOpen, setSelectedValue}: candidateModalType) => {
  const useStyles = makeStyles(({hrmangoColors}) => ({
    content: {
      borderBottom: `1px solid ${hrmangoColors.lightGray}`,
      borderTop: `1px solid ${hrmangoColors.lightGray}`,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      padding: `${spacing[12]}px ${spacing[24]}px ${spacing[48]}px`,
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      }
    }
  }))
  const classes = useStyles()

  return (
    <HRModal header='Applicant' open={open} onClose={onClose}>
      <div className={classes.content}>
        <CandidateProfile
          onClose={onClose}
          setApplicantModalOpen={setApplicantModalOpen}
          setSelectedValue={setSelectedValue}
        />
      </div>
    </HRModal>
  )
}

export default CandidateModal
