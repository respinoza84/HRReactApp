import {Box, Button} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'

import {spacing, typography} from 'lib/hrmangoTheme'
import {Add} from '@material-ui/icons'

export type InfoHeaderProps = {
  color?: Location
  title?: Location
  entity?: string
  onClick?: () => void
}

const InfoHeader = ({color, title, entity, onClick}: InfoHeaderProps) => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: `${spacing[24]}px ${spacing[32]}px`,
      color: `${color}`,
      ...typography.h5
    },
    button: {
      textTransform: 'capitalize',
      ...typography.buttonGreen
    }
  }))
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Box>
        <label>{title}</label>
      </Box>
      {entity && entity !== 'Contact' ? (
        <Box>
          <Button size='large' type='submit' variant='contained' className={classes.button} onClick={onClick}>
            <Add fontSize='small' color='inherit' />
            Add {entity}
          </Button>
        </Box>
      ) : null}
    </div>
  )
}

export {InfoHeader}
