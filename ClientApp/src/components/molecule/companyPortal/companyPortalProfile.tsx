import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {Box, Container, TextField, MenuItem, Button, Modal} from '@material-ui/core'

import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, hrmangoColors, typography} from 'lib/hrmangoTheme'
import {Company, HiringManager} from 'graphql/types.generated'
import {Territory} from 'type/company/companyEnums'
import {LocationState} from 'type'
import {setToast, setSpinner} from 'store/action/globalActions'
import {ErrorMessages} from 'type/errorMessage'
import {create, updateCompanyProfile} from 'api/companyApi'
import {getProfileInfo} from 'api/authApi'
import {Save} from '@material-ui/icons'
import CurrentUserCache from 'lib/utility/currentUser'
import {useGetHiringManagersQuery} from 'graphql/Company/GetHiringManagersQuery.generated'
import {useGetCompanyByIdQuery} from 'graphql/Company/Queries/GetCompanyByIdQuery.generated'
import {DropzoneArea} from 'material-ui-dropzone'
import {addExternalImage} from 'api/documentsApi'
import React from 'react'
import InputMask from 'react-input-mask'
import {User} from 'type/user/user'

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
  documentImage: {
    fileName: '',
    blobPath: '',
    blobName: '',
    fileType: '',
    fileSize: ''
  },
  primaryContactInfo: {
    id: 0,
    addressLine1: '',
    phone: '',
    addressLine2: '',
    email: '',
    wesite: '',
    contactName: '',
    primaryPhone: '',
    zipCode: '',
    city: '',
    state: '',
    country: 'United States'
  }
}

