/*
  @author Oliver Zamora
  @description Billing API
*/
import {getGatewayServiceUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'
import {BillingItem, BillingSettings, Invoice} from 'graphql/types.generated'

const createSettingsApi = apiFactory(getGatewayServiceUrl('api/billing/create-settings'))
const updateSettingsApi = apiFactory(getGatewayServiceUrl('api/billing/update-settings'))
const createBillingItemApi = apiFactory(getGatewayServiceUrl('api/billing/create-billingItem'))
const deleteBillingItemApi = apiFactory(getGatewayServiceUrl('api/billing/delete-billingItem'))
const updateBillingItemApi = apiFactory(getGatewayServiceUrl('api/billing/update-billingItem'))
const createInvoiceApi = apiFactory(getGatewayServiceUrl('api/billing/create-invoice'))
const updateInvoiceApi = apiFactory(getGatewayServiceUrl('api/billing/update-invoice'))

const xlsxExportInvoiceApi = apiFactory(getGatewayServiceUrl('api/billing/exportInvoiceXlsx'))
const pdfExportInvoiceApi = apiFactory(getGatewayServiceUrl('api/billing/exportInvoicePdf'))

const xlsxExport = (invoiceNumber: string) => {
  return xlsxExportInvoiceApi.post<any>({invoiceNumber}, {})
}

const pdfExport = (invoiceNumber: string) => {
  return pdfExportInvoiceApi.post<any>({invoiceNumber}, {})
}
const createSettings = (settings: BillingSettings) => {
  return createSettingsApi.post<any>({}, settings)
}

const updateSettings = (settingsId: string, settings: BillingSettings) => {
  return updateSettingsApi.put<any>(undefined, {settingsId}, settings)
}

const createBillingItem = (billingItem: BillingItem) => {
  return createBillingItemApi.post<any>({}, billingItem)
}

const deleteBillingItem = (itemId: string) => {
  return deleteBillingItemApi.delete(undefined, {itemId})
}

const updateBillingItem = (itemId: string, billingItem: BillingItem) => {
  return updateBillingItemApi.put<any>(undefined, {itemId}, billingItem)
}

const createInvoice = (invoice: Invoice) => {
  return createInvoiceApi.post<any>({}, invoice)
}

const updateInvoice = (invoiceId: string, invoiceItem: Invoice) => {
  return updateInvoiceApi.put<any>(undefined, {invoiceId}, invoiceItem)
}

export {
  createSettings,
  updateSettings,
  createBillingItem,
  deleteBillingItem,
  updateBillingItem,
  createInvoice,
  updateInvoice,
  xlsxExport,
  pdfExport
}
