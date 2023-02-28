import {useState, useEffect, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import {useDispatch} from 'react-redux'
import {setSpinner} from 'store/action/globalActions'
import {makeStyles} from '@material-ui/core/styles'
import {spacing, typography, palette, hrmangoColors} from 'lib/hrmangoTheme'
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TablePagination, Box} from '@material-ui/core'

import {formatDate} from 'utility'

import {useGetCandidatesAsyncQuery} from 'graphql/Candidates/Queries/GetCurrentCandidatesByCompanyIdAsyncQuery.generated'
import {CandidateSortInput, SortEnumType} from 'graphql/types.generated'

const useStyles = (loaded: boolean) =>
  makeStyles((theme) => ({
    filter: {
      borderBottom: hrmangoColors.tableBorderStyle,
      color: hrmangoColors.dark,
      textAlign: 'right',
      backgroundColor: hrmangoColors.white,
      padding: spacing[0]
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
    rowHeader: {
      ...typography.h6,
      paddingTop: spacing[48]
    }
  }))

const CandidateTable = withRouter(({match}: RouteComponentProps<{companyId: string}>) => {
  type SortCol = keyof Pick<
    CandidateSortInput,
    | 'createdDate'
    | 'firstName'
    | 'lastName'
    | 'jobTitle'
    | 'jobName'
    | 'email'
    | 'department'
    | 'cellPhone'
    | 'dateLastContacted'
  >

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [sorting, setSorting] = useState(false)
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const [orderByCol, setOrderByCol] = useState<SortCol>('firstName')
  const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)

  const {data, isSuccess, isFetching} = useGetCandidatesAsyncQuery({
    companyId: parseInt(match.params.companyId),
    order: {[orderByCol]: orderDir},
    skip: page * rowsPerPage,
    take: rowsPerPage
  })
  const classes = useStyles(!isFetching)()

  useEffect(() => {
    setTotalRows(data?.currentCandidatesByCompanyId?.totalCount ?? 0)
  }, [data?.currentCandidatesByCompanyId?.totalCount, isSuccess])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const rows = +event.target.value
    setPage(0)
    setRowsPerPage(rows)
  }

  const items = data?.currentCandidatesByCompanyId?.items

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  return (
    <>
      <Box className={classes.rowHeader}>Current Candidates</Box>
      <Table className={classes.table} stickyHeader>
        {!isFetching && items ? (
          <TableHead>
            <TableCell className={classes.headerTableCell}>
              <TableSortLabel
                hideSortIcon={isFetching}
                active={orderByCol === 'firstName'}
                direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                onClick={() => {
                  setOrderByCol('firstName')
                  setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                  setPage(0)
                  setSorting(!sorting)
                }}
              >
                <span>Candidate Name</span>
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.headerTableCell}>
              <TableSortLabel
                hideSortIcon={isFetching}
                active={orderByCol === 'jobTitle'}
                direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                onClick={() => {
                  setOrderByCol('jobTitle')
                  setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                  setPage(0)
                  setSorting(!sorting)
                }}
              >
                <span>Job Title</span>
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
                  setPage(0)
                  setSorting(!sorting)
                }}
              >
                <span>Job Name</span>
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.headerTableCell}>
              <TableSortLabel
                hideSortIcon={isFetching}
                active={orderByCol === 'email'}
                direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                onClick={() => {
                  setOrderByCol('email')
                  setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                  setPage(0)
                  setSorting(!sorting)
                }}
              >
                <span>Email</span>
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.headerTableCell}>
              <TableSortLabel
                hideSortIcon={isFetching}
                active={orderByCol === 'department'}
                direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                onClick={() => {
                  setOrderByCol('department')
                  setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                  setPage(0)
                  setSorting(!sorting)
                }}
              >
                <span>Department</span>
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.headerTableCell}>
              <TableSortLabel
                hideSortIcon={isFetching}
                active={orderByCol === 'dateLastContacted'}
                direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                onClick={() => {
                  setOrderByCol('dateLastContacted')
                  setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                  setPage(0)
                  setSorting(!sorting)
                }}
              >
                <span>Last Activity</span>
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
                <span>Creation Date</span>
              </TableSortLabel>
            </TableCell>
          </TableHead>
        ) : (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <span>Candidate Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Job Title</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Job Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Email</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Department</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Mobile phone</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Last Activity</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Created Date</span>
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
                      <span style={{cursor: 'pointer', color: '#0091D0'}}>{`${row.firstName} ${row.lastName}`}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.jobTitle}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.jobName}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.email}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.department}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.lastActivity}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.createdDate)}</span>
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
})

export {CandidateTable}
