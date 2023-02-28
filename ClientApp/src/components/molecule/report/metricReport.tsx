import {useState, useEffect, ChangeEvent, useMemo} from 'react'
import {useMutation} from 'react-query'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {makeStyles} from '@material-ui/core/styles'
import {spacing, typography, palette, shadows, hrmangoColors} from 'lib/hrmangoTheme'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  Box,
  TablePagination,
  Chip,
  Drawer
} from '@material-ui/core'

import {useDispatch} from 'react-redux'

import {setSpinner} from 'store/action/globalActions'
import {useGetMetricsReportAsyncQuery} from 'graphql/Reports/GetMetricsReportQuery.generated'
import {MetricsFilterInput} from 'graphql/types.generated'

import {FilterList, PictureAsPdf, GridOn} from '@material-ui/icons'
import {LocationState} from 'type'
import CurrentUserCache from 'lib/utility/currentUser'
import {format} from 'date-fns'
import {metricsPdf, metricsXls} from 'api/reportApi'
import {saveAs} from 'file-saver'
import {formatDate} from 'utility'
import ReportFiltersDrawer from './reportFiltersDrawer'

export const defaultFilters: MetricsFilterInput = {
  fromDate: new Date(new Date().setDate(new Date().getDate() - 7)),
  toDate: new Date(),
  jobName: '',
  companyName: ''
}

