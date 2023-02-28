/*
  @author Oliver Zamora
  @description Spinner component
    <Spinner show={showSpinner} wholePage={false} />
*/
import React from 'react'
import {makeStyles, CircularProgress, Box} from '@material-ui/core'

type SpinnerTypes = {
  show: boolean
  wholePage: boolean
  size: number
  height: number | string
  style?: React.CSSProperties
  transparent: boolean
  sidebarOffset?: boolean
}

export const Spinner = ({show, wholePage, size, height, transparent, sidebarOffset}: SpinnerTypes) => {
  const useStyles = makeStyles(({hrmangoColors}) => ({
    wholePage: {
      zIndex: 1,
      top: 0,
      left: sidebarOffset ? 100 : 0, // sidebar width to center page spinner in main container
      right: 0,
      bottom: 0,
      display: 'flex',
      position: 'fixed',
      alignItems: 'center',
      touchAction: 'none',
      justifyContent: 'center',
      backgroundColor: transparent ? '' : 'rgba(0, 0, 0, 0.5)',
      color: 'FFFFFF',
      '& svg': {
        height: size,
        width: size
      }
    },
    backdrop: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: height,
      '& svg': {
        height: size,
        width: size
      }
    },
    color: {
      color: 'FFFFFF'
    },
    size: {
      height: size,
      width: size
    }
  }))
  const classes = useStyles()

  const Progress = () => (
    <CircularProgress
      id='loading-spinner'
      style={{height: size, width: size}}
      classes={{colorPrimary: classes.color}}
    />
  )

  return (
    <>
      {wholePage
        ? show && (
            <Box className={classes.wholePage}>
              <Progress />
            </Box>
          )
        : show && (
            <Box className={classes.backdrop}>
              <Progress />
            </Box>
          )}
    </>
  )
}

Spinner.defaultProps = {
  show: true,
  wholePage: false,
  size: 36,
  height: 36,
  transparent: false,
  sidebarOffset: true
}