const CompanyPortalProfile = withRouter(
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
      },
      dropzone: {
        backgroundColor: hrmangoColors.white,
        minHeight: '50px',
        '& .MuiTypography-h5': {
          ...typography.body1
        }
      }
    }))
    let currentUser: number | undefined = 0 ?? 0

    currentUser = CurrentUserCache?.userId!
    const [inputValue, setInputValue] = useState({
      companyId: ''
    })
    const companyId = inputValue.companyId
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
      getProfileInfo()
        .then((response: User) => {
          setInputValue({
            ...inputValue,
            companyId: response.companyId!
          })
        })
        .catch((error: Error) => {})
        .finally(() => {})
    }, []) // eslint-disable-line
    const classes = useStyles()
    const dispatch = useDispatch()
    const [company, setCompany] = useState<Company>(defaultCompany)
    const [owner, setOwner] = useState<HiringManager[] | null | undefined>()

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
      backgroundInformation: false,
      address1: false,
      workPhone: false,
      address2: false,
      email: false,
      website: false,
      city: false,
      state: false,
      contactName: false,
      zipCode: false,
      primaryTelephone: false
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
      backgroundInformationError: 'Please enter a valid Background Information',
      address1Error: 'Please enter a valid address',
      workPhoneError: 'Please enter a phone',
      address2Error: 'Please enter a valid address',
      emailError: 'Please enter a valid email',
      websiteError: 'Please enter a valid email',
      cityError: 'Please enter a valid city',
      stateError: 'Please enter a valid state',
      contactNameError: 'Please enter a valid contact',
      zipCodeError: 'Please enter a valid zipcode',
      primaryTelephoneError: 'Please enter a valid phone',
      territoryError: 'Please enter a valid Territory'
    })
    const createCompany = useMutation(
      (companyId: any) => (companyId !== 0 ? updateCompanyProfile(companyId, company) : create({...company})),
      {
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

          let backgroundInformationError = {text: '', error: false}

          let address1Error = {text: '', error: false}
          let workPhoneError = {text: '', error: false}
          let address2Error = {text: '', error: false}
          let emailError = {text: '', error: false}
          let websiteError = {text: '', error: false}
          let cityError = {text: '', error: false}
          let stateError = {text: '', error: false}
          let contactNameError = {text: '', error: false}
          let zipCodeError = {text: '', error: false}
          let primaryTelephoneError = {text: '', error: false}
          let territoryError = {text: '', error: false}

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

            if (fieldMessage.fieldId === 'backgroundInformation') {
              backgroundInformationError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'address1') {
              address1Error = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'workPhone') {
              workPhoneError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'address2') {
              address2Error = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'email') {
              emailError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'website') {
              websiteError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'city') {
              cityError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'state') {
              stateError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'contactName') {
              contactNameError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'zipCode') {
              zipCodeError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'primaryTelephone') {
              primaryTelephoneError = {text: fieldMessage.message, error: true}
            }
            if (fieldMessage.fieldId === 'territory') {
              territoryError = {text: fieldMessage.message, error: true}
            }
          })

          setErrorText({
            address1Error: address1Error.text,
            workPhoneError: workPhoneError.text,
            address2Error: address2Error.text,
            emailError: emailError.text,
            websiteError: websiteError.text,
            cityError: cityError.text,
            stateError: stateError.text,
            contactNameError: contactNameError.text,
            zipCodeError: zipCodeError.text,
            primaryTelephoneError: primaryTelephoneError.text,
            territoryError: territoryError.text,
            companyNameError: companyNameError.text,
            parentCompanyError: parentCompanyError.text,
            companyTypeError: companyTypeError.text,
            companyRankError: companyRankError.text,
            companyVerticalError: companyVerticalError.text,
            companySourceError: companySourceError.text,
            companyOwnerError: companyOwnerError.text,
            departmentError: departmentError.text,
            internalReferenceError: internalReferenceError.text,
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
            backgroundInformation: backgroundInformationError.error,
            address1: address1Error.error,
            workPhone: workPhoneError.error,
            address2: address2Error.error,
            email: emailError.error,
            website: websiteError.error,
            city: cityError.error,
            state: stateError.error,
            contactName: contactNameError.error,
            zipCode: zipCodeError.error,
            primaryTelephone: primaryTelephoneError.error,
            territory: territoryError.error
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
          })
        },
        retry: 0
      }
    )

    useEffect(() => {
      if (companyId) refetch()

      // eslint-disable-next-line
    }, [companyId])

    useEffect(() => {
      dispatch(setSpinner(isFetching))
      // eslint-disable-next-line
    }, [isFetching])

    useEffect(() => {
      if (data && companyId) {
        setCompany({...data?.companyById, id: parseInt(companyId)})
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

    const saveFile = useMutation(
      ({item, event, company}: any) =>
        addExternalImage({
          fileName: item.name,
          fileContents: event.target.result.replace(/^.+?(;base64),/, ''),
          fileType: item.type,
          fileSize: String(item.size),
          entityId: company.companyId,
          entityName: company.email,
          userId: company.companyId
        }),
      {
        onMutate: () => {
          dispatch(setSpinner(true))
        },
        onError: (error) => {
          dispatch(setSpinner(false))
          dispatch(
            setToast({
              message: `Error uploading the file`,
              type: 'error'
            })
          )
        },
        onSuccess: (data: any) => {
          dispatch(setSpinner(false))
          data.json().then((document) => {
            setCompany({
              ...company!,
              userImageUrl: document.avatarUrl
            })
          })
        },
        retry: 0
      }
    )

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4
    }
    const imageProfile =
      company?.companyImageUrl?.replace('avatar.svg', 'https://via.placeholder.com/150') ??
      'https://via.placeholder.com/150'
    const profileValue = !company?.companyImageUrl ? 'Please upload your profile picture' || 'avatar.svg ' : ' '
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <div id='modal-modal-title'>
              <Box className={classes.rowHeader}>Attachment Information</Box>
            </div>
            <div id='modal-modal-description'>
              <Container style={{paddingTop: spacing[48]}}>
                <Box className={classes.row}>
                  <DropzoneArea
                    showPreviews={false}
                    maxFileSize={26214400}
                    filesLimit={1}
                    acceptedFiles={['image/*']}
                    dropzoneText={'Drag and drop an image here or click'}
                    dropzoneClass={classes.dropzone}
                    onDrop={(fileObjects) => {
                      fileObjects.forEach((item) => {
                        const reader = new FileReader()
                        reader.onloadend = (event: any) => {
                          if (event.target.readyState === FileReader.DONE) {
                            saveFile.mutate({item, event, company})
                          }
                        }
                        reader.readAsDataURL(item)
                      })
                    }}
                  />
                </Box>
              </Container>
            </div>
          </Box>
        </Modal>
        <Container>
          <Box className={classes.rowHeader}>Company Details</Box>
          <br></br>
          <br></br>
          <Box className={classes.row}>
            <img src={imageProfile ?? 'https://via.placeholder.com/150'} alt='Avatar' height={150} width={150} />

            <Button
              onClick={handleOpen}
              style={{height: '20px', paddingLeft: '40px', marginTop: '100px', cursor: 'pointer', color: '#0091D0'}}
            >
              Edit Picture
            </Button>
            <div style={{color: '#B00020', fontSize: '14px', marginTop: '100px'}}>{profileValue}</div>
          </Box>
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
          <br></br>
          <br></br>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 1}}
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
              inputProps={{tabIndex: 2}}
              className={classes.textField}
              id='companyOwner'
              label='Main Company Contact'
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
          </Box>
        </Container>
        <br />
        <br />
        <Container>
          <Box className={classes.rowHeader}>Address and contact information</Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 3}}
              className={classes.textField}
              id='Address'
              label='Address Line 1'
              onBlur={() => {
                setIsError({
                  ...isError,
                  address1: !company.primaryContactInfo?.addressLine1?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={company?.primaryContactInfo?.addressLine1}
              error={isError.address1}
              onChange={(e: any) => {
                setCompany({
                  ...company!,
                  primaryContactInfo: {...company.primaryContactInfo, addressLine1: e.target.value}
                })
              }}
              fullWidth
              helperText={isError.address1 ? errorText.address1Error : ''}
            />

            <Box className={classes.rowSpace} />
            <InputMask
              value={company?.primaryContactInfo?.phone}
              onChange={(e: any) => {
                e.target.value.length < 257 &&
                  setCompany({
                    ...company,
                    primaryContactInfo: {...company.primaryContactInfo, phone: e.target.value}
                  })
              }}
              onBlur={() => {
                setIsError({
                  ...isError,
                  workPhone: !company?.primaryContactInfo?.phone?.replace(/\s+/g, '').length
                })
              }}
              mask='(999) 999-9999'
            >
              <TextField
                inputProps={{tabIndex: 4}}
                className={classes.textField}
                id='cellPhone'
                label='Phone'
                margin='normal'
                variant='outlined'
                error={isError.workPhone}
                fullWidth
                helperText={isError.workPhone ? errorText.workPhoneError : ''}
              />
            </InputMask>
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 5}}
              className={classes.textField}
              id='Address'
              label='Address Line 2'
              onBlur={() => {
                setIsError({
                  ...isError,
                  address1: !company.primaryContactInfo?.addressLine2?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={company?.primaryContactInfo?.addressLine2}
              error={isError.address2}
              onChange={(e: any) => {
                setCompany({
                  ...company!,
                  primaryContactInfo: {...company.primaryContactInfo, addressLine2: e.target.value}
                })
              }}
              fullWidth
              helperText={isError.address2 ? errorText.address2Error : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: 6}}
              required
              className={classes.textField}
              id='email'
              label='Email'
              margin='normal'
              variant='outlined'
              value={company?.primaryContactInfo?.email}
              error={isError.email}
              onChange={(e: any) => {
                setCompany({...company!, primaryContactInfo: {...company.primaryContactInfo, email: e.target.value}})
              }}
              fullWidth
              helperText={isError.email ? errorText.emailError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 7}}
              className={classes.textField}
              id='City'
              label='City'
              onBlur={() => {
                setIsError({
                  ...isError,
                  city: !company.primaryContactInfo?.city?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={company?.primaryContactInfo?.city}
              error={isError.city}
              onChange={(e: any) => {
                setCompany({...company!, primaryContactInfo: {...company.primaryContactInfo, city: e.target.value}})
              }}
              fullWidth
              helperText={isError.city ? errorText.cityError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: 8}}
              className={classes.textField}
              id='website'
              label='Website'
              margin='normal'
              variant='outlined'
              value={company?.primaryContactInfo?.website}
              error={isError.website}
              onChange={(e: any) => {
                setCompany({...company!, primaryContactInfo: {...company.primaryContactInfo, website: e.target.value}})
              }}
              fullWidth
              helperText={isError.website ? errorText.websiteError : ''}
            />
          </Box>
          <Box className={classes.row}></Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 9}}
              className={classes.textField}
              id='State'
              label='State'
              onBlur={() => {
                setIsError({
                  ...isError,
                  state: !company.primaryContactInfo?.state?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={company?.primaryContactInfo?.state}
              error={isError.state}
              onChange={(e: any) => {
                setCompany({...company!, primaryContactInfo: {...company.primaryContactInfo, state: e.target.value}})
              }}
              fullWidth
              helperText={isError.state ? errorText.stateError : ''}
            />
            <Box className={classes.rowSpace} />
            <TextField
              inputProps={{tabIndex: 10}}
              required
              className={classes.textField}
              id='contactName'
              label='Primary Contact'
              margin='normal'
              variant='outlined'
              value={company?.primaryContactInfo?.contactName}
              error={isError.contactName}
              onChange={(e: any) => {
                setCompany({
                  ...company!,
                  primaryContactInfo: {...company.primaryContactInfo, contactName: e.target.value}
                })
              }}
              fullWidth
              helperText={isError.contactName ? errorText.contactNameError : ''}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              inputProps={{tabIndex: 11}}
              className={classes.textField}
              id='ZipCode'
              label='Zip Code'
              onBlur={() => {
                setIsError({
                  ...isError,
                  zipCode: !company.primaryContactInfo?.zipCode?.replace(/\s+/g, '').length
                })
              }}
              margin='normal'
              variant='outlined'
              value={company?.primaryContactInfo?.zipCode}
              error={isError.zipCode}
              onChange={(e: any) => {
                setCompany({...company!, primaryContactInfo: {...company.primaryContactInfo, zipCode: e.target.value}})
              }}
              fullWidth
              helperText={isError.zipCode ? errorText.zipCodeError : ''}
            />
            <Box className={classes.rowSpace} />
            <InputMask
              value={company?.primaryContactInfo?.primaryPhone}
              onChange={(e: any) => {
                e.target.value.length < 257 &&
                  setCompany({
                    ...company,
                    primaryContactInfo: {...company.primaryContactInfo, primaryPhone: e.target.value}
                  })
              }}
              mask='(999) 999-9999'
            >
              <TextField
                required
                inputProps={{tabIndex: 12}}
                className={classes.textField}
                id='cellPhone'
                label='Primary Telephone'
                value={company?.primaryContactInfo?.primaryPhone}
                margin='normal'
                variant='outlined'
                error={isError.workPhone}
                fullWidth
                helperText={isError.workPhone ? errorText.workPhoneError : ''}
              />
            </InputMask>
          </Box>

          <Box className={classes.row}>
            <TextField
              className={classes.textField}
              inputProps={{tabIndex: 13}}
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
                email: !company.primaryContactInfo?.email?.replace(/\s+/g, '').length,
                contactName: !company.primaryContactInfo?.phone?.replace(/\s+/g, '').length,
                primaryTelephone: !company.primaryContactInfo?.primaryPhone?.replace(/\s+/g, '').length,
                workPhone: !company.primaryContactInfo?.phone?.replace(/\s+/g, '').length
              })
              if (company.companyName?.replace(/\s+/g, '').length && company.companyType?.replace(/\s+/g, '').length) {
                createCompany.mutate(company.id)
                Object.assign(company, {newKey: company['companyId']})
              }
            }}
          >
            <Save fontSize='small' color='inherit' /> Save
          </Button>
        </Box>
      </div>
    )
  }
)

export {CompanyPortalProfile}
