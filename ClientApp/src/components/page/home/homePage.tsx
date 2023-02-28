import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {useState, useEffect} from 'react'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {Box, Button, Grid} from '@material-ui/core'
import background from '../../../images/beachBG.png'
import './homeStyle.css'
import {spacing, typography, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {useGetCandidateByUserIdQuery} from 'graphql/Candidates/Queries/GetCandidateByUserId.generated'
import {CompanyFilters} from 'type/company/companyFilters'
import ProgressBar from './progress-bar.component'
import {LocationState} from 'type'
import {getProfileInfo} from 'api/authApi'
import {companyDetails} from 'api/companyApi'
import {setToast} from 'store/action/globalActions'
import {useDispatch} from 'react-redux'
import {User} from 'type/user/user'
import {setSpinner} from 'store/action/globalActions'
import {Candidate, Company} from 'graphql/types.generated'
import CurrentUserCache from 'lib/utility/currentUser'
import {List} from '@material-ui/icons'
import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
//import {useMutation} from 'react-query'
//import {useMutation} from 'react-query'

export type HomeTableType = {
  loaded: boolean
  tableFilters?: CompanyFilters
}
const defaultCandidate = {
  id: 0,
  firstName: '',
  prefferedName: '',
  lastName: '',
  displayAs: '',
  department: '',
  owner: '',
  jobTitle: '',
  jobName: '',
  currentEmployer: '',
  source: '',
  status: '',
  email: '',
  cellPhone: '',
  workPhone: '',
  noticePeriod: '',
  summary: '',
  workType: '',
  timeZone: '',
  marketing: '',
  dateLastContacted: undefined,
  dateResumeSent: undefined,
  territory: '',
  byEmail: false,
  byPhone: false,
  byText: false,
  rigthToRepresent: false,
  privateRecord: true,
  errorCode: 0,
  errorMessage: '',
  percentComplete: ''
}
const defaultCompany = {
  id: 0,
  companyName: '',
  companyType: '',
  companyVertical: undefined,
  companyOwner: '',
  internalReference: '',
  parentCompany: '',
  companyRank: '',
  companySource: '',
  department: '',
  territory: '',
  backgroundInformation: '',
  applicantStageSummary: 0,
  offerStageSummary: 0,
  percentageCompleted: 0,
  preScreenStageSummary: 0,
  resumenSentStageSummary: 0,
  workingStageSummary: 0,
  email: ''
}
const HomePage = withRouter(
  ({
    match,
    history,
    location
  }: HomeTableType & RouteComponentProps<{userId: string; companyId: string}, StaticContext, LocationState>) => {
    const useStyles = makeStyles((theme: Theme) => ({
      editSectionProfile: {
        boxShadow: shadows[20],
        borderRadius: '16px',
        fontWeight: typography.fontWeightMedium,
        backgroundColor: hrmangoColors.white
      },
      container: {
        position: 'relative',
        padding: `${spacing[16]}px`,
        backgroundImage: `url(${background})`,
        height: spacing[240],
        marginTop: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '65%',
        borderRadius: '16px'
      },
      applicantContainer: {
        position: 'relative'
      },
      containerProfile: {
        position: 'relative',
        padding: `${spacing[12]}px`,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
      },
      button: {
        marginBottom: spacing[24],
        ...typography.editProfileButton,
        color: hrmangoColors.dark
      },
      profileBtn: {
        marginBottom: spacing[24],
        ...typography.editProfileButton,
        ...typography.Infobutton
      },
      ApplicantContent: {
        color: hrmangoColors.grey,
        borderRadius: '10px'
      },
      stageHeader: {
        backgroundColor: '#0091D0',
        color: hrmangoColors.white,
        //margin: spacing[8],
        display: 'inline-flex',
        padding: spacing[8],
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap',
        width: '150px',
        border: '2px solid ' + hrmangoColors.white,
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        ...typography.h7
      },
      content: {
        display: 'flex',
        justifyContent: 'end'
      },
      space: {
        margin: spacing[16],
        '& .MuiBox-root': {
          margin: spacing[16]
        }
      },
      item: {
        ...typography.body1,
        textTransform: 'capitalize',
        position: 'relative',
        left: '63px',
        fontSize: '30px',
        fontWeight: 'bold'
      },
      overline: {
        ...typography.overline
      },
      header: {
        display: 'flex',
        width: '167px',
        height: '100px',
        backgroundColor: '#F0F0F0',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px'
      }
    }))

    const [candidate, setCandidate] = useState<Candidate>(defaultCandidate)
    const [companySummary, setcompanySummary] = useState<Company>(defaultCompany)

    let currentUser: number | undefined = 0 ?? 0

    currentUser = CurrentUserCache?.userId!

    const userId = match.params.userId

    const {refetch, isFetching, data, isSuccess} = useGetCandidateByUserIdQuery(
      {
        // @ts-ignore: Argument of type 'string' is not assignable to parameter of type 'number'.
        userId: parseInt(currentUser)
      },
      {enabled: true}
    )
    useEffect(() => {
      if (userId) refetch()
      // eslint-disable-next-line
    }, [userId])

    useEffect(() => {
      dispatch(setSpinner(isFetching))
      // eslint-disable-next-line
    }, [isFetching])

    useEffect(() => {
      if (data) {
        setCandidate({
          percentageCompleted: data?.candidateByUserId.percentComplete,
          email: data?.candidateByUserId.email,
          userImageUrl: data?.candidateByUserId.userImageUrl,
          firstName: data?.candidateByUserId.firstName
        })
      }
      // eslint-disable-next-line
    }, [data?.candidateByUserId, isSuccess])

    const classes = useStyles()
    const dispatch = useDispatch()
    const [inputValue, setInputValue] = useState({
      firstName: '',
      lastName: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      companyId: ''
    })

    useEffect(() => {
      getProfileInfo()
        //.then((res: any) => res.json())
        .then((response: User) => {
          setInputValue({
            ...inputValue,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            companyId: response.companyId!
          })
        })
        .catch((error: Error) => {
          dispatch(
            setToast({
              message: `Something went wrong ${error}`,
              type: 'error'
            })
          )
        })
        .finally(() => {})
    }, []) // eslint-disable-line

    const profileValue = inputValue.firstName !== '' ? candidate.firstName : candidate.email
    const imageProfile =
      candidate?.userImageUrl?.replace('avatar.svg', 'https://via.placeholder.com/150') ??
      'https://via.placeholder.com/150'
    const companyId = inputValue.companyId

    useEffect(() => {
      companyDetails(companyId)
        .then((response: any) =>
          setcompanySummary({
            ...companySummary,
            id: parseInt(match.params.companyId),
            percentageCompleted: response?.percentComplete,
            email: response?.email,
            userImageUrl: response?.companyImageUrl,
            companyName: response?.companyName,
            applicantStageSummary: response?.applicantStageSummary,
            workingStageSummary: response?.workingStageSummary,
            resumenSentStageSummary: response?.resumenSentStageSummary,
            offerStageSummary: response?.offerStageSummary
          })
        )
        .catch((error: Error) => {
          console.log(error.message)
        })
        .finally(() => {})
    }, [companyId, isSuccess]) // eslint-disable-line

    const dataCompleted = [
      {
        bgcolor: '#0091D0',
        completed: (candidate.percentageCompleted || companySummary.percentageCompleted) ?? 0,
        key: 1
      }
    ]
    return (
      <div className={classes.container}>
        <div className='avatar'>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <div>
                <img src={imageProfile ?? 'https://via.placeholder.com/150'} alt='Avatar' height={150} width={150} />
              </div>
              <div className='applicantName'>
                <h2 className={classes.ApplicantContent}>{profileValue}</h2>
              </div>
              <div>
                <Button
                  className={classes.button}
                  onClick={() => {
                    {
                      isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Applicant]) && history.push('applicantDetail')
                    }
                    {
                      isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Company]) && history.push('CompanyProfile')
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className='rightContent'>
                "Genius is one percent inspiration and ninety-nine percent perspiration."
                <div className='quote'>
                  <b>Thomas Edison</b>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className={classes.editSectionProfile}>
          <div className={classes.containerProfile}>
            <div className='applicantStatus'>
              <div className='progress'>
                {dataCompleted.map((item, idx) => {
                  return <div key={idx}>{item.completed} %</div>
                })}
              </div>

              <Box sx={{width: '80%'}}>
                {dataCompleted.map((item, idx) => (
                  <ProgressBar key={idx} bgcolor={item.bgcolor} completed={item.completed} />
                ))}
              </Box>
              <div className='completeProfile'>We encourage you to complete your profile</div>
              <div className='completeProfile1'>
                So everybody knows how cool you are.<br></br>
                <br></br>
                <Button
                  className={classes.profileBtn}
                  onClick={() => {
                    {
                      isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Applicant]) && history.push('applicantDetail')
                    }
                    {
                      isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Company]) && history.push('CompanyProfile')
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Company]) && (
          <div className={classes.editSectionProfile}>
            <div className={classes.containerProfile}>
              <div className='applicantStatus'>
                <div className='completeProfile'>Applicants</div>
              </div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'inline-flex',
                  minWidth: '-webkit-fill-available',
                  marginTop: `${spacing[19]}px`,
                  marginLeft: '-15px'
                }}
              >
                <span className={classes.item}></span>
                <div key={`content-1`} className={classes.content}>
                  <Box key={`space-1`} className={classes.space} />
                  <div>
                    <div
                      style={{
                        backgroundColor: '#967ADC',
                        color: hrmangoColors.white,
                        //margin: spacing[8],
                        display: 'inline-flex',
                        padding: spacing[8],
                        flexDirection: 'row',
                        flex: 1,
                        flexWrap: 'wrap',
                        width: '150px',
                        border: '2px solid ' + hrmangoColors.white,
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        ...typography.h7
                      }}
                    >
                      <span>
                        <List fontSize='small' />
                      </span>{' '}
                      <span style={{paddingLeft: spacing[4]}}>Applicants</span>
                    </div>
                    <div className={classes.header}>
                      <div className='companySumary'>
                        <span className={classes.item}>{companySummary.applicantStageSummary}</span>
                      </div>

                      <span className={classes.overline}>
                        <title></title>
                      </span>
                    </div>
                  </div>
                </div>
                <div key={`content-2`} className={classes.content}>
                  <Box key={`space-2`} className={classes.space} />
                  <div>
                    <div className={classes.stageHeader}>
                      <span>
                        <List fontSize='small' />
                      </span>{' '}
                      <span style={{paddingLeft: spacing[4]}}>Pre - Screened</span>
                    </div>
                    <div className={classes.header}>
                      <div className='companySumary'>
                        <span className={classes.item}>{companySummary.workingStageSummary}</span>
                      </div>

                      <span className={classes.overline}>
                        <title>dss</title>
                      </span>
                    </div>
                  </div>
                </div>
                <div key={`content-3`} className={classes.content}>
                  <Box key={`space-3`} className={classes.space} />
                  <div>
                    <div
                      style={{
                        backgroundColor: '#5bc24c',
                        color: hrmangoColors.white,
                        //margin: spacing[8],
                        display: 'inline-flex',
                        padding: spacing[8],
                        flexDirection: 'row',
                        flex: 1,
                        flexWrap: 'wrap',
                        width: '150px',
                        border: '2px solid ' + hrmangoColors.white,
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        ...typography.h7
                      }}
                    >
                      <span>
                        <List fontSize='small' />
                      </span>{' '}
                      <span style={{paddingLeft: spacing[4]}}>Resume Sent</span>
                    </div>
                    <div className={classes.header}>
                      <div className='companySumary'>
                        <span className={classes.item}>{companySummary.resumenSentStageSummary}</span>
                      </div>

                      <span className={classes.overline}>
                        <title>dss</title>
                      </span>
                    </div>
                  </div>
                </div>
                <div key={`content-4`} className={classes.content}>
                  <Box key={`space-4`} className={classes.space} />
                  <div>
                    <div
                      style={{
                        backgroundColor: '#e9573f',
                        color: hrmangoColors.white,
                        //margin: spacing[8],
                        display: 'inline-flex',
                        padding: spacing[8],
                        flexDirection: 'row',
                        flex: 1,
                        flexWrap: 'wrap',
                        width: '150px',
                        border: '2px solid ' + hrmangoColors.white,
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        ...typography.h7
                      }}
                    >
                      <span>
                        <List fontSize='small' />
                      </span>{' '}
                      <span style={{paddingLeft: spacing[4]}}>Offer</span>
                    </div>
                    <div className={classes.header}>
                      <div className='companySumary'>
                        <span className={classes.item}>{companySummary.offerStageSummary}</span>
                      </div>

                      <span className={classes.overline}>
                        <title>dss</title>
                      </span>
                    </div>
                  </div>
                </div>
                <div key={`content-5`} className={classes.content}>
                  <Box key={`space-5`} className={classes.space} />
                  <div>
                    <div
                      style={{
                        backgroundColor: '#0091D0',
                        color: hrmangoColors.white,
                        //margin: spacing[8],
                        display: 'inline-flex',
                        padding: spacing[8],
                        flexDirection: 'row',
                        flex: 1,
                        flexWrap: 'wrap',
                        width: '150px',
                        border: '2px solid ' + hrmangoColors.white,
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        ...typography.h7
                      }}
                    >
                      <span>
                        <List fontSize='small' />
                      </span>{' '}
                      <span style={{paddingLeft: spacing[4]}}>Working</span>
                    </div>
                    <div className={classes.header}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span className={classes.item}>{companySummary.workingStageSummary}</span>
                      </div>

                      <span className={classes.overline}>
                        <title>dss</title>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

export {HomePage}