const useStyles = (loaded: boolean) =>
  makeStyles((theme) => ({
    filter: {
      paddingTop: spacing[16],
      display: 'flex',
      justifyContent: 'end'
    },
    table: {
      borderTop: hrmangoColors.tableBorderStyle,
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
    buttonGreen: {
      marginLeft: '32px',
      ...typography.buttonGreen
    },
    button: {
      marginTop: '16px',
      marginLeft: '16px',
      ...typography.buttonDense
    },
    title: {
      ...typography.h6
    },
    subTitle: {
      ...typography.subtitle3,
      paddingBottom: spacing[16],
      paddingTop: spacing[16]
    },
    row: {
      //paddingTop: spacing[16],
      display: 'flex',
      justifyContent: 'end'
    },
    rowSpace: {
      paddingLeft: spacing[24]
    },
    textField: {
      marginLeft: '16px',
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
    drawerPaper: {
      width: '405px',
      top: '80px',
      borderTopLeftRadius: spacing[24]
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      boxShadow: shadows[20],
      padding: spacing[24],
      fontWeight: typography.fontWeightMedium,
      backgroundColor: hrmangoColors.lightGray,
      borderRadius: '24px',
      width: '-webkit-fill-available',
      '& .MuiAutocomplete-popper': {
        marginTop: '80px',
        opacity: 0.9
      },
      '& .MuiContainer-root': {
        padding: spacing[0]
      }
    }
  }))

const MetricReport = withRouter(({location, history}: RouteComponentProps<{}, StaticContext, LocationState>) => {
  const dispatch = useDispatch()
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [totalRows, setTotalRows] = useState(0)
  const [page, setPage] = useState(0)

  const [filters, setFilters] = useState<MetricsFilterInput>(defaultFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = (open: boolean) => (event: any) => {
    setDrawerOpen(open)
  }

  const applyFilters = (filters: any) => {
    setFilters(filters)
    refetch()
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    refetch()
  }

  const showReset = useMemo(() => {
    return (
      filters?.fromDate !== defaultFilters?.fromDate ||
      filters?.toDate !== defaultFilters?.toDate ||
      filters.companyName !== defaultFilters?.companyName ||
      filters.jobName !== defaultFilters?.jobName
    )
  }, [filters]) // eslint-disable-line

  const {data, isSuccess, isFetching, refetch} = useGetMetricsReportAsyncQuery(
    {
      filter: {...filters},
      skip: page * rowsPerPage,
      take: rowsPerPage
    },
    {
      //enabled: false,
      refetchOnMount: 'always'
    }
  )
  const classes = useStyles(!isFetching)()

  const items = data?.metricsReport?.items

  useEffect(() => {
    setTotalRows(data?.metricsReport?.totalCount ?? 0)
  }, [data?.metricsReport?.totalCount, isSuccess])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    refetch()
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const rows = +event.target.value
    setPage(0)
    setRowsPerPage(rows)
    refetch()
  }

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  const xls = useMutation(() => metricsXls(filters?.fromDate, filters?.toDate, filters?.jobName), {
    onMutate: () => {
      dispatch(setSpinner(true))
    },
    onError: (error) => {
      dispatch(setSpinner(false))
    },
    onSuccess: (data: any) => {
      dispatch(setSpinner(false))
      data.blob().then((blob) => {
        const todaysDate = format(new Date(), 'yyyy-MM-dd')
        const fileName = 'Metrics_' + todaysDate + '.xlsx'
        saveAs(blob, fileName)
      })
    },
    retry: 0
  })

  const pdf = useMutation(() => metricsPdf(filters?.fromDate, filters?.toDate, filters?.jobName), {
    onMutate: () => {
      dispatch(setSpinner(true))
    },
    onError: (error) => {
      dispatch(setSpinner(false))
    },
    onSuccess: (data: any) => {
      dispatch(setSpinner(false))
      data.blob().then((blob) => {
        const todaysDate = format(new Date(), 'yyyy-MM-dd')
        const fileName = 'Metrics_' + todaysDate + '.pdf'
        saveAs(blob, fileName)
      })
    },
    retry: 0
  })

  return (
    <>
      <Box className={classes.header}>
        <Box>
          <span className={classes.title}>Metrics Report</span>
          <p className={classes.subTitle}>
            <span>Author: {CurrentUserCache?.userName}</span>
          </p>
        </Box>
        <Box>
          <Box className={classes.row}>
            <Button
              size='large'
              type='submit'
              variant='contained'
              className={classes.buttonGreen}
              disabled={!items}
              onClick={() => {
                pdf.mutate()
              }}
            >
              <PictureAsPdf fontSize='small' color='inherit' />
              <Box>Export PDF</Box>
            </Button>
            <Button
              size='large'
              type='submit'
              variant='contained'
              className={classes.buttonGreen}
              disabled={!items}
              onClick={() => {
                xls.mutate()
              }}
            >
              <GridOn fontSize='small' color='inherit' />
              <Box>Export XLS</Box>
            </Button>
          </Box>
          <Box className={classes.filter} color='secundary'>
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
        </Box>
      </Box>
      <Box className={classes.subTitle}>
        <Chip label={`From ${formatDate(filters.fromDate)}`} onClick={toggleDrawer(true)} />
        <Chip label={`To ${formatDate(filters.toDate)}`} onClick={toggleDrawer(true)} />
        {filters.jobName && <Chip label={`${filters.jobName}`} onClick={toggleDrawer(true)} />}
        {filters.companyName && <Chip label={`${filters.companyName}`} onClick={toggleDrawer(true)} />}
      </Box>
      <Table className={classes.table} stickyHeader>
        {!isFetching && items ? (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'createdDate'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('createdDate')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Candidate Name</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'owner'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('owner')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Candidate Source</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'createdDate'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('createdDate')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Job Name</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'firstName'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('firstName')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Stage</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'email'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('email')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Application</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'cellPhone'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('cellPhone')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Pre Screen</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Time Between Stages</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'jobTitle'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('jobTitle')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Manager Replies</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Time Between Stages</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*</TableCell>active={orderByCol === 'status'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('status')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Interview</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Time Between Stages</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Offer</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Offer Status</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Time Between Stages</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Hire</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Time Between Stages</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Time to Fill</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Time to Start</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Non-Selection Reason</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  /*active={orderByCol === 'dateLastContacted'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('dateLastContacted')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}*/
                >
                  <span>Comments</span>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
        ) : (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <span>Candidate Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Candidate Source</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Job Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Stage</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Application</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Job Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Pre Screen</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Time Between Stages</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Manager Replies</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Time Between Stages</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Interview</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Time Between Stages</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Offer</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Offer Status</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Time Between Stages</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Hire</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Time Between Stages</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Time to Fill</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Time to Start</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Non-Selection Reason</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Comments</span>
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
                      <span>{row.candidateName}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.candidateSource}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.jobName}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.stage}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.applicationDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.preScreenDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.gapPreScreenDays}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.managerRepliesDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.gapManagerRepliesDays}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.hirevueInterviewDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.gapHirevueInterviewDays}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.offerDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.offerStatus}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.gapOfferDays}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.hireDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.gapHireDays}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.timeFill}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.timeStart}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.nonSelectionReason}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.notes}</span>
                    </TableCell>
                  </TableRow>
                )
              })
            : !isFetching && (
                <TableRow>
                  <TableCell style={{width: '100px', borderBottom: 'none'}}>No results found.</TableCell>
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                  <TableCell style={{borderBottom: 'none'}} />
                </TableRow>
              )}
        </TableBody>
      </Table>
      <TablePagination
        className={classes.pagination}
        component='div'
        count={totalRows}
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
        <ReportFiltersDrawer
          loaded={isFetching ?? false}
          filters={filters}
          setFilters={setFilters}
          applyHandler={(filters) => applyFilters(filters)}
          resetHandler={() => resetFilters()}
          closeHandler={toggleDrawer(false)}
          showReset={showReset}
          filterType='metrics'
        />
      </Drawer>
    </>
  )
})

export {MetricReport}
