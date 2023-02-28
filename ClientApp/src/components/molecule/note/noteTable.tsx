import {useState, useEffect, ChangeEvent} from 'react'
import {useDispatch} from 'react-redux'
import {setToast, setSpinner} from 'store/action/globalActions'
import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles} from '@material-ui/core/styles'
import {spacing, typography, palette, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TablePagination} from '@material-ui/core'

import {useGetNotesByIdQuery} from 'graphql/Company/Queries/GetNotesByIdQuery.generated'
import {deleteNote} from 'api/actionsApi'
import {Add, Delete} from '@material-ui/icons'
import {Note} from 'type/note'
import NoteModal from '../note/noteModal'
import {formatDate} from 'utility'
import DeleteModal from '../delete/deleteModal'

import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'

type noteType = {
  entityId: number
  entityName: string
}

const useStyles = (loaded: boolean) =>
  makeStyles((theme) => ({
    principalContain: {
      backgroundColor: hrmangoColors.white,
      boxShadow: shadows[20],
      borderRadius: '16px',
      margin: `${spacing[16]}px ${spacing[32]}px`,
      fontWeight: typography.fontWeightMedium
    },
    rowHeader: {
      ...typography.h6
    },
    container: {
      position: 'relative',
      padding: `${spacing[16]}px`
    },
    table: {
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
      ...typography.buttonGreen
    },
    noteHeader: {
      paddingTop: spacing[16],
      display: 'flex',
      justifyContent: 'end'
    }
  }))

// eslint-disable-next-line
const NoteTable = withRouter(({entityId, entityName}: noteType & RouteComponentProps) => {
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [totalRows, setTotalRows] = useState(0)
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()

  const {data, isSuccess, isFetching, refetch} = useGetNotesByIdQuery(
    {
      entityId,
      entityName
    },
    {
      enabled: true,
      refetchOnMount: 'always'
    }
  )

  const classes = useStyles(!isFetching)()

  useEffect(() => {
    setTotalRows(data?.notesByEntity?.totalCount ?? 0)
  }, [data?.notesByEntity?.totalCount, isSuccess])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const rows = +event.target.value
    setPage(0)
    setRowsPerPage(rows)
  }

  const items = data?.notesByEntity?.items

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  const [id, setId] = useState(0)
  const [name] = useState<string | null | undefined>('')
  const [removeModalOpen, setRemoveModalOpen] = useState(false)
  const onRemoveClick = () => {
    dispatch(setSpinner(true))
    deleteNote(id.toString(), entityId.toString(), entityName)
      .then((response: any) => {
        dispatch(
          setToast({
            message: `Note successfully removed`,
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

  const [noteModalOpen, setNoteModalOpen] = useState(false)

  return (
    <>
      <Box className={classes.noteHeader}>
        <Button
          size='large'
          type='button'
          variant='contained'
          className={classes.button}
          style={{cursor: 'pointer'}}
          onClick={() => {
            setNoteModalOpen(true)
          }}
        >
          <Add fontSize='small' color='inherit' />
          <Box>Add Note</Box>
        </Button>
      </Box>
      <Box className={classes.rowHeader}>Notes</Box>
      <Table className={classes.table} stickyHeader>
        {!isFetching && items ? (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell} style={{width: '350px'}}>
                <span>Note by</span>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '450px'}}>
                <span>Note</span>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '350px'}}>
                <span>Modified</span>
              </TableCell>
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <TableCell className={classes.headerTableCell} style={{width: '350px'}}>
                  <span>Actions</span>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
        ) : (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <span>Note by</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Note</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Modified</span>
              </TableCell>
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <TableCell className={classes.headerTableCell}>
                  <span>Actions</span>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {items
            ? items?.map((row: Note, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      <span>{row.modifiedBy}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.text}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.modifiedDate)}</span>
                    </TableCell>
                    {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                      <TableCell className={classes.tableCell}>
                        <Delete
                          style={{cursor: 'pointer'}}
                          fontSize='small'
                          color='inherit'
                          onClick={() => {
                            setId(row.id)
                            setRemoveModalOpen(true)
                          }}
                        ></Delete>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            : Array.from(new Array(10)).map((row: Note, index: number) => (
                <TableRow key={`diversity-skeleton-row-${index}`}>
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
      <NoteModal
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        refetch={refetch}
        entityId={entityId}
        entityName={entityName}
      />
      <DeleteModal
        onRemoveClick={() => onRemoveClick()}
        id={id}
        name={name}
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        entityName='note'
      />
    </>
  )
})

export {NoteTable}
