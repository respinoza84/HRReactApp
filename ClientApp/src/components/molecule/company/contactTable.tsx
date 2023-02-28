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
  Box,
  Button,
  Link
} from '@material-ui/core'
import {SortEnumType, ContactSortInput} from 'graphql/types.generated'
import {useGetContactsQuery} from 'graphql/Contact/Queries/GetContactsQuery.generated'
import {setSpinner} from 'store/action/globalActions'
import {Add} from '@material-ui/icons'
import {ContactModal} from '../contact/contactModal'

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
    'contactName' | 'phone' | 'email' | 'addressLine1' | 'city' | 'state' | 'country' | 'zipCode'
  >
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows] = useState(0)
  const [page, setPage] = useState(0)
  const [contactId, setContactId] = useState<number | undefined>(0)
  const [orderByCol, setOrderByCol] = useState<SortCol>('contactName')
  const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)

  const {data, isFetching, refetch} = useGetContactsQuery({
    companyId: parseInt(match.params.companyId),
    order: {[orderByCol]: orderDir},
    skip: page * rowsPerPage,
    take: rowsPerPage
  })

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  const items = data?.contacts?.items

  const [contactModalOpen, setContactModalOpen] = useState(false)

  return (
    <>
      <Box className={classes.rowHeader}>Contacts</Box>
      <Box className={classes.contactHeader}>
        <Button
          size='large'
          type='button'
          variant='contained'
          className={classes.button}
          style={{cursor: 'pointer'}}
          onClick={() => {
            setContactId(undefined)
            setContactModalOpen(true)
          }}
        >
          <Add fontSize='small' color='inherit' />
          <Box>Add Contact</Box>
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
            </TableRow>
          </TableHead>
        ) : (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <span>Contact Name</span>
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
                          setContactModalOpen(true)
                        }}
                      >
                        <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.contactName}</span>
                      </Link>
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
      <ContactModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        refetch={refetch}
        contactId={contactId}
        companyId={parseInt(match.params.companyId)}
      />
    </>
  )
})

export {ContactTable}
