import {ChangeEvent, useEffect, useState, useMemo} from 'react'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {LocationState} from 'type'
import {useDispatch} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import {spacing, typography, palette, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import InvoicesCompanyFiltersDrawer from './invoicesCompanyFiltersDrawer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Drawer,
  Box,
  Button,
  Link,
  TextField,
  IconButton,
  CircularProgress
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {SortEnumType, BillingReportSort, BillingFilterInput} from 'graphql/types.generated'
import {setSpinner} from 'store/action/globalActions'
import {Clear, FilterList} from '@material-ui/icons'
import {useGetBillingReportSortQuery} from 'graphql/Reports/GetBillingReportSortQuery.generated'
import {routes} from 'router'
import CurrentUserCache from 'lib/utility/currentUser'

export const defaultFilters: BillingFilterInput = {
  fromDate: undefined,
  toDate: undefined,
  companyName: undefined,
  jobName: undefined,
  companyId: undefined,
  invoiced: undefined,
  paid: undefined,
  jobVertical: undefined,
  companyContact: undefined,
  invoiceNumber: undefined,
  jobType: undefined
}

const useStyles = (loaded: boolean) =>
  makeStyles((theme) => ({
    principalContain: {
      backgroundColor: hrmangoColors.white,
      boxShadow: shadows[20],
      borderRadius: '16px',
      fontWeight: typography.fontWeightMedium
    },
    filter: {
      display: 'flex',
      justifyContent: 'end'
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
    headerTableCellLeft: {
      ...typography.h4,
      textAlign: 'left',
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
    tableCellLeft: {
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
      marginBottom: '16px',
      ...typography.buttonDense
    },
    spinner: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    drawerPaper: {
      width: '405px',
      top: '80px',
      borderTopLeftRadius: spacing[24]
    },
    rowHeader: {
      ...typography.h6
    },
    total: {
      textAlign: 'right'
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
    subMenu: {
      listStyle: 'none',
      ...typography.body1,
      '& li': {
        color: palette.text.primary,
        textTransform: 'capitalize',
        textAlign: 'left',
        fontWeight: typography.fontWeightRegular,
        margin: `${spacing[8]}px ${spacing[0]} ${spacing[48]}px ${spacing[24]}px`,
        cursor: 'pointer'
      },
      '& li[data-focus="true"]': {}
    },
    textField: {
      '& .MuiAutocomplete-inputRoot[class*="MuiInput-root"] .MuiAutocomplete-input:first-child': {
        padding: `14px ${spacing[16]}px`,
        borderRadius: 28,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        opacity: 0.8,
        fontSize: typography.fontSize
      },
      '& .MuiInput-underline:before': {
        borderBottom: 'none'
      },
      '& .MuiInput-underline:after': {
        borderBottom: 'none'
      },
      '& ::placeholder': {}
    },
    title: {
      ...typography.h6,
      display: 'flex',
      justifyContent: 'start'
    }
  }))

const InvoicesCompanyReportInvoiced = withRouter(
  ({match, location, history}: RouteComponentProps<{}, StaticContext, LocationState>) => {
    type SortCol = keyof Pick<
      BillingReportSort,
      | 'invoiceNumber'
      | 'billingNumber'
      | 'jobName'
      | 'candidate'
      | 'companyName'
      | 'createdDate'
      | 'invoiced'
      | 'paid'
      | 'companyContact'
    >
    let companyId: number | undefined = 0 ?? 0
    companyId = CurrentUserCache?.companyId!
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [totalRows, setTotalRows] = useState(0)
    const [sorting, setSorting] = useState(false)
    const [page, setPage] = useState(0)
    const dispatch = useDispatch()
    const [orderByCol, setOrderByCol] = useState<SortCol>('invoiceNumber')
    const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [filters, setFilters] = useState<BillingFilterInput>()
    const [searchCalled, setSearchCalled] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [listOpen, setListOpen] = useState<boolean>(false)
    const [term, setTerm] = useState<string>('')
    const showReset = useMemo(() => {
      return (
        filters?.fromDate !== defaultFilters?.fromDate ||
        filters?.toDate !== defaultFilters?.toDate ||
        filters?.companyName !== defaultFilters?.companyName ||
        filters?.jobName !== defaultFilters?.jobName ||
        filters?.jobType !== defaultFilters?.jobType ||
        filters?.jobVertical !== defaultFilters?.jobVertical ||
        filters?.invoiceNumber !== defaultFilters?.invoiceNumber ||
        filters?.billingNumber !== defaultFilters?.billingNumber ||
        filters?.companyContact !== defaultFilters?.companyContact
      )
    }, [filters]) // eslint-disable-line

    const {data, isSuccess, isFetching, refetch} = useGetBillingReportSortQuery(
      {
        filter: {...filters, companyId: companyId.toString(), invoiced: false},
        order: {[orderByCol]: orderDir},
        skip: page * rowsPerPage,
        take: rowsPerPage
      },
      {
        enabled: true,
        refetchOnMount: 'always'
      }
    )

    const classes = useStyles(!isFetching)()

    useEffect(() => {
      setLoading(isFetching)
    }, [isFetching]) // eslint-disable-line

    useEffect(() => {
      setTotalRows(data?.billingReportSort?.totalCount ?? 0)
      setSearchCalled(true)
      return () => {
        refetch()
      }
    }, [data?.billingReportSort?.totalCount, isSuccess])

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
      const rows = +event.target.value
      setPage(0)
      setRowsPerPage(rows)
    }

    const items = data?.billingReportSort?.items

    useEffect(() => {
      dispatch(setSpinner(isFetching))
    }, [isFetching]) // eslint-disable-line

    const toggleDrawer = (open: boolean) => (event: any) => {
      setDrawerOpen(open)
    }

    const applyFilters = (filters: any) => {
      setFilters(filters)
      refetch()
    }
    const goToInvoiceDetails = (row: any) => {
      history.push({
        pathname: `${routes.Invoice}/${row.invoiceNumber}`,
        state: {
          backUrl: history.location.pathname
        }
      })
    }
    const resetSearch = () => {
      setFilters(defaultFilters)
      setTerm('')
      setListOpen(false)
    }
    return (
      <>
        <Box color='secundary' className={classes.title}>
          <span>{totalRows} New Invoice(s)</span>
        </Box>
        <Box color='secundary' className={classes.filter}>
          <Autocomplete
            //disableClearable
            forcePopupIcon={false}
            value={filters?.invoiceNumber}
            onChange={(e, value) => {
              setFilters({...filters!, invoiceNumber: value && value.invoiceNumber})
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
              value && value.invoiceNumber ? value.invoiceNumber === option.invoiceNumber : true
            }
            getOptionLabel={(option) => (option && option.invoiceNumber) || ''}
            options={items ?? []}
            loading={loading}
            renderOption={(option: any) => {
              return (
                <Box component='li' className={classes.subMenu}>
                  {option.invoiceNumber}
                </Box>
              )
            }}
            renderInput={(params) => (
              <TextField
                autoFocus={true}
                {...params}
                className={classes.textField}
                onChange={(event: any) => {
                  setFilters({...filters!, invoiceNumber: event.target.value})
                  return () => refetch()
                }}
                placeholder='Search by Invoice Number'
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
          <Button
            size='large'
            type='submit'
            variant='contained'
            className={classes.button}
            onClick={toggleDrawer(true)}
          >
            <FilterList fontSize='small' color='inherit' />
            <Box>Filters</Box>
          </Button>
        </Box>
        <Table className={classes.table} stickyHeader>
          {!isFetching && items ? (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel
                    hideSortIcon={isFetching}
                    active={orderByCol === 'invoiceNumber'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('invoiceNumber')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Invoice Number</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel
                    hideSortIcon={isFetching}
                    active={orderByCol === 'createdDate'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('createdDate')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Date</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel
                    hideSortIcon={isFetching}
                    active={orderByCol === 'candidate'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('candidate')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Candidate</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel
                    hideSortIcon={isFetching}
                    active={orderByCol === 'companyContact'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('companyContact')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Company Contact</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCellLeft}>
                  <span>Total</span>
                </TableCell>
              </TableRow>
            </TableHead>
          ) : (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell}>
                  <span>Invoice Number</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Date</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Candidate</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Company Contact</span>
                </TableCell>
                <TableCell className={classes.headerTableCellLeft}>
                  <span>Total</span>
                </TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {!isFetching && items
              ? items?.map((row: typeof items[0], index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className={classes.tableCell}>
                        <Link
                          onClick={() => {
                            goToInvoiceDetails(row)
                          }}
                        >
                          <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.invoiceNumber}</span>
                        </Link>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.createdDate}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.candidate}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.companyContact}</span>
                      </TableCell>
                      <TableCell className={classes.tableCellLeft}>
                        <span>$ {row.total}</span>
                      </TableCell>
                    </TableRow>
                  )
                })
              : Array.from(new Array(10)).map((row: any, index: number) => (
                  <TableRow key={`row-${index}`}>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCellLeft}></TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TablePagination
          className={classes.pagination}
          count={totalRows}
          component='div'
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[rowsPerPage]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Drawer
          anchor={'right'}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <InvoicesCompanyFiltersDrawer
            loaded={isFetching ?? false}
            defaultFilters={filters ?? defaultFilters}
            applyHandler={(filters) => applyFilters(filters)}
            closeHandler={toggleDrawer(false)}
            showReset={showReset}
          />
        </Drawer>
      </>
    )
  }
)

export {InvoicesCompanyReportInvoiced}
