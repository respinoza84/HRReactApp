import {useState, useEffect, ChangeEvent, useMemo} from 'react'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {useDispatch} from 'react-redux'
import {routes} from 'router'
import {makeStyles} from '@material-ui/core/styles'
import {formatDate} from 'utility'
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

import {setSpinner} from 'store/action/globalActions'
import {useGetJobCandidatesQuery} from 'graphql/Jobs/Queries/GetJobCandidatesQuery.generated'
import {JobCandidateSortInput, JobCandidateFilterInput, SortEnumType} from 'graphql/types.generated'
import {LocationState} from 'type'
import {AttachFile, FilterList} from '@material-ui/icons'
import JobCompanyApplicantFiltersDrawer from '../jobCompanyApplicantFiltersDrawer'

export const defaultFilters: JobCandidateFilterInput = {
  fromDate: undefined,
  toDate: undefined,
  applicantName: undefined,
  stageDescription: undefined,
  candidateCellPhone: undefined,
  candidateEmail: undefined
}

export type JobsTableType = {
  tableFilters?: JobCandidateFilterInput
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
      paddingTop: spacing[2],
      '& th': {
        ...typography.body1
      },
      '& tfoot td': {
        height: 36,
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
      marginLeft: '16px',
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
    actionsButtons: {
      textAlign: 'center',
      with: '150px'
    },
    greenButton: {
      marginRight: '120px',
      textTransform: 'capitalize',
      ...typography.buttonGreen
    },
    redText: {
      color: '0091D0'
    }
  }))

const CompanyApplicants = withRouter(
  ({match, location, history}: RouteComponentProps<{jobId: string}, StaticContext, LocationState>) => {
    type SortCol = keyof Pick<
      JobCandidateSortInput,
      | 'applicantName'
      | 'stageDescription'
      | 'candidateEmail'
      | 'candidateCellPhone'
      | 'candidateCreatedDate'
      | 'candidateModificateDate'
      | 'lastActivity'
      | 'resumePath'
    >
    const jobId = match.params.jobId
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [totalRows, setTotalRows] = useState(0)
    const [sorting, setSorting] = useState(false)
    const [page, setPage] = useState(0)
    const dispatch = useDispatch()
    const [orderByCol, setOrderByCol] = useState<SortCol>('candidateCreatedDate')
    const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [filters, setFilters] = useState<JobCandidateFilterInput>()

    const showReset = useMemo(() => {
      return (
        filters?.fromDate !== defaultFilters?.fromDate ||
        filters?.toDate !== defaultFilters?.toDate ||
        filters?.applicantName !== defaultFilters?.applicantName ||
        filters?.stageDescription !== defaultFilters?.stageDescription ||
        filters?.candidateCellPhone !== defaultFilters?.candidateCellPhone ||
        filters?.candidateEmail !== defaultFilters?.candidateEmail
      )
    }, [filters]) // eslint-disable-line
    const {data, isSuccess, isFetching, refetch} = useGetJobCandidatesQuery(
      {
        filter: {...filters, jobId: jobId},
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

    const goToCandidateDetails = (row: any) => {
      history.push(`${routes.CandidateDetail}/${row.candidateId}`, {
        header: {
          title: row.applicantName,
          owner: row.owner,
          type: row.workType,
          color: location && location.state && location.state.header?.color
        },
        backUrl: history.location.pathname,
        backState: history.location.state
      })
    }

    useEffect(() => {
      setTotalRows(data?.jobCandidates?.totalCount ?? 0)
    }, [data?.jobCandidates?.totalCount, isSuccess])

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
      const rows = +event.target.value
      setPage(0)
      setRowsPerPage(rows)
    }

    const items = data?.jobCandidates?.items
    //console.log(items)
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
                    active={orderByCol === 'applicantName'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('applicantName')
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
                    active={orderByCol === 'stageDescription'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('stageDescription')
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
                    active={orderByCol === 'candidateEmail'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('candidateEmail')
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
                    active={orderByCol === 'candidateCellPhone'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('candidateCellPhone')
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
                    active={orderByCol === 'candidateCreatedDate'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('candidateCreatedDate')
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
                    active={orderByCol === 'candidateModificateDate'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('candidateModificateDate')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Last Activity</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>
                    <AttachFile fontSize='small' color='inherit' />
                  </span>
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
                  <span>Status</span>
                </TableCell>

                <TableCell className={classes.headerTableCell}>
                  <span>Email</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Mobile Phone</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Creation Date</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Last Activity</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>
                    <AttachFile fontSize='small' color='inherit' />
                  </span>
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
                        <Link onClick={() => goToCandidateDetails(row)}>
                          <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.applicantName}</span>
                        </Link>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span
                          style={{
                            color:
                              row.stageId == 0
                                ? '#967ADC'
                                : row.stageId == 1
                                ? '#5BC24C'
                                : row.stageId == 2
                                ? '#F5B025'
                                : row.stageId == 3
                                ? '#E9573F'
                                : row.stageId == 4
                                ? '#4154BF'
                                : row.stageId == 5
                                ? '#967ADC'
                                : row.stageId == 6
                                ? '#0091D0'
                                : row.stageId == 8
                                ? '#0091D0'
                                : '#000000'
                          }}
                        >
                          {row.stageDescription}
                        </span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.candidateEmail}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.candidateCellPhone}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.candidateCreatedDate}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {formatDate(row.candidateModificateDate)} {row.lastActivity}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {row.resumePath?.length > 0 && (
                          <a
                            href={row.resumePath}
                            download={`Document: ${row.resumeFileName}`}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <span style={{cursor: 'pointer', color: '#0091D0'}}>
                              <AttachFile fontSize='small' color='inherit' />
                            </span>
                          </a>
                        )}
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
        <Drawer
          anchor={'right'}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <JobCompanyApplicantFiltersDrawer
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

export {CompanyApplicants}
