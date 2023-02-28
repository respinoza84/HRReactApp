/*
  @author  Oliver Zamora
  @description Search candidate component
*/

import {useState, useEffect} from 'react'
import {makeStyles, IconButton, TextField, CircularProgress, Box} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {Clear} from '@material-ui/icons'
import {withRouter, RouteComponentProps} from 'react-router'
import {useGetCandidatesAsyncQuery} from 'graphql/Candidates/Queries/GetCandidatesAsyncQuery.generated'
import {CandidateSortInput, CandidateFilterInput, SortEnumType} from 'graphql/types.generated'

import {spacing, hrmangoColors} from 'lib/hrmangoTheme'
import {useDebounce} from 'lib/utility/customHooks'

type SearchCandidateType = {
  setToggleSearchOff: () => void
  resetToasts?: any
  setToast?: any
  selectedValue: any
  setSelectedValue: any
}

export const SearchCandidate = withRouter(
  ({
    history,
    location,
    setToggleSearchOff,
    resetToasts,
    setToast,
    selectedValue,
    setSelectedValue
  }: RouteComponentProps & SearchCandidateType) => {
    const [searchCalled, setSearchCalled] = useState<boolean>(false)
    const [listOpen, setListOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [options, setOptions] = useState<any>([])
    const [applicantTerm, setApplicantTerm] = useState<string>('')

    const useStyles = makeStyles(({palette, typography, breakpoints, zIndex, shadows}: any) => ({
      autocomplete: {
        width: 400,
        '& .MuiInput-underline:hover': {
          borderBottom: 'none'
        }
      },
      textField: {
        '& .MuiAutocomplete-inputRoot[class*="MuiInput-root"] .MuiAutocomplete-input:first-child': {
          padding: `14px ${spacing[16]}px`,
          marginRight: spacing[12],
          //marginTop: `${spacing[16]}px`,
          marginBottom: `${spacing[16]}px`,
          borderRadius: 28,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          opacity: 0.8,
          //color: 'rgba(255, 2555, 255, 1)',
          fontSize: typography.fontSize
        },
        '& .MuiInput-underline:before': {
          borderBottom: 'none'
        },
        '& .MuiInput-underline:after': {
          borderBottom: 'none'
        },
        '& ::placeholder': {
          //color: 'rgba(255, 2555, 255, 1)'
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
        //padding: spacing[0],
        ...typography.body1,
        '& li': {
          color: palette.text.blueGray,
          textTransform: 'capitalize',
          textAlign: 'left',
          fontWeight: typography.fontWeightRegular,
          margin: `${spacing[8]}px ${spacing[0]} ${spacing[48]}px ${spacing[24]}px`,
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
    const classes = useStyles()

    const applicantTermUpdated = useDebounce(applicantTerm, 500)
    const validApplicantTerm = !!applicantTerm && applicantTerm.length >= 1

    type SortCol = keyof Pick<CandidateSortInput, 'displayAs'>
    const [rowsPerPage] = useState(50)
    //const [totalRows, setTotalRows] = useState(0)
    const [page] = useState(0)
    const [orderByCol] = useState<SortCol>('displayAs')
    const [orderDir] = useState<SortEnumType>(SortEnumType.Desc)

    const [filters] = useState<CandidateFilterInput>()

    const {data, isSuccess, isFetching, refetch} = useGetCandidatesAsyncQuery(
      {
        filter: {...filters!, name: applicantTerm},
        order: {[orderByCol]: orderDir},
        skip: page * rowsPerPage,
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
      if (validApplicantTerm) {
        refetch()
        setSearchCalled(true)
        setOptions(data?.candidates?.items)
      }
    }, [applicantTermUpdated, data?.candidates?.items, isSuccess]) // eslint-disable-line

    useEffect(() => {
      return () => {
        resetToasts && resetToasts()
      }
    }, []) // eslint-disable-line

    /*useEffect(() => {
      if (!listOpen) {
        setApplicantTerm('')
        setOptions([])
      }
    }, [listOpen])*/

    useEffect(() => {
      if (selectedValue && selectedValue.id) {
        //resetSearch()
        setToggleSearchOff()
        setListOpen(false)
      }
    }, [selectedValue]) // eslint-disable-line

    const resetSearch = () => {
      setSelectedValue({})
      setOptions([])
      setApplicantTerm('')
      setListOpen(false)
    }

    return (
      <Autocomplete
        disablePortal
        //filterOptions={(options, state) => options}
        value={selectedValue}
        disableClearable
        forcePopupIcon={false}
        onChange={(e, value) => {
          setSelectedValue(value && value)
        }}
        loadingText='Searching'
        noOptionsText={
          !options?.length && searchCalled ? 'No results' : !validApplicantTerm ? 'Type here to see results' : ''
        }
        className={classes.autocomplete}
        open={listOpen}
        onOpen={() => {
          setListOpen(true)
        }}
        onClose={() => setListOpen(false)}
        getOptionSelected={(option, value) => (value && value.displayAs ? value.displayAs === option.displayAs : true)}
        getOptionLabel={(option) => (option && option.displayAs) || ''}
        options={options ?? []}
        loading={loading}
        renderOption={(option: any) => {
          return (
            validApplicantTerm && (
              <Box component='li' className={classes.subMenu}>
                {option.displayAs} <span className={classes.overline}>({option.jobTitle})</span>
              </Box>
            )
          )
        }}
        renderInput={(params) => (
          <TextField
            autoFocus={true}
            {...params}
            className={classes.textField}
            value={applicantTerm}
            onChange={(event: any) => setApplicantTerm(event.target.value)}
            placeholder='Search Candidate'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress className={classes.spinner} size={20} />
                  ) : applicantTerm.length > 0 ? (
                    <IconButton size='small' onClick={resetSearch} style={{color: hrmangoColors.grayDark}}>
                      <Clear />
                    </IconButton>
                  ) : null}
                </>
              ),
              id: 'header-searchCandidate'
            }}
          />
        )}
      />
    )
  }
)
