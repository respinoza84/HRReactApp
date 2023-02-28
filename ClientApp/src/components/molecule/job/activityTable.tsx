import {useState, useEffect, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles} from '@material-ui/core/styles'

import {spacing, typography, palette, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {Box, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TablePagination} from '@material-ui/core'
import {formatDate} from 'utility'

import {Spinner} from 'lib/molecule/spinner'
import {ActivitySortInput, SortEnumType} from 'graphql/types.generated'

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
    spinner: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
  }))

export type jobActivitiesType = {
  data: any
  isSuccess: boolean
  isFetching: boolean
  refetch: any
  rowsPerPage: number
  totalRows: number
  page: number
  setPage: any
  setRowsPerPage: any
}

const ActivityTable = withRouter(
  ({
    match,
    data,
    isFetching,
    isSuccess,
    refetch,
    rowsPerPage,
    totalRows,
    page,
    setPage,
    setRowsPerPage
  }: jobActivitiesType & RouteComponentProps<{jobId: string}>) => {
    type SortCol = keyof Pick<ActivitySortInput, 'action' | 'createdDate' | 'createdBy'>

    const [sorting, setSorting] = useState(false)

    const [showSpinner, setShowSpinner] = useState(true)
    const [orderByCol, setOrderByCol] = useState<SortCol>('action')
    const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)

    const classes = useStyles(!isFetching)()

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

    const items = data?.activitiesByEntity?.items

    useEffect(() => {
      fetchData()
    }, [data])

    useEffect(() => {
      setShowSpinner(isFetching)
    }, [isFetching])

    return (
      <>
        {showSpinner && (
          <div className={classes.spinner}>
            <Spinner height='100%' />
          </div>
        )}
        <Box className={classes.rowHeader}>Activities</Box>
        <Table className={classes.table} stickyHeader>
          {!isFetching && items ? (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell} style={{width: '300px'}}>
                  <TableSortLabel
                    hideSortIcon={!isFetching}
                    active={orderByCol === 'action'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('action')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Action</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell} style={{width: '283px'}}>
                  <TableSortLabel
                    hideSortIcon={!isFetching}
                    active={orderByCol === 'createdDate'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('createdDate')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Created Date</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell} style={{width: '283px'}}>
                  <TableSortLabel
                    hideSortIcon={!isFetching}
                    active={orderByCol === 'createdBy'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('createdBy')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Created By</span>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
          ) : (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell}>
                  <span>Action</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Created Date</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Created By</span>
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
                        <span>{row.action}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{formatDate(row.createdDate)}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.createdBy}</span>
                      </TableCell>
                    </TableRow>
                  )
                })
              : Array.from(new Array(10)).map((row: any, index: number) => (
                  <TableRow key={`diversity-skeleton-row-${index}`}>
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
  }
)

export {ActivityTable}
