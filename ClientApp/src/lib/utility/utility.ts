import {config} from '../config'
//import {format} from 'date-fns'
//import {formatToTimeZone} from 'date-fns-timezone'
import {format} from 'date-fns-tz'

export const clearEmptyValues = <T>(query: Record<string, T> | {[key: string]: T}) =>
  Object.keys(query).reduce((prev, curr) => {
    if (curr && query[curr]) {
      return {
        ...prev,
        [curr]: query[curr]
      }
    }

    return prev as any
  }, {} as Record<string, string>)

type Config = typeof config

const pathQueryHelper = (configUrl?: Config[keyof Config]) => (path: string) => {
  return `${configUrl}${path}`
}

export const getHRMangoUrl = pathQueryHelper(config.hrMangoUrl)

export const getAuthServiceUrl = pathQueryHelper(config.authServiceUrl)

export const getGatewayServiceUrl = pathQueryHelper(config.gatewayServiceUrl)

export const getRequisitionUrl = pathQueryHelper(config.requisitionServiceUrl)

export const isBrowserIE11 = () =>
  Boolean((window as any).MSInputMethodContext) && Boolean((document as any).documentMode)

export const isEdgeBrowser = () => navigator.userAgent.indexOf('Edge') >= 0

export const shortenString = (data: string, length: number = 35) => {
  const ellipsis = data && data.length > length ? '...' : ''

  return data && data.substring(0, length) + ellipsis
}

export const titleCase = (str: string) => {
  return str?.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const formatDate = (label?: any, excludeHour: boolean = false) => {
  if (label === null || label === undefined) return label
  const dateTime = new Date(label)
  const formattedDate = format(dateTime, 'MMMM/dd/yyyy KK:mm a (z)')
  //const timezone = formatToTimeZone(dateTime, 'MMMM/dd/yyyy KK:mm a', {timeZone})
  const [date, hour, m, timezone] = formattedDate.split(' ')
  const [month, day, year] = date.split('/')

  return excludeHour ? `${month} ${day}, ${year}` : `${month} ${day}, ${year} ${hour} ${m} ${timezone}`
}
