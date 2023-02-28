/*
  @author Oliver Zamora
  @description the emailModal component.
*/
import {useState} from 'react'
import {makeStyles, Button} from '@material-ui/core'

import {spacing, typography} from 'lib/hrmangoTheme'
import HRModal from '../../page/shared/modal'
import {DateTimePicker} from '@material-ui/pickers'
//import DateFnsUtils from '@date-io/date-fns'
import enLocale from 'date-fns/locale/en-US'
import DateFnsTzUtils from 'lib/atom/datePicker/DateFnsTzUtils'
import MuiPickersTzUtilsProvider from 'lib/atom/datePicker/MuiPickersTzUtilsProvider'
import {format} from 'date-fns'

type applicantModalType = {
  open: boolean
  applicant: any
  setApplicant: any
  onClose: () => void
  onSave?: any
}

const ApplicantModal = ({onClose, onSave, open, applicant, setApplicant}: applicantModalType) => {
  const useStyles = makeStyles(({hrmangoColors}) => ({
    content: {
      borderBottom: `1px solid ${hrmangoColors.lightGray}`,
      borderTop: `1px solid ${hrmangoColors.lightGray}`,
      //...hrmangoTypography.button,
      color: hrmangoColors.onSurfaceLight.highEmphasis,
      padding: `${spacing[12]}px ${spacing[24]}px ${spacing[48]}px`,
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      },
      '& .MuiFormControl-root': {
        minWidth: '35%'
      },
      '& .MuiInput-underline:before': {
        borderBottom: 'none'
      },
      '& .MuiInput-underline:after': {
        borderBottom: 'none'
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
  const [isError, setIsError] = useState({
    applicationDate: false,
    startDate: false,
    endDate: false
  })

  return (
    <HRModal header='Applicant' open={open} onClose={onClose}>
      <div className={classes.content}>
        <MuiPickersTzUtilsProvider utils={DateFnsTzUtils} timeZone='' locale={enLocale}>
          <DateTimePicker
            autoOk
            inputVariant='outlined'
            variant='inline'
            label='Applicant Date'
            format='yyyy-MM-dd hh:mm a (z)'
            value={
              applicant.applicationDate ??
              setApplicant({...applicant!, applicationDate: format(new Date(), "yyyy-MM-dd'T'HH:mm")})
            }
            onChange={(date: any) => {
              setApplicant({...applicant!, applicationDate: format(date, "yyyy-MM-dd'T'HH:mm")})
            }}
          />
        </MuiPickersTzUtilsProvider>
      </div>
      <div className={classes.buttonContent}>
        <Button color='secondary' onClick={onClose} className={classes.buttonDense}>
          Cancel
        </Button>
        <Button
          className={`${classes.button} ${classes.submitButton}`}
          variant='contained'
          color='secondary'
          onClick={() => {
            setIsError({
              ...isError,
              applicationDate: !applicant?.applicationDate?.replace(/\s+/g, '').length ?? false
            })
            if (applicant?.applicationDate?.replace(/\s+/g, '').length) {
              onSave.mutate()
            }
          }}
        >
          Save
        </Button>
      </div>
    </HRModal>
  )
}

export default ApplicantModal
