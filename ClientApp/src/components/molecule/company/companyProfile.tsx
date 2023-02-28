import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {Box, Container, TextField, MenuItem, Button} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, hrmangoColors, typography} from 'lib/hrmangoTheme'
import {Company, HiringManager, CompanyVertical} from 'graphql/types.generated'
import {CompanyType, CompanyRank, CompanySource, Territory} from 'type/company/companyEnums'
import {LocationState} from 'type'
import {setToast, setSpinner} from 'store/action/globalActions'
import {ErrorMessages} from 'type/errorMessage'
import {create, update, addCompanyVertical} from 'api/companyApi'
import {Save} from '@material-ui/icons'
import {routes} from 'router'
import CurrentUserCache from 'lib/utility/currentUser'
import {useGetHiringManagersQuery} from 'graphql/Company/GetHiringManagersQuery.generated'
import {useGetCompanyByIdQuery} from 'graphql/Company/Queries/GetCompanyByIdQuery.generated'
import HRModal from 'components/page/shared/modal'
import {useGetCompanyVerticalQuery} from 'graphql/Company/GetCompanyVerticalQuery.generated'

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
  backgroundInformation: ''
}

const CompanyProfile = withRouter(
  ({match, location, history}: RouteComponentProps<{companyId: string}, StaticContext, LocationState>) => {
    const useStyles = makeStyles((theme: Theme) => ({
      rowHeader: {
        ...typography.h6
      },
      row: {
        display: 'flex',
        //justifyContent: 'center',
        paddingLeft: spacing[48],
        paddingRight: spacing[48],
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px'
        }
      },
      rowSpace: {
        padding: spacing[32]
      },
      textField: {
        '& .MuiFilledInput-input': {
          padding: '16px 13px'
        }
      },
      spinner: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
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
      buttonDense: {
        ...typography.buttonDense,
        textTransform: 'capitalize',
        padding: `${spacing[10]}px ${spacing[16]}px`,
        margin: spacing[12]
      },
      button: {
        ...typography.buttonGreen,
        textTransform: 'capitalize'
      },
      menuItem: {
        '&:focus': {
          '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: hrmangoColors.lightGray
          }
        }
      }
    }))

    const classes = useStyles()
    const dispatch = useDispatch()
    const [company, setCompany] = useState<Company>(defaultCompany)
    const [owner, setOwner] = useState<HiringManager[] | null | undefined>()
    const [companyVertical, setCompanyVertical] = useState<CompanyVertical[]>()
    const companyId = match.params.companyId ?? 0
    let currentUser: number | undefined = 0 ?? 0
    currentUser = CurrentUserCache?.userId!
    const [isError, setIsError] = useState({
      companyName: false,
      parentCompany: false,
      companyType: false,
      companyRank: false,
      companyVertical: false,
      companySource: false,
      companyOwner: false,
      department: false,
      internalReference: false,
      territory: false,
      backgroundInformation: false
    })
    const [errorText, setErrorText] = useState({
      companyNameError: 'Please enter a valid Company Name',
      parentCompanyError: 'Please enter a valid Parent Company',
      companyTypeError: 'Please enter a valid Company Type',
      companyRankError: 'Please enter a valid Company Rank',
      companyVerticalError: 'Please enter a valid Company Vertical',
      companySourceError: 'Please enter a valid Company Source',
      companyOwnerError: 'Please enter a valid HRmango Account Manager',
      departmentError: 'Please enter a valid Department',
      internalReferenceError: 'Please enter a valid reference',
      territoryError: 'Please enter a valid Territory',
      backgroundInformationError: 'Please enter a valid Background Information'
    })
    const createCompany = useMutation((id: any) => (id !== 0 ? update(id, company) : create({...company})), {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error: ErrorMessages) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Error saving the company`,
            type: 'error'
          })
        )

        let companyNameError = {text: '', error: false}
        let parentCompanyError = {text: '', error: false}
        let companyTypeError = {text: '', error: false}
        let companyRankError = {text: '', error: false}
        let companyVerticalError = {text: '', error: false}
        let companySourceError = {text: '', error: false}
        let companyOwnerError = {text: '', error: false}
        let departmentError = {text: '', error: false}
        let internalReferenceError = {text: '', error: false}
        let territoryError = {text: '', error: false}
        let backgroundInformationError = {text: '', error: false}

        error?.fieldMessages.forEach((fieldMessage) => {
          if (fieldMessage.fieldId === 'companyName') {
            companyNameError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'parentCompany') {
            parentCompanyError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'companyType') {
            companyTypeError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'companyRank') {
            companyRankError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'companyVertical') {
            companyVerticalError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'companySource') {
            companySourceError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'companyOwner') {
            companyOwnerError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'department') {
            departmentError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'internalReference') {
            internalReferenceError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'territory') {
            territoryError = {text: fieldMessage.message, error: true}
          }
          if (fieldMessage.fieldId === 'backgroundInformation') {
            backgroundInformationError = {text: fieldMessage.message, error: true}
          }
        })

        setErrorText({
          companyNameError: companyNameError.text,
          parentCompanyError: parentCompanyError.text,
          companyTypeError: companyTypeError.text,
          companyRankError: companyRankError.text,
          companyVerticalError: companyVerticalError.text,
          companySourceError: companySourceError.text,
          companyOwnerError: companyOwnerError.text,
          departmentError: departmentError.text,
          internalReferenceError: internalReferenceError.text,
          territoryError: territoryError.text,
          backgroundInformationError: backgroundInformationError.text
        })
        setIsError({
          companyName: companyNameError.error,
          parentCompany: parentCompanyError.error,
          companyType: companyTypeError.error,
          companyRank: companyRankError.error,
          companyVertical: companyVerticalError.error,
          companySource: companySourceError.error,
          companyOwner: companyOwnerError.error,
          department: departmentError.error,
          internalReference: internalReferenceError.error,
          territory: territoryError.error,
          backgroundInformation: backgroundInformationError.error
        })
      },
      onSuccess: (data: any) => {
        dispatch(setSpinner(false))
        data.json().then((company) => {
          dispatch(
            setToast({
              message: `Company ${company.companyName} successfully saving`,
              type: 'success'
            })
          )

          history.push(`${routes.CompanyDetail}/${company.id}`, {
            header: {
              title: company.companyName,
              owner: company.companyOwner,
              type: company.companyType,
              color: location && location.state && location.state.header?.color
            },
            backUrl: history.location.state.backUrl,
            backState: history.location.state.backState
          })
        })
      },
      retry: 0
    })

    const {data, isSuccess, isFetching, refetch} = useGetCompanyByIdQuery(
      {
        companyId: parseInt(companyId),
        // @ts-ignore: Argument of type 'string' is not assignable to parameter of type 'number'.
        userId: parseInt(currentUser)
      },
      {
        enabled: false
      }
    )

    useEffect(() => {
      if (companyId) refetch()
      verticalRefetch()
      // eslint-disable-next-line
    }, [companyId])

    //useEffect(() => {
    //console.log('Current User: ' + currentUser)
    //if (currentUser)
    //refetch()
    // eslint-disable-next-line
    //}, [currentUser])

    useEffect(() => {
      dispatch(setSpinner(isFetching))
      // eslint-disable-next-line
    }, [isFetching])

    useEffect(() => {
      if (data) {
        setCompany({...data?.companyById, id: parseInt(match.params.companyId)})
      }
      // eslint-disable-next-line
    }, [data?.companyById, isSuccess])

    const {data: ownerData, isSuccess: ownerIsSuccess} = useGetHiringManagersQuery({skip: 0, take: 50})

    useEffect(() => {
      if (ownerData) {
        setOwner(ownerData?.hiringManagers?.items)
      }
      // eslint-disable-next-line
    }, [ownerData?.hiringManagers, ownerIsSuccess])

    const {data: verticalData, isSuccess: verticalIsSuccess, refetch: verticalRefetch} = useGetCompanyVerticalQuery(
      {},
      {
        enabled: false
      }
    )

    useEffect(() => {
      if (verticalData) {
        if (verticalData?.companyVertical?.items?.find((e) => e.vertical === 'Other') === undefined)
          verticalData?.companyVertical?.items?.push({vertical: 'Other'})
        setCompanyVertical(verticalData?.companyVertical?.items!)
      }
      // eslint-disable-next-line
    }, [verticalData?.companyVertical, verticalIsSuccess])

    const [companyVerticalModalOpen, setCompanyVerticalModalOpen] = useState(false)

    return (
      <div>
        <Container>
          <Box className={classes.rowHeader}>Company Details</Box>
          <Box className={classes.row}>
            <TextField
              required
              className={classes.textField}
              id='companyName'
              label='Company Name'
              margin='normal'
              variant='outlined'
              value={company?.companyName}
              error={isError.companyName}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCompany({...company!, companyName: e.target.value})
              }}
              fullWidth
              helperText={isError.companyName ? errorText.companyNameError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              id='parentCompany'
              inputProps={{tabIndex: -1}}
              label='Parent Company'
              margin='normal'
              variant='outlined'
              value={company.parentCompany ?? undefined}
              error={isError.parentCompany}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCompany({...company!, parentCompany: e.target.value})
              }}
              fullWidth
              helperText={isError.parentCompany ? errorText.parentCompanyError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              required
              className={classes.textField}
              id='companyType'
              label='Company Type'
              margin='normal'
              variant='outlined'
              value={company?.companyType}
              error={isError.companyType}
              onChange={(e: any) => {
                setCompany({...company!, companyType: e.target.value.toString()})
              }}
              fullWidth
              select
              helperText={isError.companyType ? errorText.companyTypeError : ''}
            >
              {CompanyType.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='companyRank'
              label='Company Rank'
              margin='normal'
              variant='outlined'
              value={company.companyRank ?? undefined}
              error={isError.companyRank}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCompany({...company!, companyRank: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.companyRank ? errorText.companyRankError : ''}
            >
              {CompanyRank.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box className={classes.row}>
            <Autocomplete
              id='companyVertical'
              freeSolo
              options={companyVertical ?? []}
              getOptionLabel={(option) => option?.vertical ?? ''}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  className={classes.textField}
                  label='Company Vertical'
                  margin='normal'
                  variant='outlined'
                  error={isError.companyVertical}
                  helperText={isError.companyVertical ? errorText.companyVerticalError : ''}
                />
              )}
              fullWidth
              inputValue={company?.companyVertical ?? ''}
              onInputChange={(e: any, select: any) => {
                select === 'Other' && setCompanyVerticalModalOpen(true)
                select?.length < 257 &&
                  setCompany({
                    ...company!,
                    companyVertical: select
                  })
              }}
            />
            <Box className={classes.rowSpace} />
            <TextField
              required
              className={classes.textField}
              id='companySource'
              label='Company Source'
              margin='normal'
              variant='outlined'
              value={company?.companySource}
              error={isError.companySource}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCompany({...company!, companySource: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.companySource ? errorText.companySourceError : ''}
            >
              {CompanySource.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box className={classes.row}>
            <TextField
              required
              className={classes.textField}
              id='companyOwner'
              label='HRmango Account Manager'
              margin='normal'
              variant='outlined'
              value={company?.companyOwner ?? CurrentUserCache?.userName ?? ''}
              error={isError.companyOwner}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCompany({...company!, companyOwner: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.companyOwner ? errorText.companyOwnerError : ''}
            >
              <MenuItem value=''>
                <b>
                  <em>Select the Job OwnerShip *</em>
                </b>
              </MenuItem>
              {owner?.map((option) => (
                <MenuItem key={option.hiringManagerName} value={option.hiringManagerName} className={classes.menuItem}>
                  {option.hiringManagerName}
                </MenuItem>
              ))}
            </TextField>
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='department'
              label='Department'
              margin='normal'
              variant='outlined'
              value={company.department ?? undefined}
              error={isError.department}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCompany({...company!, department: e.target.value})
              }}
              fullWidth
              helperText={isError.department ? errorText.departmentError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='internalReference'
              label='Internal Reference'
              margin='normal'
              variant='outlined'
              value={company.internalReference ?? undefined}
              error={isError.internalReference}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCompany({...company!, internalReference: e.target.value})
              }}
              fullWidth
              helperText={isError.internalReference ? errorText.internalReferenceError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='territory'
              label='Territory'
              margin='normal'
              variant='outlined'
              value={company.territory ?? undefined}
              error={isError.territory}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCompany({...company!, territory: e.target.value})
              }}
              fullWidth
              select
              helperText={isError.territory ? errorText.territoryError : ''}
            >
              {Territory.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Container>
        <Container style={{paddingTop: spacing[48]}}>
          <Box className={classes.rowHeader}>Background Information</Box>
          <Box className={classes.row}>
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='backgroundInformation'
              label='Background Information'
              margin='normal'
              variant='outlined'
              value={company.backgroundInformation ?? undefined}
              error={isError.backgroundInformation}
              onChange={(e: any) => {
                setCompany({...company!, backgroundInformation: e.target.value})
              }}
              fullWidth
              multiline={true}
              minRows={5}
              helperText={isError.backgroundInformation ? errorText.backgroundInformationError : ''}
            />
          </Box>
        </Container>
        <Box style={{display: 'flex', justifyContent: 'end', margin: `${spacing[24]}px`}}>
          <Button
            size='large'
            type='submit'
            variant='contained'
            className={classes.button}
            onClick={() => {
              setIsError({
                ...isError,
                companyName: !company.companyName?.replace(/\s+/g, '').length,
                companyType: !company.companyType?.replace(/\s+/g, '').length,
                companyVertical: !company.companyVertical?.replace(/\s+/g, '').length,
                companySource: !company.companySource?.replace(/\s+/g, '').length,
                companyOwner: !company.companyOwner?.replace(/\s+/g, '').length
              })
              if (
                company.companyName?.replace(/\s+/g, '').length &&
                company.companyType?.replace(/\s+/g, '').length &&
                company.companyVertical?.replace(/\s+/g, '').length &&
                company.companySource?.replace(/\s+/g, '').length &&
                company.companyOwner?.replace(/\s+/g, '').length
              ) {
                createCompany.mutate(company.id)
              }
            }}
          >
            <Save fontSize='small' color='inherit' /> Save
          </Button>
        </Box>
        <HRModal
          header='Other Company Vertical'
          open={companyVerticalModalOpen}
          onClose={() => setCompanyVerticalModalOpen(false)}
        >
          <div className={classes.content}>
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: -1}}
              id='companyVertical'
              label='Company Vertical'
              margin='normal'
              variant='outlined'
              value={undefined}
              error={isError.companyVertical}
              onChange={(e: any) => {
                e.target.value.length < 257 && setCompany({...company!, companyVertical: e.target.value})
              }}
              fullWidth
              helperText={isError.companyVertical ? errorText.companyVerticalError : ''}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'end'}}>
            <Button
              color='secondary'
              onClick={() => {
                addCompanyVertical(company?.companyVertical ?? '')
                setCompanyVerticalModalOpen(false)
                return () => {
                  verticalRefetch()
                }
              }}
              className={classes.buttonDense}
            >
              Done
            </Button>
          </div>
        </HRModal>
      </div>
    )
  }
)

export {CompanyProfile}
