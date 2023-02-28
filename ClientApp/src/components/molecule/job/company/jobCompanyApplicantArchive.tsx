import {useState, useEffect, ChangeEvent, useMemo} from 'react'
import {routes} from 'router'
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
  Drawer,
  Link
} from '@material-ui/core'

import {setToast, setSpinner} from 'store/action/globalActions'
import {useGetJobsQuery} from 'graphql/Jobs/Queries/GetJobsQuery.generated'
import {JobSortInput, JobFilterInput, SortEnumType} from 'graphql/types.generated'
import AddCompanyModal from '../../companyPortal/addCompany/addCompanyModal'
import {FilterList, Add} from '@material-ui/icons'
import {LocationState} from 'type'
import DeleteModal from '../../delete/deleteModal'
import JobCompanyFiltersDrawer from '../jobCompanyFiltersDrawer'
import {archive} from 'api/companyApi'
import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'

export const defaultFilters: JobFilterInput = {
  fromDate: undefined,
  toDate: undefined,
  companyName: undefined,
  jobName: undefined,
  status: undefined,
  candidateId: undefined,
  isDeleted: undefined,
  companyId: undefined
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
    buttonGreen: {
      marginBottom: '16px',
      marginLeft: '32px',
      ...typography.buttonGreen
    },
    button: {
      marginBottom: '16px',
      marginLeft: '16px',
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
    row: {
      display: 'flex',
      justifyContent: 'end'
    },
    rowSpace: {
      paddingLeft: spacing[24]
    }
  }))

const JobApplicantTableArchive = withRouter(
  ({location, history}: RouteComponentProps<{}, StaticContext, LocationState>) => {
    type SortCol = keyof Pick<
      JobSortInput,
      'id' | 'jobName' | 'companyName' | 'status' | 'statusId' | 'jobOwnerShip' | 'jobType' | 'modifiedDate'
    >
    let companyId: number | undefined = 0 ?? 0
    companyId = CurrentUserCache?.companyId!
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [totalRows, setTotalRows] = useState(0)
    const [sorting, setSorting] = useState(false)
    const [page, setPage] = useState(0)
    const dispatch = useDispatch()
    const [id, setId] = useState(0)
    const [orderByCol, setOrderByCol] = useState<SortCol>('id')
    const [orderByColstatus] = useState<SortCol>('statusId')
    const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
    const [orderDirAsc] = useState<SortEnumType>(SortEnumType.Asc)
    const [name, setName] = useState<string | null | undefined>('')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [removeModalOpen, setRemoveModalOpen] = useState(false)
    const [removeCompanyModalOpen, setRemoveCompanyModalOpen] = useState(false)
    const [filters, setFilters] = useState<JobFilterInput>()

    const showReset = useMemo(() => {
      return (
        filters?.fromDate !== defaultFilters?.fromDate ||
        filters?.toDate !== defaultFilters?.toDate ||
        filters?.companyName !== defaultFilters?.companyName ||
        filters?.jobName !== defaultFilters?.jobName ||
        filters?.status !== defaultFilters?.status ||
        filters?.jobOwnerShip !== defaultFilters?.jobOwnerShip ||
        filters?.candidateId !== defaultFilters?.candidateId ||
        filters?.isDeleted !== defaultFilters?.isDeleted
      )
    }, [filters]) // eslint-disable-line
    const {data, isSuccess, isFetching, refetch} = useGetJobsQuery(
      {
        filter: {...filters, companyId: CurrentUserCache.companyId?.toString(), isDeleted: 'true'},
        order: {[orderByColstatus]: orderDirAsc, [orderByCol]: orderDir},
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
              message: `Company successfully archived`,
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
    const goToJobDetails = (row: any) => {
      history.push(`${routes.JobCompanyDetail}/${row.id}`, {
        header: {
          title: `${row.jobName} | ${row.companyName}` as any,
          owner: row.jobOwnerShip,
          type: row.jobType,
          color: '#0091D0' as any
        }
      })
    }
    const onCompanyRemoveClick = () => {}
    return (
      <>
        <Box className={classes.filter} color='secundary'>
          <Button
            size='large'
            type='submit'
            variant='contained'
            className={classes.buttonGreen}
            onClick={() => {
              setName('Add New Job')
              setId(companyId ?? 0)
              setRemoveCompanyModalOpen(true)
            }}
          >
            <Add fontSize='small' color='inherit' />
            <Box>Add Job</Box>
          </Button>
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
                    <span>Id</span>
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
                    active={orderByCol === 'companyName'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('companyName')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Hiring Manager</span>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
          ) : (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell}>
                  <span>Id</span>
                </TableCell>

                <TableCell className={classes.headerTableCell}>
                  <span>Job Name</span>
                </TableCell>

                <TableCell className={classes.headerTableCell}>
                  <span>Status</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Hiring Manager</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Request a Recruiter?</span>
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
                        <span>{row.id}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <Link onClick={() => goToJobDetails(row)}>
                          <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.jobName}</span>
                        </Link>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.status}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.jobOwnerShip}</span>
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
        />
        <DeleteModal
          onRemoveClick={() => onRemoveClick()}
          id={id}
          name={name}
          open={removeModalOpen}
          onClose={() => setRemoveModalOpen(false)}
          entityName='job'
        />
        <AddCompanyModal
          onCompanyRemoveClick={() => onCompanyRemoveClick()}
          id={companyId ?? 0}
          name={name}
          open={removeCompanyModalOpen}
          onClose={() => setRemoveCompanyModalOpen(false)}
          entityName='Publish Job'
        />
        <Drawer
          anchor={'right'}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <JobCompanyFiltersDrawer
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

export {JobApplicantTableArchive}
