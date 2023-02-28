import {useState, useEffect, ChangeEvent} from 'react'

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
  Link
} from '@material-ui/core'
import CurrentUserCache from 'lib/utility/currentUser'
import {setSpinner} from 'store/action/globalActions'
import {useGetAllUsersAsyncQuery} from 'graphql/Users/GetAllUsersQuery.generated'
import {UserSortInput, UserFilterInput, SortEnumType, User} from 'graphql/types.generated'
import {LocationState} from 'type'
import {ModalRoleEnums} from 'type/user/roles'
import UserModal from './userModal'
import {isAllowed} from 'utility'

export const defaultFilters: UserFilterInput = {
  fromDate: '',
  toDate: '',
  email: ''
}

const defaultUser = {
  firstName: '',
  lastName: '',
  email: '',
  roles: ['6'],
  passwordReset: undefined
}

export type UserTableType = {
  tableFilters?: UserFilterInput
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

const UserTable = withRouter(({location, history}: RouteComponentProps<{}, StaticContext, LocationState>) => {
  type SortCol = keyof Pick<UserSortInput, 'userName' | 'email'>

  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [totalRows, setTotalRows] = useState(0)
  const [sorting, setSorting] = useState(false)
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const [orderByCol, setOrderByCol] = useState<SortCol>('email')
  const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)
  const [filters] = useState<UserFilterInput>()
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [user, setUser] = useState<User>()
  const {data, isSuccess, isFetching, refetch} = useGetAllUsersAsyncQuery(
    {
      filter: {...filters}
    },
    {
      enabled: true,
      refetchOnMount: 'always'
    }
  )
  const classes = useStyles(!isFetching)()

  useEffect(() => {
    setTotalRows(data?.allUsers?.totalCount ?? 0)
  }, [data?.allUsers, isSuccess])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const rows = +event.target.value
    setPage(0)
    setRowsPerPage(rows)
  }

  const items = data?.allUsers?.items

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  /*const applyFilters = (filters: any) => {
    setFilters(filters)
    refetch()
  }*/

  return (
    <>
      <Box className={classes.filter} color='secundary'>
        <Button
          size='large'
          type='submit'
          variant='contained'
          className={classes.button}
          onClick={() => {
            setUser(defaultUser as User)
            setUserModalOpen(true)
          }}
        >
          New User
        </Button>
      </Box>
      <Table className={classes.table} stickyHeader>
        {!isFetching && items ? (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <TableSortLabel
                  hideSortIcon={isFetching}
                  active={orderByCol === 'userName'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('userName')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>User Name</span>
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
                <span>Roles</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>is Account Closed?</span>
              </TableCell>
            </TableRow>
          </TableHead>
        ) : (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <span>User Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Email</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Roles</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>is Account Closed?</span>
              </TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {!isFetching && items
            ? items?.map((row: typeof items[0], index: number) => {
                row.displayRoles = []
                row.roles?.forEach((x) => {
                  x === Number.parseInt(ModalRoleEnums.Administrator)
                    ? row.displayRoles?.push('Administrator')
                    : x === Number.parseInt(ModalRoleEnums.HiringManager)
                    ? row.displayRoles?.push('Hiring Manager')
                    : x === Number.parseInt(ModalRoleEnums.Level1)
                    ? row.displayRoles?.push('Level 1')
                    : x === Number.parseInt(ModalRoleEnums.Level2)
                    ? row.displayRoles?.push('Level 2')
                    : row.displayRoles?.push('')
                })

                return (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) ? (
                        <Link
                          onClick={() => {
                            row.passwordReset = false
                            setUser(row as User)
                            setUserModalOpen(true)
                          }}
                        >
                          <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.userName}</span>
                        </Link>
                      ) : (
                        <span>{row.userName}</span>
                      )}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.email}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.displayRoles?.join(', ')}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.isAccountClosed?.toString()}</span>
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
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <UserModal
        user={user}
        setUser={setUser}
        open={userModalOpen}
        refetch={refetch}
        onClose={() => setUserModalOpen(false)}
      />
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
    </>
  )
})

export {UserTable}
