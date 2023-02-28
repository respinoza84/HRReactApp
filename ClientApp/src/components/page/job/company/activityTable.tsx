import {ChangeEvent, useEffect, useState} from 'react'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {LocationState} from 'type'
import {useDispatch} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import {spacing, typography, palette, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TablePagination, Box} from '@material-ui/core'
import {SortEnumType, ActivitySortInput} from 'graphql/types.generated'
import {setSpinner} from 'store/action/globalActions'
import {useGetActivitiesByEntityQuery} from 'graphql/Actions/GetNoteByEntityIdAndIdQuery.generated'

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

const ActivityTable = withRouter(
  ({match, location, history}: RouteComponentProps<{jobId: string}, StaticContext, LocationState>) => {
    type SortCol = keyof Pick<ActivitySortInput, 'action' | 'createdDate' | 'createdBy'>
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [totalRows, setTotalRows] = useState(0)
    const [sorting, setSorting] = useState(false)
    const [page, setPage] = useState(0)
    const dispatch = useDispatch()
    const [orderByCol, setOrderByCol] = useState<SortCol>('action')
    const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)

    const {data, isSuccess, isFetching, refetch} = useGetActivitiesByEntityQuery(
      {
        entityId: parseInt(match.params.jobId),
        entityName: 'Stage',
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
      setTotalRows(data?.activitiesByEntity?.totalCount ?? 0)
      return () => {
        refetch()
      }
    }, [data?.activitiesByEntity?.totalCount, isSuccess])

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
      const rows = +event.target.value
      setPage(0)
      setRowsPerPage(rows)
    }

    const items = data?.activitiesByEntity?.items

    useEffect(() => {
      dispatch(setSpinner(isFetching))
    }, [isFetching]) // eslint-disable-line

    return (
      <>
        <Box color='secundary' className={classes.title}>
          <span>Activities</span>
        </Box>
        <Table className={classes.table} stickyHeader>
          {!isFetching && items ? (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel
                    hideSortIcon={isFetching}
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
                    <span>Created Date</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel
                    hideSortIcon={isFetching}
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
            {!isFetching && items
              ? items?.map((row: typeof items[0], index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className={classes.tableCell}>
                        <span>{row.action}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.createdDate}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.createdBy}</span>
                      </TableCell>
                    </TableRow>
                  )
                })
              : Array.from(new Array(10)).map((row: any, index: number) => (
                  <TableRow key={`row-${index}`}>
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
        />
      </>
    )
  }
)

export {ActivityTable}
