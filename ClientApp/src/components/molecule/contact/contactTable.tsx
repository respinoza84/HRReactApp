import {ChangeEvent, useEffect, useState} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
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
  Drawer,
  Box,
  Button,
  Link
} from '@material-ui/core'
import {SortEnumType, ContactSortInput, ContactFilterInput} from 'graphql/types.generated'
import {useGetAllContactsQuery} from 'graphql/Contact/Queries/GetAllContactsQuery.generated'
import {setSpinner, setToast} from 'store/action/globalActions'
import ContactFiltersDrawer from './contactFiltersDrawer'
import {FilterList, Delete} from '@material-ui/icons'
import {ContactModal} from './contactModal'
import DeleteModal from '../delete/deleteModal'
import {deleteContact} from 'api/companyApi'
import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'

export const defaultFilters: ContactFilterInput = {
  companyName: '',
  state: ''
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
    },
    rowHeader: {
      ...typography.h6
    },
    contactHeader: {
      paddingTop: spacing[16],
      display: 'flex',
      justifyContent: 'end'
    }
  }))

const ContactTable = withRouter(({match}: RouteComponentProps<{companyId: string}>) => {
  const [sorting, setSorting] = useState(false)
  const dispatch = useDispatch()
  const classes = useStyles(true)()
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const rows = +event.target.value
    setPage(0)
    setRowsPerPage(rows)
  }

  type SortCol = keyof Pick<
    ContactSortInput,
    | 'contactName'
    | 'companyName'
    | 'phone'
    | 'email'
    | 'addressLine1'
    | 'city'
    | 'state'
    | 'country'
    | 'zipCode'
    | 'modifiedDate'
  >
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [totalRows, setTotalRows] = useState(0)
  const [page, setPage] = useState(0)
  const [orderByCol, setOrderByCol] = useState<SortCol>('modifiedDate')
  const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
  const [filters, setFilters] = useState<ContactFilterInput>()
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [contactId, setContactId] = useState<number>(0)
  const [companyId, setCompanyId] = useState<number | undefined>(0)
  const [name, setName] = useState<string | null | undefined>('')

  const {data, isSuccess, isFetching, refetch} = useGetAllContactsQuery({
    filter: {...filters},
    order: {[orderByCol]: orderDir},
    skip: page * rowsPerPage,
    take: rowsPerPage
  })

  useEffect(() => {
    setTotalRows(data?.allContacts?.totalCount ?? 0)
  }, [data?.allContacts?.totalCount, isSuccess])

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  const items = data?.allContacts?.items
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = (open: boolean) => (event: any) => {
    setDrawerOpen(open)
  }

  const applyFilters = (filters: any) => {
    setFilters(filters)
    refetch()
  }
  const [removeModalOpen, setRemoveModalOpen] = useState(false)

  const onRemoveClick = () => {
    dispatch(setSpinner(true))
    deleteContact(contactId?.toString())
      .then((response: any) => {
        dispatch(
          setToast({
            message: `Contact successfully removed`,
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
                  active={orderByCol === 'contactName'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('contactName')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Contact Name</span>
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
                  active={orderByCol === 'phone'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('phone')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Telephone</span>
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
                  active={orderByCol === 'addressLine1'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('addressLine1')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Address</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'city'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('city')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Town/City</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'state'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('state')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>State</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'zipCode'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('zipCode')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Zip Code</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'country'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('country')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Country</span>
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
                <span>Contact Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Company Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Telephone</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Email</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Address</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Town/City</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>State</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Zip Code</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Country</span>
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
        )}
        <TableBody>
          {!isFetching && items
            ? items?.map((row: typeof items[0], index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      <Link
                        onClick={() => {
                          setContactId(row.id)
                          setCompanyId(row.companyId)
                          setContactModalOpen(true)
                        }}
                      >
                        <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.contactName}</span>
                      </Link>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.companyName}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.phone}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.email}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>
                        {row.addressLine1} {row.addressLine2}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.city}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.state}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.zipCode}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.country}</span>
                    </TableCell>
                    {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                      <TableCell className={classes.tableCell}>
                        <span>
                          <Delete
                            style={{cursor: 'pointer'}}
                            fontSize='small'
                            color='inherit'
                            onClick={() => {
                              setName(row.contactName)
                              setContactId(row.id)
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
      <ContactModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        refetch={refetch}
        contactId={contactId}
        companyId={companyId}
      />
      <Drawer
        anchor={'right'}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <ContactFiltersDrawer
          loaded={isFetching ?? false}
          defaultFilters={defaultFilters}
          applyHandler={(filters) => applyFilters(filters)}
          closeHandler={toggleDrawer(false)}
        />
      </Drawer>
      <DeleteModal
        onRemoveClick={() => onRemoveClick()}
        id={contactId}
        name={name}
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        entityName='contact'
      />
    </>
  )
})

export {ContactTable}
