import {useEffect, useState} from 'react'
import {useMutation} from 'react-query'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {useDispatch} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import {spacing, typography, palette, shadows, hrmangoColors} from 'lib/hrmangoTheme'
import {
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Link,
  TableBody,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  TextField
} from '@material-ui/core'
import {setToast, setSpinner} from 'store/action/globalActions'
import {useGetInvoiceDetailByNumberAsyncQuery} from 'graphql/Billing/GetInvoiceDetailByNumberQuery.generated'
import {Invoice} from 'graphql/types.generated'

import {GridOn, ArrowBack, MoreVert} from '@material-ui/icons'
import {LocationState} from 'type'
import {saveAs} from 'file-saver'
import {formatDate} from 'utility'
import {updateInvoice, xlsxExport} from 'api/billingApi'
import BillingItemModal from './billingItemModal'
import CurrentUserCache from 'lib/utility/currentUser'
import {ModalRoleEnums} from 'type/user/roles'
import {isAllowed} from 'utility'
const useStyles = (loaded: boolean) =>
  makeStyles((theme) => ({
    label: {
      marginLeft: spacing[32]
    },
    filter: {
      paddingTop: spacing[16],
      display: 'flex',
      justifyContent: 'end'
    },
    table: {
      borderTop: hrmangoColors.tableBorderStyle,
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
      ...typography.buttonGreen
    },
    button: {
      marginTop: '16px',
      marginLeft: '16px',
      ...typography.buttonDense
    },
    title: {
      ...typography.h6
    },
    subTitle: {
      ...typography.subtitle3,
      //paddingBottom: spacing[16],
      paddingTop: spacing[8]
    },
    row: {
      display: 'flex',
      justifyContent: 'end'
    },
    rowSpace: {
      paddingLeft: spacing[24]
    },
    textField: {
      marginLeft: '16px',
      '& .MuiFilledInput-input': {
        padding: '16px 13px'
      }
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
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      boxShadow: shadows[20],
      padding: spacing[24],
      fontWeight: typography.fontWeightMedium,
      backgroundColor: hrmangoColors.lightGray,
      borderRadius: '24px',
      width: '-webkit-fill-available',
      '& .MuiAutocomplete-popper': {
        marginTop: '80px',
        opacity: 0.9
      },
      '& .MuiContainer-root': {
        padding: spacing[0]
      }
    }
  }))

