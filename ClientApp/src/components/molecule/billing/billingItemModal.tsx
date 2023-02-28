/*
  @author Oliver Zamora
  @description the biModal component.
*/
import {makeStyles} from '@material-ui/core'

import {spacing} from 'lib/hrmangoTheme'
import HRModal from '../../page/shared/modal'
import {BillingItemInfo} from './billingItemInfo'

type billingItemModalType = {
  open: boolean
  onClose: () => void
  refetch?: any
  billingItemId: any
  companyId?: any
  jobId?: any
}

const BillingItemModal = ({onClose, open, refetch, billingItemId, companyId, jobId}: billingItemModalType) => {
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
    <HRModal header='Billing Item' open={open} onClose={onClose}>
      <div className={classes.content}>
        <BillingItemInfo
          onClose={onClose}
          billingItemId={billingItemId}
          companyId={companyId}
          jobId={jobId}
          refetch={refetch}
        />
      </div>
    </HRModal>
  )
}

export default BillingItemModal
