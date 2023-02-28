import {useState, useEffect, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {LocationState} from 'type'
import {makeStyles} from '@material-ui/core/styles'
import {useDispatch} from 'react-redux'
import {setSpinner} from 'store/action/globalActions'
import {routes} from 'router'
import {spacing, typography, palette, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
  Link
} from '@material-ui/core'

import {useGetCompanyJobsQuery} from 'graphql/Company/Queries/GetCompanyJobsQuery.generated'
import {JobSortInput, SortEnumType} from 'graphql/types.generated'
import {Add} from '@material-ui/icons'

const useStyles = (loaded: boolean) =>
  makeStyles((theme) => ({
    principalContain: {
      backgroundColor: hrmangoColors.white,
      boxShadow: shadows[20],
      borderRadius: '16px',
      margin: `${spacing[16]}px ${spacing[32]}px`,
      fontWeight: typography.fontWeightMedium
    },
    rowHeader: {
      ...typography.h6,
      display: 'flex',
      justifyContent: 'space-between'
    },
    container: {
      position: 'relative',
      padding: `${spacing[16]}px`
    },
    table: {
      paddingTop: spacing[16],
      paddingBottom: spacing[48],
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
      ...typography.buttonGreen
    },
    spinner: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
  }))

const JobTable = withRouter(
  ({match, history, location}: RouteComponentProps<{companyId: string}, StaticContext, LocationState>) => {
    type SortCol = keyof Pick<JobSortInput, 'id' | 'jobName' | 'jobOwnerShip' | 'status' | 'jobType'>

    const [rowsPerPage, setRowsPerPage] = useState(15)
    const [totalRows] = useState(0)
    const [sorting, setSorting] = useState(false)
    const [page, setPage] = useState(0)
    const dispatch = useDispatch()
    const [orderByCol, setOrderByCol] = useState<SortCol>('id')
    const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)

    const {data, isFetching} = useGetCompanyJobsQuery(
      {
        companyId: parseInt(match.params.companyId),
        skip: page * rowsPerPage,
        take: rowsPerPage,
        order: {[orderByCol]: orderDir}
      },
      {
        enabled: true,
        keepPreviousData: true
      }
    )
    const classes = useStyles(!isFetching)()

    /*useEffect(() => {
    setTotalRows(data?.companyJobs?.totalCount ?? 0)
  }, [data?.companyJobs?.totalCount, isSuccess])*/

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
      const rows = +event.target.value
      setPage(0)
      setRowsPerPage(rows)
    }

    const items = data?.companyJobs?.items

    useEffect(() => {
      dispatch(setSpinner(isFetching))
    }, [isFetching]) // eslint-disable-line

    const addJob = () => {
      history.push({
        pathname: `${routes.JobDetail}/`,
        state: {
          header: {
            title: 'New Job' as any,
            color: '#0091D0' as any
          },
          backUrl: history.location.pathname,
          backState: history.location.state,
          params: {
            companyId: match.params.companyId
          }
        }
      })
    }

    const goToJobDetails = (row: any) => {
      history.push(`${routes.JobDetail}/${row.id}`, {
        header: {
          title: `${row.jobName} | ${history.location.state.header?.title}` as any,
          owner: row.jobOwnerShip,
          type: row.jobType,
          color: '#0091D0' as any
        },
        backUrl: history.location.pathname,
        backState: history.location.state
      })
    }

    return (
      <>
        <Box className={classes.rowHeader}>
          <div>Jobs</div>
          <div>
            <Button
              size='large'
              type='button'
              variant='contained'
              className={classes.button}
              onClick={() => {
                addJob()
              }}
            >
              <Add fontSize='small' color='inherit' />
            </Button>
          </div>
        </Box>
        <Table className={classes.table} stickyHeader>
          {!isFetching && items ? (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell} style={{width: '283px'}}>
                  <TableSortLabel
                    hideSortIcon={!isFetching}
                    active={orderByCol === 'jobName'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('jobName')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Job Name</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell} style={{width: '300px'}}>
                  <TableSortLabel
                    hideSortIcon={!isFetching}
                    active={orderByCol === 'id'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('id')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Id</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell} style={{width: '283px'}}>
                  <TableSortLabel
                    hideSortIcon={!isFetching}
                    active={orderByCol === 'jobOwnerShip'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('jobOwnerShip')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Owner</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                  <TableSortLabel
                    hideSortIcon={!isFetching}
                    active={orderByCol === 'status'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('status')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Status</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                  <TableSortLabel
                    hideSortIcon={!isFetching}
                    active={orderByCol === 'jobType'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('jobType')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Work Type</span>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
          ) : (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell}>
                  <span>Job Name</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Id</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Owner</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Status</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Work Type</span>
                </TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {items
              ? items?.map((row: typeof items[0], index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className={classes.tableCell}>
                        <Link onClick={() => goToJobDetails(row)}>
                          <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.jobName}</span>
                        </Link>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.id}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.jobOwnerShip}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.status}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.jobType}</span>
                      </TableCell>
                    </TableRow>
                  )
                })
              : Array.from(new Array(10)).map((row: any, index: number) => (
                  <TableRow key={`diversity-skeleton-row-${index}`}>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
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
          /*labelDisplayedRows={(from, to, count = totalRows) =>
              `Rows ${from}-${to === -1 ? count : to} of ${count}` as any
            }
            backIconButtonProps={page === 0 ? {disabled: true} : {disabled: false}}
                nextIconButtonProps={rowsPerPage * (page + 1) >= totalRows ? {disabled: true} : {disabled: false}}*/
        />
      </>
    )
  }
)

export {JobTable}
