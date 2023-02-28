import {useState, useEffect, ChangeEvent} from 'react'
import {useMutation} from 'react-query'
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
  Link
} from '@material-ui/core'

import {formatDate} from 'utility'
import {useDispatch} from 'react-redux'

import {setSpinner, resetToasts, setToast} from 'store/action/globalActions'
import {useGetApplicantsByJobIdAsyncQuery} from 'graphql/Jobs/Queries/GetApplicantsByJobId.generated'
import {CandidateFilterInput, ApplicantSortInput, SortEnumType, Applicant} from 'graphql/types.generated'

import {Delete, Add, AssignmentInd} from '@material-ui/icons'
import {LocationState} from 'type'
import {SearchCandidate} from './searchCandidate'
import {addCandidate, deleteCandidate} from 'api/jobApi'
import ApplicantModal from './applicantModal'
import DeleteModal from '../delete/deleteModal'
import CandidateModal from './candidateModal'

export const defaultFilters: CandidateFilterInput = {
  fromDate: '',
  toDate: '',
  name: '',
  jobTitle: '',
  status: '',
  owner: ''
}

const defaultCandidate = {
  applicationDate: undefined,
  stageId: 0
}

const useStyles = (loaded: boolean) =>
  makeStyles((theme) => ({
    filter: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: hrmangoColors.tableBorderStyle,
      color: hrmangoColors.dark,
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
      marginBottom: spacing[24],
      ...typography.buttonGreen
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

const CandidateTable = withRouter(
  ({match, location, history}: RouteComponentProps<{jobId: string}, StaticContext, LocationState>) => {
    type SortCol = keyof Pick<
      ApplicantSortInput,
      'applicantName' | 'source' | 'applicationDate' | 'lastActivity' | 'startDate' | 'endDate'
    >

    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalRows, setTotalRows] = useState(0)
    const [sorting, setSorting] = useState(false)
    const [page, setPage] = useState(0)

    const [orderByCol, setOrderByCol] = useState<SortCol>('applicantName')
    const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
    const dispatch = useDispatch()

    const {data, isSuccess, isFetching, refetch} = useGetApplicantsByJobIdAsyncQuery(
      {
        jobId: parseInt(match.params.jobId),
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
      setTotalRows(data?.applicantsByJobId?.totalCount ?? 0)
    }, [data?.applicantsByJobId?.totalCount, isSuccess])

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
      const rows = +event.target.value
      setPage(0)
      setRowsPerPage(rows)
    }

    const items = data?.applicantsByJobId?.items

    useEffect(() => {
      dispatch(setSpinner(isFetching))
    }, [isFetching]) // eslint-disable-line

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

    const [toggleSearch, setToggleSearch] = useState<boolean>(false)
    const [selectedValue, setSelectedValue] = useState<any>({})
    const [candidate, setCandidate] = useState<Applicant>(defaultCandidate)
    const [applicantModalOpen, setApplicantModalOpen] = useState(false)
    const [candidateModalOpen, setCandidateModalOpen] = useState(false)

    const addApplicant = useMutation(() => addCandidate(match.params.jobId, selectedValue.id, {...candidate}), {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Error adding the candidate`,
            type: 'error'
          })
        )
      },
      onSuccess: (data: any) => {
        dispatch(setSpinner(false))
        data.json().then((candidate) => {
          dispatch(
            setToast({
              message: `${selectedValue.displayAs} successfully added`,
              type: 'success'
            })
          )
          setApplicantModalOpen(false)
          refetch()
        })
      },
      retry: 0
    })

    const [id, setId] = useState(0)
    const [name, setName] = useState<string | null | undefined>('')
    const [removeModalOpen, setRemoveModalOpen] = useState(false)
    const onRemoveClick = () => {
      dispatch(setSpinner(true))
      deleteCandidate(match.params.jobId, id.toString())
        .then((response: any) => {
          dispatch(
            setToast({
              message: `Applicant successfully removed`,
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
          refetch()
          setRemoveModalOpen(false)
        })
    }

    return (
      <>
        <Box className={classes.filter} color='secundary'>
          <Box style={{display: 'flex', justifyContent: 'space-between'}}>
            <SearchCandidate
              setToast={setToast}
              resetToasts={resetToasts}
              setToggleSearchOff={() => setToggleSearch(false)}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
            />
            <Button
              type='submit'
              variant='contained'
              className={classes.button}
              disabled={toggleSearch}
              onClick={() => setApplicantModalOpen(true)}
            >
              <AssignmentInd fontSize='small' color='inherit' />
              <Box>Assign</Box>
            </Button>
          </Box>
          <Button
            size='large'
            type='submit'
            variant='contained'
            className={classes.button}
            disabled={toggleSearch}
            onClick={() => {
              setCandidateModalOpen(true)
              /*history.push('/platform/candidateDetail', {
                title: 'New Candidate' as any,
                color: '#F5B025' as any
              })*/
            }}
          >
            <Add fontSize='small' color='inherit' />
            <Box>Add Candidate</Box>
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
                    active={orderByCol === 'source'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('source')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Source</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel
                    hideSortIcon={isFetching}
                    active={orderByCol === 'applicationDate'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('applicationDate')
                      setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                      setPage(0)
                      setSorting(!sorting)
                    }}
                  >
                    <span>Application Date</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel
                    hideSortIcon={isFetching}
                    active={orderByCol === 'lastActivity'}
                    direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                    onClick={() => {
                      setOrderByCol('lastActivity')
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
                    <Delete fontSize='small' color='inherit' />
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
                  <span>Source</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Application Date</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Last Activity</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>D</span>
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
                        <span>{row.source}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{formatDate(row.applicationDate)}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>
                          {formatDate(row.modifiedDate)} {row.lastActivity}
                        </span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>
                          <Delete
                            style={{cursor: 'pointer'}}
                            fontSize='small'
                            color='inherit'
                            onClick={() => {
                              setName(row.applicantName)
                              setId(row.candidateId)
                              setRemoveModalOpen(true)
                            }}
                          />
                        </span>
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
        <ApplicantModal
          applicant={candidate}
          setApplicant={setCandidate}
          onSave={addApplicant}
          open={applicantModalOpen}
          onClose={() => setApplicantModalOpen(false)}
        />
        <CandidateModal
          open={candidateModalOpen}
          onClose={() => setCandidateModalOpen(false)}
          setApplicantModalOpen={setApplicantModalOpen}
          setSelectedValue={setSelectedValue}
        />
        <DeleteModal
          onRemoveClick={() => onRemoveClick()}
          id={id}
          name={name}
          open={removeModalOpen}
          onClose={() => setRemoveModalOpen(false)}
          entityName='applicant'
        />
      </>
    )
  }
)

export {CandidateTable}
