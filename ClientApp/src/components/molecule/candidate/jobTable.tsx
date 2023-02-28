import {useState, useEffect, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles} from '@material-ui/core/styles'
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

import {formatDate} from 'utility'
import {Spinner} from 'lib/molecule/spinner'
import {useGetHistoryByCandidateIdQuery} from 'graphql/Candidates/Queries/GetHistoryByCandidateIdQuery.generated'
import {RequisitionSortInput, SortEnumType} from 'graphql/types.generated'
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

const JobTable = withRouter(({match, history}: RouteComponentProps<{candidateId: string}>) => {
  type SortCol = keyof Pick<RequisitionSortInput, 'id' | 'jobDescription' | 'hiringMananger'>

  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [totalRows] = useState(0)
  const [sorting, setSorting] = useState(false)
  const [page, setPage] = useState(0)
  const [showSpinner, setShowSpinner] = useState(true)
  const [orderByCol, setOrderByCol] = useState<SortCol>('id')
  const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)

  const {data, isFetching} = useGetHistoryByCandidateIdQuery(
    {
      candidateId: parseInt(
        match.params.candidateId
      ) /*,
      skip: page * rowsPerPage,
      take: rowsPerPage,
      order: {[orderByCol]: orderDir}*/
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

  const fetchData = () => {
    //reload table
  }

  const items = data?.historyByCandidateId?.items

  useEffect(() => {
    fetchData()
  }, [data])

  useEffect(() => {
    setShowSpinner(isFetching)
  }, [isFetching])

  const addJob = () => {
    history.push({
      pathname: `${routes.JobDetail}/`,
      state: {
        header: {
          title: 'New Job' as any,
          color: '#0091D0' as any
        },
        backUrl: history.location.pathname,
        backState: history.location.state
      }
    })
  }

  const goToJobDetails = (row: any) => {
    history.push(`${routes.JobDetail}/${row.id}`, {
      header: {
        title: `${row.jobName} | ${row.companyName}` as any,
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
      {showSpinner && (
        <div className={classes.spinner}>
          <Spinner height='100%' />
        </div>
      )}

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
                  active={orderByCol === 'jobDescription'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('jobDescription')
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
              <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                <span>Work Type</span>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                <span>Company Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                <span>Status Achieved</span>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                <span>Status</span>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '283px'}}>
                <TableSortLabel
                  hideSortIcon={!isFetching}
                  active={orderByCol === 'hiringMananger'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('hiringMananger')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Owner</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                <span>Start Date</span>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                <span>End Date</span>
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
                <span>Work Type</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Company Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Status Achieved</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Status</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Owner</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Start Date</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>End Date</span>
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
                      <span>{row.workType}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.companyName}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.statusAchieved}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.status}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.owner}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.startDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span></span>
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
        component='div'
        count={totalRows}
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
})

export {JobTable}
