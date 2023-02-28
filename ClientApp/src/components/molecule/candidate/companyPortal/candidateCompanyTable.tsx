import {useState, useEffect, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {routes} from 'router'
import {makeStyles} from '@material-ui/core/styles'
import {spacing, typography, palette, hrmangoColors} from 'lib/hrmangoTheme'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
  Box,
  Link,
  Drawer
} from '@material-ui/core'

import {formatDate} from 'utility'
import {useDispatch} from 'react-redux'

import {setToast, setSpinner} from 'store/action/globalActions'
import {useGetCandidatesAsyncQuery} from 'graphql/Candidates/Queries/GetCandidatesAsyncQuery.generated'
import {CandidateFilterInput, CandidateSortInput, SortEnumType} from 'graphql/types.generated'

import {Delete, FilterList} from '@material-ui/icons'
import {LocationState} from 'type'
import DeleteModal from '../../delete/deleteModal'
import CandidateFiltersDrawer from '../candidateFiltersDrawer'
import {archive} from 'api/candidateApi'

import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'

export const defaultFilters: CandidateFilterInput = {
  fromDate: '',
  toDate: '',
  name: '',
  jobTitle: '',
  status: '',
  owner: ''
}

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
    drawerPaper: {
      width: '405px',
      top: '80px',
      borderTopLeftRadius: spacing[24]
    }
  }))

const CandidateCompanyTable = withRouter(
  ({location, history}: RouteComponentProps<{userId}, StaticContext, LocationState>) => {
    type SortCol = keyof Pick<
      CandidateSortInput,
      | 'createdDate'
      | 'owner'
      | 'status'
      | 'firstName'
      | 'lastName'
      | 'jobTitle'
      | 'email'
      | 'cellPhone'
      | 'dateLastContacted'
      | 'modifiedDate'
    >

    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [totalRows, setTotalRows] = useState(0)
    const [sorting, setSorting] = useState(false)
    const [page, setPage] = useState(0)
    const [id, setId] = useState(0)
    const [name, setName] = useState<string | null | undefined>('')
    const [orderByCol, setOrderByCol] = useState<SortCol>('modifiedDate')
    const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const dispatch = useDispatch()

    const [removeModalOpen, setRemoveModalOpen] = useState(false)
    const [filters, setFilters] = useState<CandidateFilterInput>()

    let userId: number | undefined = 0 ?? 0
    userId = CurrentUserCache?.userId!

    const {data, isSuccess, isFetching, refetch} = useGetCandidatesAsyncQuery(
      {
        filter: {...filters, userId: userId.toString()},
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
      setTotalRows(data?.candidates?.totalCount ?? 0)
    }, [data?.candidates?.totalCount, isSuccess])

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
      const rows = +event.target.value
      setPage(0)
      setRowsPerPage(rows)
    }

    const items = data?.candidates?.items

    useEffect(() => {
      dispatch(setSpinner(isFetching))
    }, [isFetching]) // eslint-disable-line

    const goToCandidateDetails = (row: any) => {
      history.push(`${routes.CompanyCandidateDetail}/${row.code}`, {
        header: {
          title: row.displayAs,
          owner: row.owner,
          type: row.workType,
          color: location && location.state && location.state.header?.color
        }
      })
    }

    useEffect(() => {
      if (!drawerOpen) {
      }
    }, [filters]) // eslint-disable-line

    const toggleDrawer = (open: boolean) => (event: any) => {
      setDrawerOpen(open)
    }

    const applyFilters = (filters: any) => {
      setFilters(filters)
      refetch()
    }

    const onRemoveClick = () => {
      dispatch(setSpinner(true))
      archive(id.toString())
        .then((response: any) => {
          dispatch(
            setToast({
              message: `Candidate successfully removed`,
              type: 'success'
            })
          )
          refetch()
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
        <Table className={classes.table} stickyHeader>
          {!isFetching && items ? (
            <TableHead>
              <TableRow>
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
                    active={orderByCol === 'owner'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('owner')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Owner</span>
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
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Status</span>
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
                    active={orderByCol === 'cellPhone'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('cellPhone')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Mobile Phone</span>
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
                  <span>Candidate Name</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Owner</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Status</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Job Title</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Email</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Mobile phone</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Created Date</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Last Activity</span>
                </TableCell>
                {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                  <TableCell className={classes.headerTableCell}>
                    <span>D</span>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {!isFetching && items
              ? items?.map((row: typeof items[0], index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className={classes.tableCell}>
                        <Link onClick={() => goToCandidateDetails(row)}>
                          <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.displayAs}</span>
                        </Link>
                      </TableCell>

                      <TableCell className={classes.tableCell}>
                        <span>{row.owner}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.status}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.jobTitle}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.email}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.cellPhone}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{formatDate(row.createdDate)}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>
                          {formatDate(row.modifiedDate)} {row.lastActivity}
                        </span>
                      </TableCell>
                      {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                        <TableCell className={classes.tableCell}>
                          <span>
                            <Delete
                              style={{cursor: 'pointer'}}
                              fontSize='small'
                              color='inherit'
                              onClick={() => {
                                setName(row.displayAs)
                                setId(row.id)
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
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                      <TableCell className={classes.tableCell}></TableCell>
                    )}
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
        <DeleteModal
          id={id}
          name={name}
          open={removeModalOpen}
          onClose={() => setRemoveModalOpen(false)}
          onRemoveClick={() => onRemoveClick()}
          entityName='candidate'
        />
        <Drawer
          anchor={'right'}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <CandidateFiltersDrawer
            loaded={isFetching ?? false}
            defaultFilters={defaultFilters}
            applyHandler={(filters) => applyFilters(filters)}
            closeHandler={toggleDrawer(false)}
          />
        </Drawer>
      </>
    )
  }
)

export {CandidateCompanyTable}
