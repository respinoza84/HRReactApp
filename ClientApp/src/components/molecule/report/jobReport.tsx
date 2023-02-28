import {useState, useEffect, ChangeEvent, useMemo} from 'react'
import {useMutation} from 'react-query'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {useDispatch} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import {spacing, typography, palette, shadows, hrmangoColors} from 'lib/hrmangoTheme'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Button,
  Chip,
  TablePagination,
  Drawer
} from '@material-ui/core'

import {setSpinner} from 'store/action/globalActions'
import {useGetJobsReportAsyncQuery} from 'graphql/Reports/GetJobsReportQuery.generated'
import {JobSortInput, JobFilterInput, SortEnumType} from 'graphql/types.generated'
import {LocationState} from 'type'
import {FilterList, PictureAsPdf, GridOn} from '@material-ui/icons'
import CurrentUserCache from 'lib/utility/currentUser'
import {formatDate} from 'utility'
import {format} from 'date-fns'
import {jobsPdf, jobsXls} from 'api/reportApi'
import {saveAs} from 'file-saver'
import ReportFiltersDrawer from './reportFiltersDrawer'

export const defaultFilters: JobFilterInput = {
  fromDate: new Date(new Date().setDate(new Date().getDate() - 7)),
  toDate: new Date()
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

const JobReport = withRouter(({location, history}: RouteComponentProps<{}, StaticContext, LocationState>) => {
  type SortCol = keyof Pick<JobSortInput, 'id' | 'jobName' | 'companyName' | 'status' | 'jobOwnerShip' | 'jobType'>
  const [sorting, setSorting] = useState(false)
  const dispatch = useDispatch()
  const [orderByCol, setOrderByCol] = useState<SortCol>('jobName')
  const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
  const [filters, setFilters] = useState<JobFilterInput>(defaultFilters)

  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [totalRows, setTotalRows] = useState(0)
  const [page, setPage] = useState(0)
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
    return filters?.fromDate !== defaultFilters?.fromDate || filters?.toDate !== defaultFilters?.toDate
  }, [filters]) // eslint-disable-line

  const {data, isSuccess, isFetching, refetch} = useGetJobsReportAsyncQuery(
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

  const items = data?.jobsReport?.items

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  useEffect(() => {
    setTotalRows(data?.jobsReport?.totalCount ?? 0)
  }, [data?.jobsReport?.totalCount, isSuccess])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const rows = +event.target.value
    setPage(0)
    setRowsPerPage(rows)
  }

  const xls = useMutation(() => jobsXls(filters?.fromDate, filters?.toDate), {
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
        const fileName = 'Jobs_' + todaysDate + '.xlsx'
        saveAs(blob, fileName)
      })
    },
    retry: 0
  })

  const pdf = useMutation(() => jobsPdf(filters?.fromDate, filters?.toDate), {
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
        const fileName = 'Jobs_' + todaysDate + '.pdf'
        saveAs(blob, fileName)
      })
    },
    retry: 0
  })

  return (
    <>
      <Box className={classes.header}>
        <Box>
          <span className={classes.title}>Jobs Report</span>
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
      </Box>
      <Table className={classes.table} stickyHeader>
        {!isFetching && items ? (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'id'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('id')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}
                >
                  <span>Candidate</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'jobName'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('jobName')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}
                >
                  <span>Company Name</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'companyName'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('companyName')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}
                >
                  <span>Contact Name</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'status'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('status')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}
                >
                  <span>Job</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'jobOwnerShip'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('jobOwnerShip')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setSorting(!sorting)
                  }}
                >
                  <span>Last Activity</span>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
        ) : (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <span>Candidate</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Company Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Contact Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Job</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Last Activity</span>
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
                      <span>
                        {row.candidateId}-{row.fullName}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.companyName}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.contactName}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>
                        {row.jobId}-{row.jobName}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>
                        {formatDate(row.modifiedDate)} {row.lastActivity}
                      </span>
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
          filterType='job'
        />
      </Drawer>
    </>
  )
})

export {JobReport}