const InvoiceDetail = withRouter(
  ({match, history, location}: RouteComponentProps<{invoiceNumber: string}, StaticContext, LocationState>) => {
    const dispatch = useDispatch()
    const [invoiceItem, setInvoiceItem] = useState<Invoice>()
    const [billingItemModalOpen, setBillingItemModalOpen] = useState(false)
    const [billingItemId, setBillingItemId] = useState<number | undefined>(undefined)
    const [salesTaxEditOpen, setSalesTaxEditOpen] = useState(true)

    const {data, isSuccess, isFetching, refetch} = useGetInvoiceDetailByNumberAsyncQuery(
      {
        invoiceNumber: match.params.invoiceNumber
      },
      {
        enabled: true
      }
    )
    const classes = useStyles(!isFetching)()

    useEffect(() => {
      dispatch(setSpinner(isFetching))
    }, [isFetching]) // eslint-disable-line

    useEffect(() => {
      setInvoiceItem(data?.invoiceDetailByNumber ?? undefined)
      // eslint-disable-next-line
    }, [data?.invoiceDetailByNumber, isSuccess])

    const xls = useMutation(() => xlsxExport(match.params.invoiceNumber), {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error) => {
        dispatch(setSpinner(false))
      },
      onSuccess: (data: any) => {
        dispatch(setSpinner(false))
        data.blob().then((blob) => {
          const fileName = `Invoice_${match.params.invoiceNumber}.xlsx`
          saveAs(blob, fileName)
        })
      },
      retry: 0
    })

    const invoiceUpdate = useMutation(() => updateInvoice(invoiceItem?.id?.toString() ?? '', invoiceItem ?? {}), {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error: any) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Error saving the invoice: ${error.errorMessage}`,
            type: 'error'
          })
        )
      },
      onSuccess: (data: any) => {
        dispatch(setSpinner(false))
        data.json().then((invoice) => {
          dispatch(
            setToast({
              message: `${invoice.invoiceNumber} successfully saved.`,
              type: 'success'
            })
          )
        })
        refetch()
      },
      retry: 0
    })

    const goBack = () => {
      if (location && location?.state && location?.state?.backState)
        history.push({
          pathname: (location && location?.state && location?.state?.backUrl) ?? '',
          state: {
            header: location && location?.state && location?.state?.backState.header,
            params: {tab: 4, billingTab: 2}
          }
        })
      else history.push((location && location?.state && location?.state?.backUrl) ?? '')
    }

    return (
      <>
        <Box className={classes.header}>
          <ArrowBack style={{cursor: 'pointer'}} fontSize='medium' color='primary' onClick={goBack} />
          <Box>
            <span className={classes.title}>Invoice Number {match.params.invoiceNumber}</span>
            <p className={classes.subTitle}>
              <span>Account Manager: {invoiceItem?.accountManager}</span>
            </p>
            <p className={classes.subTitle}>
              <span>Terms: {invoiceItem?.terms}</span>
            </p>
            <p className={classes.subTitle}>
              <span>Start Date: {formatDate(invoiceItem?.startDate)}</span>
            </p>
            <p className={classes.subTitle}>
              <span>Payment Terms: {invoiceItem?.paymentTerms}</span>
            </p>
          </Box>
          <Box className={classes.rowSpace} />
          <Box>
            <span className={classes.title}></span>
            <p className={classes.subTitle}>
              <span>SubTotal: {invoiceItem?.subTotal}</span>
            </p>
            <p className={classes.subTitle}>
              {!salesTaxEditOpen &&
              isAllowed(CurrentUserCache?.roles, [
                ModalRoleEnums.Administrator,
                ModalRoleEnums.Level1,
                ModalRoleEnums.Level2
              ]) ? (
                <TextField
                  inputProps={{tabIndex: -1}}
                  className={classes.textField}
                  id='salesTax'
                  label='Sales Tax'
                  margin='normal'
                  variant='outlined'
                  value={invoiceItem?.salesTax}
                  onChange={(e: any) => {
                    setInvoiceItem({...invoiceItem!, salesTax: e.target.value})
                  }}
                  fullWidth
                />
              ) : (
                <span>Sales Tax: {invoiceItem?.salesTax}</span>
              )}
              {salesTaxEditOpen &&
              isAllowed(CurrentUserCache?.roles, [
                ModalRoleEnums.Administrator,
                ModalRoleEnums.Level1,
                ModalRoleEnums.Level2
              ]) ? (
                <Button
                  style={{width: '5%'}}
                  onClick={() => {
                    salesTaxEditOpen && setSalesTaxEditOpen(false)
                  }}
                >
                  <MoreVert fontSize='small' color='inherit' />
                </Button>
              ) : null}
            </p>
            <p className={classes.subTitle}>
              <span>Total: {invoiceItem?.total}</span>
            </p>
          </Box>
          {isAllowed(CurrentUserCache?.roles, [
            ModalRoleEnums.Administrator,
            ModalRoleEnums.Level1,
            ModalRoleEnums.Level2
          ]) && (
            <Box>
              <Box className={classes.row}>
                <FormControl component='div' fullWidth>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          inputProps={{tabIndex: -1}}
                          checked={invoiceItem?.invoiced ?? false}
                          onChange={(e: any) => {
                            setInvoiceItem({...invoiceItem!, invoiced: e.target.checked})
                          }}
                          name='invoiced'
                        />
                      }
                      label='Invoiced'
                    />
                  </FormGroup>
                </FormControl>
              </Box>
              <Box className={classes.row}>
                <FormControl component='div' fullWidth>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          inputProps={{tabIndex: -1}}
                          checked={invoiceItem?.isPaid ?? false}
                          onChange={(e: any) => {
                            setInvoiceItem({...invoiceItem!, isPaid: e.target.checked})
                          }}
                          name='paid'
                        />
                      }
                      label='Paid'
                    />
                  </FormGroup>
                </FormControl>
              </Box>
              <Box className={classes.row}>
                <Button
                  size='large'
                  type='submit'
                  variant='contained'
                  className={classes.buttonGreen}
                  onClick={() => {
                    invoiceUpdate.mutate()
                    setSalesTaxEditOpen(true)
                  }}
                >
                  <Box>Save Invoice</Box>
                </Button>
              </Box>
            </Box>
          )}
          <Box>
            <Box className={classes.row}>
              <Button
                size='large'
                type='submit'
                variant='contained'
                className={classes.buttonGreen}
                onClick={() => {
                  xls.mutate()
                }}
              >
                <GridOn fontSize='small' color='inherit' />
                <Box>Export XLS</Box>
              </Button>
            </Box>
          </Box>
        </Box>
        <Table className={classes.table} stickyHeader>
          {!isFetching && invoiceItem?.items ? (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Code</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Qty</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Hours worked</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Add Exp</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Req #</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Start Date</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Description</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Supervisor</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Cost Center</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Shared Risk Monthly</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Per Person</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Direct Hire</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Hourly</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <TableSortLabel hideSortIcon={isFetching}>
                    <span>Line Total</span>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
          ) : (
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerTableCell}>
                  <span>Code</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Qty</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Hours worked</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Add Exp</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Req #</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Start Date</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Description</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Supervisor</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Cost Center</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Shared Risk Monthly</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Per Person</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Direct Hire</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Hourly</span>
                </TableCell>
                <TableCell className={classes.headerTableCell}>
                  <span>Line Total</span>
                </TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {!isFetching && invoiceItem
              ? invoiceItem?.items?.map((row: typeof invoiceItem.items[0], index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className={classes.tableCell}>
                        {isAllowed(CurrentUserCache?.roles, [
                          ModalRoleEnums.Administrator,
                          ModalRoleEnums.Level1,
                          ModalRoleEnums.Level2
                        ]) ? (
                          <Link
                            onClick={() => {
                              setBillingItemId(row.id ?? undefined)
                              setBillingItemModalOpen(true)
                            }}
                          >
                            <span style={{cursor: 'pointer', color: '#0091D0'}}>{row.billingNumber}</span>
                          </Link>
                        ) : (
                          <span>{row.billingNumber}</span>
                        )}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.units}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.hoursWorked}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.adExp}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.reqNumber}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{formatDate(row.startDate)}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.description}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.supervisor}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>{row.costCenter}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>$ {row.sharedRiskMonthly}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>$ {row.perPerson}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>$ {row.directHire}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>$ {row.hourly}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span>$ {row.lineTotal}</span>
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
        <BillingItemModal
          open={billingItemModalOpen}
          onClose={() => setBillingItemModalOpen(false)}
          refetch={refetch}
          billingItemId={billingItemId}
        />
      </>
    )
  }
)

export {InvoiceDetail}
