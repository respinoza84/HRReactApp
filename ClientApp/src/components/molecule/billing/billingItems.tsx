import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles} from '@material-ui/core/styles'

import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {setToast, setSpinner} from 'store/action/globalActions'

import {spacing, typography, palette, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {useGetBillingItemsByFiltersAsyncQuery} from 'graphql/Billing/GetBillingItemsByFiltersQuery.generated'
import {useGetBillingItemsByJobAsyncQuery} from 'graphql/Billing/GetBillingItemsByJobQuery.generated'
import {useEffect, useState} from 'react'
import {BillingItem, BillingItemFilterInput} from 'graphql/types.generated'
import {
  Box,
  Button,
  Checkbox,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  //TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  IconButton,
  CircularProgress,
  Drawer
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {FilterList, Clear, Add, Delete} from '@material-ui/icons'
import {formatDate} from 'utility'
import BillingFiltersDrawer from './billingFiltersDrawer'
import BillingItemModal from './billingItemModal'
import {createInvoice, deleteBillingItem} from 'api/billingApi'
import CurrentUserCache from 'lib/utility/currentUser'
import {ModalRoleEnums} from 'type/user/roles'
import {isAllowed} from 'utility'
import DeleteModal from '../delete/deleteModal'

const useStyles = (loaded: boolean) =>
  makeStyles((theme) => ({
    principalContain: {
      backgroundColor: hrmangoColors.white,
      boxShadow: shadows[20],
      borderRadius: '16px',
      //margin: `${spacing[16]}px ${spacing[32]}px`,
      fontWeight: typography.fontWeightMedium
    },
    filter: {
      display: 'flex',
      justifyContent: 'end'
    },
    rowHeader: {
      ...typography.h6
    },
    container: {
      position: 'relative',
      padding: `${spacing[16]}px`
    },
    table: {
      paddingTop: spacing[16],
      '& th': {
        ...typography.body1
      },
      '& tfoot td': {
        height: 56,
        padding: spacing[0]
      },
      '& tfoot td:nth-child(2)': {
        ...typography.subtitle2
      },
      '& td': {
        borderBottom: hrmangoColors.outline,
        padding: `${spacing[8]}px`
      },
      '& tr:nth-child(odd)': {
        backgroundColor: hrmangoColors.lightGrey
      },
      '& .MuiTableSortLabel-root.MuiTableSortLabel-active': {
        color: loaded ? hrmangoColors.onSurfaceLight.mediumEmphasis : hrmangoColors.primary[50]
      }
    },
    headerTableCell: {
      ...typography.h4,
      backgroundColor: hrmangoColors.grey,
      whiteSpace: 'nowrap',
      padding: spacing[8],
      '& span': {
        backgroundColor: loaded ? hrmangoColors.grey : hrmangoColors.primary[50],
        color: loaded ? hrmangoColors.white : hrmangoColors.primary[50],
        height: loaded ? 'initial' : spacing[24]
      },
      '& .MuiTableSortLabel-root.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiTableSortLabel-icon': {
        color: loaded ? hrmangoColors.white : hrmangoColors.primary[50]
      }
    },
    tableCell: {
      padding: spacing[0],
      textAlign: 'left',
      whiteSpace: 'nowrap',
      color: palette.warning.contrastText,
      textTransform: 'capitalize'
    },
    pagination: {
      ...typography.body2,
      display: 'flex',
      justifyContent: 'end',

      '& .MuiTablePagination-toolbar': {
        paddingLeft: spacing[0]
      },
      '& .MuiSelect-select': {
        color: palette.success.contrastText
      },
      '& p:first-of-type': {
        color: hrmangoColors.onSurfaceLight.mediumEmphasis
      },
      '& p:last-of-type': {
        color: palette.success.contrastText
      },
      '& button': {
        '& svg': {
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center'
        }
      },
      '& .Mui-disabled': {
        opacity: 0.5
      }
    },
    button: {
      //marginBottom: '16px',
      ...typography.buttonDense
    },
    buttonGreen: {
      ...typography.buttonGreen
    },
    spinner: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    autocomplete: {
      width: 300,
      '& .MuiInput-underline:hover': {
        borderBottom: 'none'
      },
      '& .MuiInput-underline:before': {
        borderBottom: 'none'
      },
      '& .MuiInput-underline:after': {
        borderBottom: 'none'
      }
    },
    textField: {
      '& .MuiAutocomplete-inputRoot[class*="MuiInput-root"] .MuiAutocomplete-input:first-child': {
        padding: `14px ${spacing[16]}px`,
        //marginRight: spacing[12],
        //marginTop: `${spacing[16]}px`,
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
    subMenu: {
      listStyle: 'none',
      //padding: spacing[0],
      ...typography.body1,
      '& li': {
        color: palette.text.primary, // .blueGray,
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
    row: {
      display: 'flex',
      justifyContent: 'end',
      marginTop: spacing[16],
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      },
      '& .MuiFormGroup-root': {
        flexWrap: 'nowrap'
      },
      '& .MuiFormControl-root': {
        minWidth: '45%'
      }
    },
    rowSpace: {
      padding: spacing[16]
    },
    drawerPaper: {
      width: '405px',
      top: '80px',
      borderTopLeftRadius: spacing[24]
    }
  }))

export const defaultFilters: BillingItemFilterInput = {
  companyId: 0,
  fromDate: '',
  toDate: ''
}

const BillingItems = withRouter(({match}: RouteComponentProps<{companyId: string; jobId: string}>) => {
  const classes = useStyles(true)()
  const dispatch = useDispatch()
  const companyId = match.params.companyId ?? null
  const jobId = match.params.jobId ?? null
  const [filter, setFilter] = useState<BillingItemFilterInput>({
    companyId: parseInt(companyId),
    jobId: parseInt(jobId)
  })
  const [items, setItems] = useState<Array<BillingItem> | null | undefined>(null)
  const [selectedItems, setSelectedItems] = useState<Array<BillingItem>>([])
  const [searchCalled, setSearchCalled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [listOpen, setListOpen] = useState<boolean>(false)
  const [term, setTerm] = useState<string>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [billingItemModalOpen, setBillingItemModalOpen] = useState(false)
  const [billingItemId, setBillingItemId] = useState<number | undefined>(undefined)
  const [name, setName] = useState<string | null | undefined>('')

  const {
    data: dataJob,
    isSuccess: isSuccessJob,
    isFetching: isFetchingJob,
    refetch: refetchJob
  } = useGetBillingItemsByJobAsyncQuery(
    {
      filter: {...filter}
    },
    {
      enabled: false,
      refetchOnMount: 'always'
    }
  )

  const {data, isSuccess, isFetching, refetch} = useGetBillingItemsByFiltersAsyncQuery(
    {
      filter: {...filter}
    },
    {
      enabled: false,
      refetchOnMount: 'always',
      refetchOnReconnect: 'always'
    }
  )

  const newInvoice = useMutation(() => createInvoice({items: selectedItems, companyId: parseInt(companyId)}), {
    onMutate: () => {
      dispatch(setSpinner(true))
    },
    onError: (error: any) => {
      dispatch(setSpinner(false))
      dispatch(
        setToast({
          message: `Error saving the candidate: ${error.errorMessage}`,
          type: 'error'
        })
      )
    },
    onSuccess: (data: any) => {
      dispatch(setSpinner(false))
      data.json().then((billingItem) => {
        dispatch(
          setToast({
            message: `Invoice successfully created.`,
            type: 'success'
          })
        )
      })
      refetch()
    },
    retry: 0
  })

  useEffect(() => {
    setLoading(isFetching)
  }, [isFetching]) // eslint-disable-line

  useEffect(() => {
    setLoading(isFetchingJob)
  }, [isFetchingJob]) // eslint-disable-line

  useEffect(() => {
    if (companyId) refetch()
    else if (jobId) refetchJob()
    // eslint-disable-next-line
  }, [companyId, jobId])

  useEffect(() => {
    setSearchCalled(true)
    if (companyId) setItems(data?.billingItemsByFilters?.items)
    else if (jobId) setItems(dataJob?.billingItemsByJob?.items)
    // eslint-disable-next-line
  }, [data, isSuccess, dataJob, isSuccessJob])

  useEffect(() => {
    if (filter.billingNumber) {
      setListOpen(false)
    }
  }, [filter.billingNumber]) // eslint-disable-line

  const applyFilters = (filters: any) => {
    setFilter({...filter!, fromDate: filters.fromDate, toDate: filters.toDate})
    refetch()
  }

  const resetSearch = () => {
    setFilter({...filter!, billingNumber: undefined})
    setTerm('')
    setListOpen(false)
  }

  const toggleDrawer = (open: boolean) => (event: any) => {
    setDrawerOpen(open)
  }

  const handleSelectedItemChange = (e) => {
    const {value, checked} = e.target
    if (checked) selectedItems.push({id: value})
    else setSelectedItems(selectedItems?.filter((x) => x.id !== value))
  }

  const [removeModalOpen, setRemoveModalOpen] = useState(false)

  const onRemoveClick = () => {
    dispatch(setSpinner(true))
    deleteBillingItem((billingItemId ?? 0).toString())
      .then((response: any) => {
        dispatch(
          setToast({
            message: `Billing Item successfully removed`,
            type: 'success'
          })
        )
        if (companyId) refetch()
        else if (jobId) refetchJob()
      })
      .catch((err) => {
        dispatch(setToast({type: 'error'}))
      })
      .finally(() => {
        dispatch(setSpinner(false))
        setRemoveModalOpen(false)
      })
  }

  return (
    <>
      <Box color='secundary' className={classes.filter}>
        <Autocomplete
          //disableClearable
          forcePopupIcon={false}
          value={filter.billingNumber}
          onChange={(e, value) => {
            setFilter({...filter!, billingNumber: value && value.billingNumber})
            return () => refetch()
          }}
          loadingText='Searching'
          noOptionsText={!items?.length && searchCalled ? 'No results' : 'Type here to see results'}
          className={classes.autocomplete}
          open={listOpen}
          onOpen={() => {
            setListOpen(true)
          }}
          onClose={() => setListOpen(false)}
          getOptionSelected={(option, value) =>
            value && value.billingNumber ? value.billingNumber === option.billingNumber : true
          }
          getOptionLabel={(option) => (option && option.billingNumber) || ''}
          options={items ?? []}
          loading={loading}
          renderOption={(option: any) => {
            return (
              <Box component='li' className={classes.subMenu}>
                {option.billingNumber}
              </Box>
            )
          }}
          renderInput={(params) => (
            <TextField
              autoFocus={true}
              {...params}
              className={classes.textField}
              //value={filter.billingNumber}
              onChange={(event: any) => {
                setFilter({...filter!, billingNumber: event.target.value})
                return () => refetch()
              }}
              placeholder='Search by Billing Number'
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress className={classes.spinner} size={20} />
                    ) : term.length > 0 ? (
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
        <Button size='large' type='submit' variant='contained' className={classes.button} onClick={toggleDrawer(true)}>
          <FilterList fontSize='small' color='inherit' />
          <Box>Filters</Box>
        </Button>
      </Box>

      <Box className={classes.row}>
        <Button
          size='large'
          type='submit'
          variant='contained'
          className={classes.button}
          onClick={() => {
            setBillingItemId(undefined)
            setBillingItemModalOpen(true)
          }}
        >
          <Box>Create Billing Item</Box>
          <Add fontSize='small' color='inherit' />
        </Button>
        {companyId !== null && (
          <>
            <Box className={classes.rowSpace}></Box>
            <Button
              size='large'
              type='submit'
              variant='contained'
              className={classes.buttonGreen}
              onClick={() => {
                newInvoice.mutate()
              }}
            >
              <Box>Add to a New Invoice</Box>
              <Add fontSize='small' color='inherit' />
            </Button>
          </>
        )}
      </Box>
      <Table className={classes.table} stickyHeader>
        {items ? (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}></TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'companyName'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('companyName')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Code</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'companyOwner'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('companyOwner')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Date</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'contact'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('contact')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Candidate</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'companyType'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('companyType')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Supervisor</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'companyVertical'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('companyVertical')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Billing Calculation</span>
                </TableSortLabel>
              </TableCell>
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <TableCell className={classes.headerTableCell}>
                  <span>
                    <Delete fontSize='small' color='inherit' />
                  </span>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
        ) : (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <span>Code</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Date</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Candidate</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Supervisor</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Billing Calculation</span>
              </TableCell>
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <TableCell className={classes.headerTableCell}>
                  <span>
                    <Delete fontSize='small' color='inherit' />
                  </span>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {items
            ? items?.map((row: typeof items[0], index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      <Checkbox
                        id={`${row.id}`}
                        name='checkedItem'
                        color='primary'
                        value={row.id}
                        onChange={(e: any) => {
                          handleSelectedItemChange(e)
                        }}
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Link
                        onClick={() => {
                          setBillingItemId(row.id ?? undefined)
                          setBillingItemModalOpen(true)
                        }}
                      >
                        <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.billingNumber}</span>
                      </Link>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.createdDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.description}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.supervisor}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>$ {row.lineTotal}</span>
                    </TableCell>
                    {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                      <TableCell className={classes.tableCell}>
                        <span>
                          <Delete
                            style={{cursor: 'pointer'}}
                            fontSize='small'
                            color='inherit'
                            onClick={() => {
                              setName(row.description)
                              setBillingItemId(row.id ?? 0)
                              setRemoveModalOpen(true)
                            }}
                          />
                        </span>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            : Array.from(new Array(10)).map((row: any, index: number) => (
                <TableRow key={`row-${index}`}>
                  <TableCell className={classes.tableCell}></TableCell>
                  <TableCell className={classes.tableCell}></TableCell>
                  <TableCell className={classes.tableCell}></TableCell>
                  <TableCell className={classes.tableCell}></TableCell>
                  <TableCell className={classes.tableCell}></TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <BillingItemModal
        open={billingItemModalOpen}
        onClose={() => setBillingItemModalOpen(false)}
        companyId={companyId}
        jobId={jobId}
        refetch={companyId ? refetch : refetchJob}
        billingItemId={billingItemId}
      />
      <Drawer
        anchor={'right'}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <BillingFiltersDrawer
          loaded={isFetching ?? false}
          defaultFilters={defaultFilters}
          applyHandler={(filters) => applyFilters(filters)}
          closeHandler={toggleDrawer(false)}
        />
      </Drawer>
      <DeleteModal
        onRemoveClick={() => onRemoveClick()}
        id={billingItemId}
        name={name}
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        entityName='billing item'
      />
    </>
  )
})

export {BillingItems}
