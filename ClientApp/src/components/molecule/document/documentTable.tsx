import {useState, useEffect, ChangeEvent} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import {makeStyles} from '@material-ui/core/styles'
import {DropzoneArea} from 'material-ui-dropzone'
import {formatDate} from 'utility'

import {spacing, typography, palette, hrmangoColors, shadows} from 'lib/hrmangoTheme'
import {Box, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TablePagination} from '@material-ui/core'

import {useDispatch} from 'react-redux'
import {setSpinner, setToast} from 'store/action/globalActions'
import {useGetDocumentsQuery} from 'graphql/Documents/GetDocumentsQuery.generated'
import {deleteDocument, addDocument} from 'api/documentsApi'
import {DocumentSortInput, SortEnumType} from 'graphql/types.generated'
import {Delete} from '@material-ui/icons'
import DeleteModal from '../delete/deleteModal'

import {isAllowed} from 'utility'
import {ModalRoleEnums} from 'type/user/roles'
import CurrentUserCache from 'lib/utility/currentUser'

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
      padding: `${spacing[16]}px`,
      zIndex: 0
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
    dropzone: {
      backgroundColor: hrmangoColors.white,
      zIndex: 1,
      minHeight: '150px',
      '& .MuiTypography-h5': {
        ...typography.body1
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
      //marginBottom: '16px',
      ...typography.buttonDense
    },
    spinner: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
  }))

type documentType = {
  entityId: number
  entityName: string
}

// eslint-disable-next-line
const DocumentTable = withRouter(({entityId, entityName, history}: documentType & RouteComponentProps) => {
  type SortCol = keyof Pick<DocumentSortInput, 'fileName' | 'fileType' | 'modifiedDate'>

  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [totalRows, setTotalRows] = useState(0)
  const [sorting, setSorting] = useState(false)
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const [orderByCol, setOrderByCol] = useState<SortCol>('fileName')
  const [orderDir, setOrderDir] = useState<SortEnumType>(SortEnumType.Desc)

  const {data, isSuccess, isFetching, refetch} = useGetDocumentsQuery(
    {
      entityId,
      entityName,
      skip: page * rowsPerPage,
      take: rowsPerPage,
      order: {[orderByCol]: orderDir}
    },
    {
      enabled: true,
      keepPreviousData: true
    }
  )
  const classes = useStyles(!isFetching)()

  useEffect(() => {
    setTotalRows(data?.documents?.totalCount ?? 0)
  }, [data?.documents?.totalCount, isSuccess])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const rows = +event.target.value
    setPage(0)
    setRowsPerPage(rows)
  }

  const items = data?.documents?.items

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  const [id, setId] = useState(0)
  const [name, setName] = useState<string | null | undefined>('')
  const [removeModalOpen, setRemoveModalOpen] = useState(false)
  const onRemoveClick = () => {
    dispatch(setSpinner(true))
    deleteDocument(id.toString(), entityId.toString(), entityName)
      .then((response: any) => {
        dispatch(
          setToast({
            message: `Document successfully removed`,
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
      <Box className={classes.rowHeader}>Documents</Box>
      <Table className={classes.table} stickyHeader>
        {!isFetching && items ? (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell} style={{width: '300px'}}>
                <TableSortLabel
                  hideSortIcon={!isFetching}
                  active={orderByCol === 'fileName'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('fileName')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Name</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '283px'}}>
                <TableSortLabel
                  hideSortIcon={!isFetching}
                  active={orderByCol === 'fileType'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('fileType')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Type</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '381px'}}>
                <span>Size</span>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '283px'}}>
                <TableSortLabel
                  hideSortIcon={!isFetching}
                  active={orderByCol === 'modifiedDate'}
                  direction={orderDir === 'DESC' ? 'desc' : 'asc'}
                  onClick={() => {
                    setOrderByCol('modifiedDate')
                    setOrderDir(orderDir === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc)
                    setPage(0)
                    setSorting(!sorting)
                  }}
                >
                  <span>Modified</span>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                <span>Modified By</span>
              </TableCell>
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <TableCell className={classes.headerTableCell} style={{width: '360px'}}>
                  <span>Action</span>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
        ) : (
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerTableCell}>
                <span>Name</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Type</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Size</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Modified</span>
              </TableCell>
              <TableCell className={classes.headerTableCell}>
                <span>Modified By</span>
              </TableCell>
              {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                <TableCell className={classes.headerTableCell}>
                  <span>Action</span>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {items
            ? items?.map((row: typeof items[0], index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      <a href={row.blobPath} download={`Document: ${row.fileName}`} target='_blank' rel='noreferrer'>
                        <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.fileName}</span>
                      </a>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.fileType}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.fileSize}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{formatDate(row.modifiedDate)}</span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span>{row.modifiedBy}</span>
                    </TableCell>
                    {isAllowed(CurrentUserCache?.roles, [ModalRoleEnums.Administrator]) && (
                      <TableCell className={classes.tableCell}>
                        <Delete
                          style={{cursor: 'pointer'}}
                          fontSize='small'
                          color='inherit'
                          onClick={() => {
                            setName(row.fileName)
                            setId(row.id)
                            setRemoveModalOpen(true)
                          }}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            : Array.from(new Array(10)).map((row: any, index: number) => (
                <TableRow key={`diversity-skeleton-row-${index}`}>
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
      <div className={classes.container}>
        <DropzoneArea
          showPreviews={true}
          maxFileSize={26214400}
          showPreviewsInDropzone={false}
          useChipsForPreview
          dropzoneText={`Drag and drop a file here ...or click the cloud to browse into the computer instead`}
          dropzoneClass={classes.dropzone}
          showFileNamesInPreview={false}
          showFileNames={false}
          showAlerts={false}
          onDrop={(fileObjects) => {
            fileObjects.forEach((item) => {
              const reader = new FileReader()
              reader.onloadend = (event: any) => {
                if (event.target.readyState === FileReader.DONE) {
                  dispatch(setSpinner(true))
                  addDocument({
                    fileName: item.name,
                    fileType: item.type,
                    fileSize: item.size.toString(),
                    fileContents: event.target.result.replace(/^.+?(;base64),/, ''),
                    entityId: entityId,
                    entityName: entityName
                  }).finally(() => {
                    dispatch(setSpinner(false))
                    dispatch(
                      setToast({
                        message: `Document added successfully`,
                        type: 'success'
                      })
                    )
                    refetch()
                  })
                }
              }
              reader.readAsDataURL(item)
            })
          }}
        />
      </div>
      <DeleteModal
        onRemoveClick={() => onRemoveClick()}
        id={id}
        name={name}
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        entityName='document'
      />
    </>
  )
})

export {DocumentTable}
