import {useState, useEffect, ChangeEvent, useMemo} from 'react'

import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {useDispatch} from 'react-redux'
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
  Box,
  Button,
  Link,
  Drawer
} from '@material-ui/core'

import {setToast, setSpinner} from 'store/action/globalActions'
import {useGetJobsQuery} from 'graphql/Jobs/Queries/GetJobsQuery.generated'
import {JobSortInput, JobFilterInput, SortEnumType} from 'graphql/types.generated'
import {LocationState} from 'type'
import {FilterList} from '@material-ui/icons'
import {archive} from 'api/jobApi'
import DeleteModal from '../delete/deleteModal'
import JobFiltersDrawer from './jobFiltersDrawer'

import {formatDate, getHRMangoUrl, isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'

export const defaultFilters: JobFilterInput = {
  fromDate: undefined,
  toDate: undefined,
  companyName: undefined,
  jobName: undefined,
  status: undefined,
  jobOwnerShip: undefined
}

export type JobsTableType = {
  tableFilters?: JobFilterInput
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

const JobApplicantActivitiesTable = withRouter(
  ({location, history}: RouteComponentProps<{}, StaticContext, LocationState>) => {
    type SortCol = keyof Pick<
      JobSortInput,
      'id' | 'jobName' | 'companyName' | 'status' | 'jobOwnerShip' | 'jobType' | 'modifiedDate'
    >

    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [totalRows, setTotalRows] = useState(0)
    const [sorting, setSorting] = useState(false)
    const [page, setPage] = useState(0)
    const dispatch = useDispatch()
    const [id] = useState(0)
    const [orderByCol, setOrderByCol] = useState<SortCol>('status')
    const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
    const [name] = useState<string | null | undefined>('')
    const [drawerOpen, setDrawerOpen] = useState(false)

    const [removeModalOpen, setRemoveModalOpen] = useState(false)
    const [filters, setFilters] = useState<JobFilterInput>()

    const showReset = useMemo(() => {
      return (
        filters?.fromDate !== defaultFilters?.fromDate ||
        filters?.toDate !== defaultFilters?.toDate ||
        filters?.companyName !== defaultFilters?.companyName ||
        filters?.jobName !== defaultFilters?.jobName ||
        filters?.status !== defaultFilters?.status ||
        filters?.jobOwnerShip !== defaultFilters?.jobOwnerShip
      )
    }, [filters]) // eslint-disable-line

    const {data, isSuccess, isFetching, refetch} = useGetJobsQuery(
      {
        filter: {...filters},
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
      setTotalRows(data?.jobs?.totalCount ?? 0)
    }, [data?.jobs?.totalCount, isSuccess])

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
      const rows = +event.target.value
      setPage(0)
      setRowsPerPage(rows)
    }

    const items = data?.jobs?.items

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

    const onRemoveClick = () => {
      dispatch(setSpinner(true))
      archive(id)
        .then((response: any) => {
          dispatch(
            setToast({
              message: `Company successfully removed`,
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
                    active={orderByCol === 'id'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('id')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Date Created</span>
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
                    active={orderByCol === 'companyName'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('companyName')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Company Name</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel
                    hideSortIcon={isFetching}
                    active={orderByCol === 'jobType'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('jobType')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Job External Type</span>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
          ) : (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell}>
                  <span>Date Created</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Job Name</span>
                </TableCell>

                <TableCell className={classes.headerTableCell}>
                  <span>Company Name</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Job External Type</span>
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
                        <span>{formatDate(row.createdDate)}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <Link target={`_blank`} href={`${getHRMangoUrl(`careers/jobDetail/${row.id}`)}`}>
                          <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.jobName} </span>
                        </Link>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.companyName}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.jobExternalType}</span>
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
                    {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                      <TableCell className={classes.tableCell}></TableCell>
                    )}
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
        />
        <DeleteModal
          onRemoveClick={() => onRemoveClick()}
          id={id}
          name={name}
          open={removeModalOpen}
          onClose={() => setRemoveModalOpen(false)}
          entityName='job'
        />
        <Drawer
          anchor={'right'}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <JobFiltersDrawer
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

export {JobApplicantActivitiesTable}
