import {useState, useEffect, ChangeEvent, useMemo} from 'react'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {useDispatch} from 'react-redux'
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

import {setToast, setSpinner} from 'store/action/globalActions'
import {CompanyFilterInput} from 'graphql/types.generated'
import {useGetCompanyDataQuery} from 'graphql/Company/Queries/GetCompanyDataQuery.generated'
import {CompanySortInput, SortEnumType} from 'graphql/types.generated'

import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'

import {Delete, AttachFile, FilterList, Check} from '@material-ui/icons'
import {LocationState} from 'type'
import DeleteModal from '../delete/deleteModal'
import ActivedModal from '../activedCompany/activedCompany'
import CompanyFiltersDrawer from './companyFiltersDrawer'
import {archive, activedCompany} from 'api/companyApi'

export const defaultFilters: CompanyFilterInput = {
  fromDate: undefined,
  toDate: undefined,
  companyName: undefined,
  email: undefined,
  phone: undefined,
  contact: undefined,
  hiringManager: undefined,
  companyType: undefined
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

const CompanyTable = withRouter(({location, history}: RouteComponentProps<{}, StaticContext, LocationState>) => {
  type SortCol = keyof Pick<
    CompanySortInput,
    | 'companyOwner'
    | 'companyName'
    | 'contact'
    | 'companyType'
    | 'companyVertical'
    | 'lastActivity'
    | 'document'
    | 'modifiedDate'
    | 'isActived'
    | 'internalReference'
  >

  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [totalRows, setTotalRows] = useState(0)
  const [sorting, setSorting] = useState(false)
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const [id, setId] = useState(0)
  const [name, setName] = useState<string | null | undefined>('')
  const [orderByCompanyType] = useState<SortCol>('companyType')
  const [orderByCol, setOrderByCol] = useState<SortCol>('modifiedDate')
  const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [removeModalOpen, setRemoveModalOpen] = useState(false)
  const [activedModalOpen, setActivedModalOpen] = useState(false)
  const [filters, setFilters] = useState<CompanyFilterInput>()

  const showReset = useMemo(() => {
    return (
      filters?.fromDate !== defaultFilters?.fromDate ||
      filters?.toDate !== defaultFilters?.toDate ||
      filters?.companyName !== defaultFilters?.companyName ||
      filters?.companyType !== defaultFilters?.companyType ||
      filters?.email !== defaultFilters?.email ||
      filters?.phone !== defaultFilters?.phone ||
      filters?.hiringManager !== defaultFilters?.hiringManager ||
      filters?.internalReference !== defaultFilters?.internalReference
    )
  }, [filters]) // eslint-disable-line

  const {data, isSuccess, isFetching, refetch} = useGetCompanyDataQuery(
    {
      filter: {...filters},
      order: {[orderByCompanyType]: SortEnumType.Asc, [orderByCol]: orderDir},
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
    setTotalRows(data?.companyData?.totalCount ?? 0)
  }, [data?.companyData?.totalCount, isSuccess])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const rows = +event.target.value
    setPage(0)
    setRowsPerPage(rows)
  }

  const items = data?.companyData?.items

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  const goToCompanyDetails = (row: any) => {
    history.push(`${routes.CompanyDetail}/${row.id}`, {
      header: {
        title: row.companyName,
        owner: row.companyOwner,
        type: row.companyType,
        color: location && location.state && location.state.header?.color
      }
    })
  }

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
  const companyId = id
  const onActivatedClick = () => {
    dispatch(setSpinner(true))
    activedCompany(companyId.toString())
      .then((response: any) => {
        dispatch(
          setToast({
            message: `Company successfully actived`,
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
        setActivedModalOpen(false)
      })
  }

  return (
    <>
      <Box className={classes.filter} color='secundary'>
        <Button size='large' type='submit' variant='contained' className={classes.button} onClick={toggleDrawer(true)}>
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
                  active={orderByCol === 'companyOwner'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('companyOwner')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>HRmango Account Manager</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'contact'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('contact')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Primary Contact</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'companyType'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('companyType')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Company Type</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'companyVertical'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('companyVertical')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Vertical</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'internalReference'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('internalReference')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Internal Reference</span>
                </TableSortLabel>
              </TableCell>
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <TableCell className={classes.headerTableCell}>
                  <span>
                    <Delete fontSize='small' color='inherit' />
                  </span>
                </TableCell>
              )}
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'document'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('document')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>
                    <AttachFile fontSize='small' color='inherit' />
                  </span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'isActived'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('isActived')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Activate Company</span>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
        ) : (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <span>Company Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>HRmango Account Manager</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Primary Contact</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Company Type</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Vertical</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Last Activity</span>
              </TableCell>
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <TableCell className={classes.headerTableCell}>
                  <span>D</span>
                </TableCell>
              )}
              <TableCell className={classes.headerTableCell}>
                <span>D</span>
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
                      <Link onClick={() => goToCompanyDetails(row)}>
                        <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.companyName}</span>
                      </Link>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.companyOwner}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.contact}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.companyType}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.companyVertical}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.internalReference}</span>
                    </TableCell>
                    {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                      <TableCell className={classes.tableCell}>
                        <span>
                          <Delete
                            style={{cursor: 'pointer'}}
                            fontSize='small'
                            color='inherit'
                            onClick={() => {
                              setName(row.companyName)
                              setId(row.id)
                              setRemoveModalOpen(true)
                            }}
                          />
                        </span>
                      </TableCell>
                    )}
                    <TableCell className={classes.tableCell}>
                      <span>{row.document}</span>
                    </TableCell>
                    {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                      <TableCell className={classes.tableCell}>
                        <span>
                          {row.isActived != null && !row.isActived && (
                            <div>
                              <Check
                                style={{cursor: 'pointer'}}
                                fontSize='small'
                                color='inherit'
                                onClick={() => {
                                  setName(row.companyName)
                                  setId(row.id)
                                  setActivedModalOpen(true)
                                }}
                              />
                            </div>
                          )}
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
                  {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                    <TableCell className={classes.tableCell}></TableCell>
                  )}
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
      <DeleteModal
        onRemoveClick={() => onRemoveClick()}
        id={id}
        name={name}
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        entityName='company'
      />
      <ActivedModal
        onActivatedClick={() => onActivatedClick()}
        id={id}
        name={name}
        open={activedModalOpen}
        onClose={() => setActivedModalOpen(false)}
        entityName='company'
      />
      <Drawer
        anchor={'right'}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <CompanyFiltersDrawer
          loaded={isFetching ?? false}
          defaultFilters={filters ?? defaultFilters}
          applyHandler={(filters) => applyFilters(filters)}
          closeHandler={toggleDrawer(false)}
          showReset={showReset}
        />
      </Drawer>
    </>
  )
})

export {CompanyTable}
