/*
  @author  Oliver Zamora
  @description Search Bar component
*/

import {useState, useEffect} from 'react'
import {makeStyles, IconButton, TextField, CircularProgress, Box, Link} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {Clear} from '@material-ui/icons'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {routes} from 'router'

import {spacing, hrmangoColors} from '../../hrmangoTheme'
import {useDebounce} from '../../utility/customHooks'
import {SearchResultSortInput, SortEnumType} from 'graphql/types.generated'
import {useGetSearchTermsAsyncQuery} from 'graphql/Search/Queries/GetSearchTermsQuery.generated'
import {LocationState} from 'type'
import currentUser from 'lib/utility/currentUser'
import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'

type SearchBarType = {
  setToggleSearchOff: () => void
  resetToasts?: any
  setToast?: any
}

export const SearchBar = withRouter(
  ({
    history,
    location,
    setToggleSearchOff,
    resetToasts,
    setToast
  }: RouteComponentProps<{}, StaticContext, LocationState> & SearchBarType) => {
    const [searchCalled, setSearchCalled] = useState<boolean>(false)
    const [listOpen, setListOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [options, setOptions] = useState<any>([])
    const [term, setTerm] = useState<string>('')
    const [selectedValue, setSelectedValue] = useState<any>({})

    const useStyles = makeStyles(({palette, typography, breakpoints, zIndex, shadows}: any) => ({
      autocomplete: {
        width: 257,
        '& .MuiAutocomplete-popper .MuiAutocomplete-popperDisablePortal': {
          overflowY: 'scroll'
        }
      },
      textField: {
        '& .MuiAutocomplete-inputRoot[class*="MuiInput-root"] .MuiAutocomplete-input:first-child': {
          padding: `14px ${spacing[16]}px`,
          marginRight: spacing[12],
          //marginTop: `${spacing[16]}px`,
          //marginBottom: `${spacing[16]}px`,
          borderRadius: 28,
          backgroundColor: 'rgba(255, 2555, 255, 0.3)',
          color: 'rgba(255, 2555, 255, 1)',
          fontSize: typography.fontSize
        },
        '& ::placeholder': {
          color: 'rgba(255, 2555, 255, 1)'
        }
      },
      groupName: {
        padding: `${spacing[16]}px ${spacing[0]}px`,
        ...typography.body1,
        listStyle: 'none',
        '& li': {
          fontWeight: typography.fontWeightMedium,
          color: hrmangoColors.blueGray
        }
      },
      subMenu: {
        listStyle: 'none',
        padding: spacing[0],
        ...typography.body1,
        '& li': {
          color: palette.text.blueGray,
          textTransform: 'capitalize',
          textAlign: 'left',
          fontWeight: typography.fontWeightRegular,
          //margin: `${spacing[8]}px ${spacing[0]} ${spacing[48]}px ${spacing[24]}px`,
          cursor: 'pointer'
        },
        '& li[data-focus="true"]': {
          //backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
      },
      overline: {
        textAlign: 'left',
        ...typography.overline
      },
      spinner: {
        color: hrmangoColors.dark,
        margin: 5 // edge
      }
    }))
    console.log(currentUser.companyId)
    const classes = useStyles()
    const termUpdate = useDebounce(term, 400)
    const validTerm = !!term && term.length >= 1

    type SortCol = keyof Pick<SearchResultSortInput, 'entityType' | 'name'>
    const [rowsPerPage] = useState(50)
    //const [totalRows, setTotalRows] = useState(0)
    const [page] = useState(0)
    const [orderByCol] = useState<SortCol>('entityType')
    const [orderDir] = useState<SortEnumType>(SortEnumType.Desc)
    let userId
    let companyId
    if (isAllowed(currentUser?.roles, [ModalRoleEnums.Applicant])) {
      userId = currentUser.userId?.toString()
    }
    if (isAllowed(currentUser?.roles, [ModalRoleEnums.Company])) {
      companyId = currentUser.companyId?.toString()
    }
    //const candidateId =  : currentUser.userId?.toString() ? 0
    const {data, isSuccess, isFetching, refetch} = useGetSearchTermsAsyncQuery(
      {
        filter: {
          searchTerm: term,
          companyId: companyId,
          candidateId: userId
        },
        skip: page * rowsPerPage,
        order: {[orderByCol]: orderDir},
        take: rowsPerPage
      },
      {
        enabled: false,
        refetchOnMount: 'always',
        refetchOnReconnect: 'always',
        keepPreviousData: false
      }
    )

    useEffect(() => {
      setLoading(isFetching)
    }, [isFetching]) // eslint-disable-line

    useEffect(() => {
      if (validTerm) {
        refetch()
        setSearchCalled(true)
        setOptions(data?.searchTerms?.items)
      }
    }, [termUpdate, data, isSuccess]) // eslint-disable-line

    useEffect(() => {
      if (!listOpen) {
        setTerm('')
        setOptions([])
      }
    }, [listOpen])

    const resetSearch = () => {
      setSelectedValue({})
      setOptions([])
      setTerm('')
      setListOpen(false)
    }

    useEffect(() => {
      if (selectedValue && selectedValue.name) {
        resetSearch()
        setToggleSearchOff()
      }
    }, [selectedValue]) // eslint-disable-line

    useEffect(() => {
      return () => {
        resetToasts && resetToasts()
      }
    }, []) // eslint-disable-line

    const goToDetails = (row: any) => {
      const url =
        row.entityType === 'Candidate'
          ? `${routes.CandidateDetail}/${row.id}`
          : row.entityType === 'Company'
          ? `${routes.CompanyDetail}/${row.id}`
          : row.entityType === 'Job'
          ? `${routes.JobDetail}/${row.id}`
          : ''
      row.entityType !== 'Contact' &&
        history.push(url, {
          header: {
            title: row.name,
            color: location && location.state && location.state.header?.color
          }
        })
    }

    return (
      <Autocomplete
        //disablePortal
        //filterOptions={(options, state) => options}
        value={selectedValue}
        disableClearable
        forcePopupIcon={false}
        onChange={(e, value) => {
          setSelectedValue(value && value)
        }}
        loadingText='Searching'
        noOptionsText={!options?.length && searchCalled ? 'No results' : !validTerm ? 'Type here to see results' : ''}
        className={classes.autocomplete}
        open={listOpen}
        onOpen={() => {
          setListOpen(true)
        }}
        onClose={() => setListOpen(false)}
        getOptionSelected={(option, value) => (value && value.name ? value.name === option.name : true)}
        getOptionLabel={(option) => (option && option.name) || ''}
        options={options ?? []}
        loading={loading}
        renderOption={(option: any) => {
          return (
            validTerm && (
              <Box component='li' className={classes.subMenu} tabIndex={-1}>
                <Link onClick={() => goToDetails(option)}>
                  {option.name} <span className={classes.overline}>({option.entityType})</span>
                </Link>
              </Box>
            )
          )
        }}
        renderInput={(params) => (
          <TextField
            autoFocus={true}
            {...params}
            className={classes.textField}
            value={term}
            onChange={(event: any) => setTerm(event.target.value)}
            placeholder='Search'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress className={classes.spinner} size={20} />
                  ) : term.length > 0 ? (
                    <IconButton size='small' onClick={resetSearch} style={{color: hrmangoColors.blueGray}}>
                      <Clear />
                    </IconButton>
                  ) : null}
                </>
              ),
              id: 'header-search'
            }}
          />
        )}
      />
    )
  }
)
