import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles} from '@material-ui/core/styles'

import {spacing, typography, palette, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {useGetInvoicesByFiltersQuery} from 'graphql/Billing/GetInvoicesByFiltersQuery.generated'
import {useEffect, useState} from 'react'
import {Invoice, BillingFilterInput} from 'graphql/types.generated'
import {
  Box,
  Button,
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
import {FilterList, Clear} from '@material-ui/icons'
import {formatDate} from 'utility'
import InvoiceFiltersDrawer from './invoiceFiltersDrawer'
import {routes} from 'router'

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

export const defaultFilters: BillingFilterInput = {
  companyName: undefined,
  invoiceFromDate: undefined,
  invoiceToDate: undefined,
  jobName: undefined,
  jobType: undefined,
  jobVertical: undefined,
  companyContact: undefined,
  invoiced: undefined,
  paid: undefined,
  paymentFromDate: undefined,
  paymentToDate: undefined,
  notificationFromDate: undefined,
  notificationToDate: undefined
}

const Invoices = withRouter(({match, history}: RouteComponentProps<{companyId: string; jobId: string}>) => {
  const classes = useStyles(true)()
  const companyId = match.params.companyId ?? '0'
  const [filter, setFilter] = useState<BillingFilterInput>({
    companyId: companyId
  })
  const [items, setItems] = useState<Array<Invoice>>()

  const [searchCalled, setSearchCalled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [listOpen, setListOpen] = useState<boolean>(false)
  const [term, setTerm] = useState<string>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const {data, isSuccess, isFetching, refetch} = useGetInvoicesByFiltersQuery(
    {
      filter: {...filter}
    },
    {
      enabled: true,
      refetchOnMount: 'always'
    }
  )

  useEffect(() => {
    setLoading(isFetching)
  }, [isFetching]) // eslint-disable-line

  useEffect(() => {
    setItems(data?.invoicesByFilters?.items ?? [])
    setSearchCalled(true)
    // eslint-disable-next-line
  }, [data?.invoicesByFilters, isSuccess])

  useEffect(() => {
    if (filter.invoiceNumber) {
      setListOpen(false)
    }
  }, [filter.invoiceNumber]) // eslint-disable-line

  const applyFilters = (filter: any) => {
    setFilter({...filter!, companyId: parseInt(companyId)})
    refetch()
  }

  const resetSearch = () => {
    setFilter({companyId: companyId})
    setTerm('')
    setListOpen(false)
  }

  const toggleDrawer = (open: boolean) => (event: any) => {
    setDrawerOpen(open)
  }

  const goToInvoiceDetails = (row: any) => {
    history.push({
      pathname: `${routes.Invoice}/${row.invoiceNumber}`,
      state: {
        backUrl: history.location.pathname,
        backState: history.location.state
      }
    })
  }
  return (
    <>
      <Box color='secundary' className={classes.filter}>
        <Autocomplete
          //disableClearable
          forcePopupIcon={false}
          value={filter.invoiceNumber}
          onChange={(e, value) => {
            setFilter({...filter!, invoiceNumber: value && value.billingNumber})
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
              onChange={(event: any) => {
                setFilter({...filter!, invoiceNumber: event.target.value})
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
        <Button size='large' type='submit' variant='contained' className={classes.button} onClick={toggleDrawer(true)}>
          <FilterList fontSize='small' color='inherit' />
          <Box>Filters</Box>
        </Button>
      </Box>
      <Table className={classes.table} stickyHeader>
        {!isFetching && items ? (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel hideSortIcon={isFetching}>
                  <span>Invoice Number</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel hideSortIcon={isFetching}>
                  <span>Date</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel hideSortIcon={isFetching}>
                  <span>Sent</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel hideSortIcon={isFetching}>
                  <span>Paid</span>
                </TableSortLabel>
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
                <span>Sent</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Paid</span>
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
                      <span>{formatDate(row.createdDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.invoiced ? 'Yes' : 'No'}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.isPaid ? 'Yes' : 'No'}</span>
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
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <Drawer
        anchor={'right'}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <InvoiceFiltersDrawer
          defaultFilters={defaultFilters}
          applyHandler={(filters) => applyFilters(filters)}
          closeHandler={toggleDrawer(false)}
          resetSearch={resetSearch}
        />
      </Drawer>
    </>
  )
})

export {Invoices}
