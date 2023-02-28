/*
  @author Oliver Zamora
  @description the HRModal component.
*/

import React from 'react'
import {makeStyles, Modal, Typography, IconButton} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'

import {spacing} from 'lib/hrmangoTheme'

export type DialogButtonType = {
  text?: string
  description?: string
}

type ModalType = {
  open: boolean
  onClose: () => void
  header?: string
  subHeader?: string | null | undefined
  children: React.ReactNode
}

const useStyles = makeStyles(({hrmangoColors, typography}) => ({
  modal: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {},
  modalContent: {
    width: 800,
    borderRadius: spacing[24],
    backgroundColor: hrmangoColors.white
  },
  mainHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: hrmangoColors.menuBar,
    borderTopRightRadius: spacing[24],
    borderTopLeftRadius: spacing[24]
  },
  headerText: {
    ...typography.h5,
    padding: `${spacing[16]}px ${spacing[24]}px`,
    color: hrmangoColors.grey,
    textTransform: 'capitalize'
  },
  closeIcon: {
    color: hrmangoColors.dark
  },
  subHeaderText: {
    //...hrmangoTypography.button,
    //fontWeight: typography.fontWeightRegular,
    color: hrmangoColors.onSurfaceLight.highEmphasis,
    marginTop: spacing[8],
    wordBreak: 'break-word'
  }
}))

const HRModal = ({onClose, open, header, subHeader, children}: ModalType) => {
  const classes = useStyles()

  return (
    <Modal className={classes.modal} open={open} onClose={onClose} disableEscapeKeyDown={false}>
      <div className={classes.modalContent}>
        <div className={classes.header}>
          <div className={classes.mainHeader}>
            <Typography className={classes.headerText}>{header}</Typography>
            <IconButton aria-label='close' size='small' onClick={onClose}>
              <ClearIcon fontSize='small' className={classes.closeIcon} />
            </IconButton>
          </div>
          <Typography className={classes.subHeaderText}>{subHeader}</Typography>
        </div>
        <div style={{overflow: 'auto', maxHeight: 600}}>{children}</div>
      </div>
    </Modal>
  )
}

export default HRModal
