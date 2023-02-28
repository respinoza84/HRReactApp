import {Box, Button, Link} from '@material-ui/core'
import {useDispatch} from 'react-redux'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {hrmangoColors, spacing} from 'lib/hrmangoTheme'
import {setToast} from 'store/action/globalActions'
import backgroundImage from 'images/beach.jpg'
import LogoIcon from 'lib/atom/icons/logoIcon/logoIcon'
import {LinkRounded, Facebook, Twitter, LinkedIn} from '@material-ui/icons'
import {getHRMangoUrl} from 'lib/utility'

export type ExternalHeaderType = {
  id?: number
  title?: string
  subTitle?: string
  description?: string
  isDetailed?: boolean
  onClick?: () => void
}

const ExternalHeader = ({id, title, subTitle, description, isDetailed, onClick}: ExternalHeaderType) => {
  const useStyles = makeStyles((theme: Theme) => ({
    headerContainer: {
      //backgroundImage: 'linear-gradient(0deg, #00000000 0%, #000000BC 100%)',
      background: `url(${backgroundImage}) padding-box`,
      backgroundRepeat: 'round',
      //width: '1920px',
      height: '450px',
      padding: spacing[40],
      position: 'relative'
    },
    headerText: {
      float: 'none',
      textAlign: 'center',
      //padding: '5.5rem 0 3rem',
      minHeight: 'auto',
      color: hrmangoColors.white,
      position: 'relative'
    },
    headerSubTitle: {
      fontSize: '2.2rem',
      lineHeight: '1.1',
      fontWeight: 500,
      marginBottom: spacing[16]
    },
    headerDescription: {
      fontSize: '1rem',
      lineHeight: '1.3rem',
      fontWeight: 400,
      padding: '0 5rem 0 5rem',
      marginBottom: spacing[16]
    },
    headerTitle: {
      fontSize: '1.125rem',
      lineHeight: '1.5',
      fontWeight: 500,
      marginBottom: spacing[10]
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'end',
      paddingTop: 8,
      position: 'relative'
    },
    headerIcon: {
      marginRight: spacing[12],
      display: 'flex',
      alignItems: 'center',
      color: hrmangoColors.white
    },
    logoText: {
      paddingLeft: spacing[8],
      fontFamily: 'OpenSans-Bold, Open Sans',
      color: hrmangoColors.white,
      fontWeight: 400,
      fontSize: 18,
      lineHeight: 1.428,
      letterSpacing: '0.25px'
    },
    logoSubText: {
      display: 'flex',
      justifyContent: 'end',
      fontSize: 10
    },
    overlay: {
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      width: '100%',
      background: 'rgba(15, 26, 38, 0.5)',
      transition: 'all .3s ease-in-out'
      //backgroundColor: '#000000BC'
      //opacity: '0.3'
    },
    shared: {
      display: 'flex',
      listStyleType: 'none',
      justifyContent: 'center',
      padding: spacing[16]
    },
    space: {
      padding: spacing[16]
    }
  }))
  const classes = useStyles()
  const dispatch = useDispatch()
  return (
    <section className={classes.headerContainer}>
      <div className={classes.overlay}></div>
      <div className={classes.logoContainer}>
        <LogoIcon width='50.794' height='32' viewBox='0 0 50 32' />
        <Box className={classes.logoText}>
          <span>GateKeeper</span>
          <Box className={classes.logoSubText}>
            <span>by HRMango</span>
          </Box>
        </Box>
      </div>
      <div className={classes.headerText}>
        <p>
          <span className={classes.headerTitle}>{title}</span>
        </p>
        <p>
          <span className={classes.headerSubTitle}>{subTitle}</span>
        </p>
        <p>
          <span className={classes.headerDescription}>{description}</span>
        </p>
      </div>
      {isDetailed && (
        <div className={classes.headerText}>
          <div>
            <Button
              size='large'
              type='button'
              variant='contained'
              style={{cursor: 'pointer'}}
              onClick={() => {
                onClick && onClick()
              }}
            >
              I'm interested
            </Button>
          </div>
          <div>
            <ul className={classes.shared}>
              <li className={classes.space}>
                <Link
                  target={`_blank`}
                  href={`https://www.facebook.com/sharer/sharer.php?u=${getHRMangoUrl(`careers/jobDetail/${id}`)}`}
                >
                  <Facebook fontSize='small' color='inherit' style={{cursor: 'pointer', color: hrmangoColors.white}} />
                </Link>
              </li>
              <li className={classes.space}>
                <Link
                  target={`_blank`}
                  href={`https://twitter.com/intent/tweet?url=${getHRMangoUrl(`careers/jobDetail/${id}`)}`}
                >
                  <Twitter fontSize='small' color='inherit' style={{cursor: 'pointer', color: hrmangoColors.white}} />
                </Link>
              </li>
              <li className={classes.space}>
                <Link
                  target={`_blank`}
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${getHRMangoUrl(
                    `careers/jobDetail/${id}`
                  )}`}
                >
                  <LinkedIn fontSize='small' color='inherit' style={{cursor: 'pointer', color: hrmangoColors.white}} />
                </Link>
              </li>
              <li className={classes.space}>
                <Link
                  onClick={() => {
                    navigator.clipboard.writeText(getHRMangoUrl(`careers/jobDetail/${id}`))
                    dispatch(
                      setToast({
                        message: `Link copied successfully`,
                        type: 'success'
                      })
                    )
                  }}
                >
                  <LinkRounded
                    fontSize='small'
                    color='inherit'
                    style={{cursor: 'pointer', color: hrmangoColors.white}}
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}

export {ExternalHeader}
