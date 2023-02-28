/*
  @author Oliver Zamora
  @description the deleteModal component.
*/

import {AddNewJobToCompany} from 'components/molecule/job/company/AddNewJobToCompany'
import {makeStyles} from '@material-ui/core'
import {spacing, typography} from 'lib/hrmangoTheme'
import HRModal from '../../../page/shared/modal'

type addCompanyModalType = {
  id: number | undefined
  name: string | null | undefined
  open: boolean
  entityName: string
  onClose: () => void
  onCompanyRemoveClick: () => void
}

const AddCompanyModal = ({onCompanyRemoveClick, onClose, id, name, open, entityName}: addCompanyModalType) => {
  const useStyles = makeStyles(({hrmangoColors}) => ({
    content: {
      borderBottom: `1px solid ${hrmangoColors.lightGray}`,
      borderTop: `1px solid ${hrmangoColors.lightGray}`,
      //...hrmangoTypography.button,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      padding: `${spacing[24]}px ${spacing[24]}px ${spacing[240]}px`
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
    <HRModal header={entityName} open={open} onClose={onClose}>
      <div className={classes.content}>
        <AddNewJobToCompany />
      </div>
      <div className={classes.buttonContent}></div>
    </HRModal>
  )
}

export default AddCompanyModal
