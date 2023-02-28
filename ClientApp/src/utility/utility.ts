import {formatInTimeZone} from 'date-fns-tz'
import {isSameDay} from 'date-fns'
import {config} from '../lib/config'

const isNumeric = (value: any): boolean => {
  return !isNaN(value - parseFloat(value))
}

const isObjectEmpty = (obj: object) => Object.keys(obj).length === 0

const formatCurrency = (num?: number, excludeDecimal?: boolean, toFixed: number = 0) => {
  if (num === 0) {
    return num.toFixed(toFixed)
  } else if (num) {
    return excludeDecimal
      ? num.toFixed().replace(/\d(?=(\d{3})+$)/g, '$&,')
      : num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  } else {
    return ''
  }
}

const thousandsFormat = (num: number, excludeDecimal: boolean = true, toFixed: number = 1) => {
  /*  @description numbers over a million will be shortened & append 'K', e.g. 15000 will become 15K
  else it will be ran through formatCurrency with a default of true for removing decimal */
  return Math.abs(Number(num)) > 999 ? (num / 1.0e3).toFixed(toFixed) + 'K' : formatCurrency(num, excludeDecimal)
}

const millionsFormat = (num: number, excludeDecimal: boolean = true, toFixed: number = 1) => {
  /*  @description numbers over a million will be shortened & append 'M', e.g. 1500000 will become 1.5M
  else it will be ran through formatCurrency with a default of true for removing decimal */
  return Math.abs(Number(num)) > 999999 ? (num / 1.0e6).toFixed(toFixed) + 'M' : formatCurrency(num, excludeDecimal)
}

const abbreviatedNumberFormat = (num: number, excludeZero: boolean = false) => {
  let result = ''
  let notRoundedNumber

  if (num >= 1000000000) {
    notRoundedNumber = Number((Math.abs(Number(num)) / 1.0e9).toFixed(1))
    result = notRoundedNumber.toFixed(notRoundedNumber % 1 !== 0 ? 1 : excludeZero ? 0 : 1) + 'B'
  } else if (num >= 1000000) {
    notRoundedNumber = Number((Math.abs(Number(num)) / 1.0e6).toFixed(1))
    result = notRoundedNumber.toFixed(notRoundedNumber % 1 !== 0 ? 1 : excludeZero ? 0 : 1) + 'M'
  } else if (num >= 1000) {
    notRoundedNumber = Number((Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1))
    result = notRoundedNumber.toFixed(notRoundedNumber % 1 !== 0 ? 1 : excludeZero ? 0 : 1) + 'K'
  } else if (num > 1000) {
    result = formatCurrency(num, !(num < 1 && num > -1)) || ''
  } else if (num <= -1000000000) {
    notRoundedNumber = Number((Math.abs(Number(num)) / 1.0e9).toFixed(1))
    result = `-${notRoundedNumber.toFixed(notRoundedNumber % 1 !== 0 ? 1 : excludeZero ? 0 : 1)}B`
  } else if (num <= -1000000) {
    notRoundedNumber = Number((Math.abs(Number(num)) / 1.0e6).toFixed(1))
    result = `-${notRoundedNumber.toFixed(notRoundedNumber % 1 !== 0 ? 1 : excludeZero ? 0 : 1)}M`
  } else if (num <= -1000) {
    notRoundedNumber = Number((Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1))
    result = notRoundedNumber.toFixed(notRoundedNumber % 1 !== 0 ? 1 : excludeZero ? 0 : 1) + 'K'
  } else if (num < 1000 || num > 0) {
    result = formatCurrency(Number(num), false) || ''
  } else {
    result = formatCurrency(num, !(num > -1), 0) || ''
  }
  return result
}

const toUsDate = (date: Date | string) => new Date(date).toLocaleDateString(config.localDateLang)

const toPercent = (num: number, places: number = 0) => {
  if (num.toFixed(places) === '-0') {
    return '0%'
  }
  return `${num.toFixed(places)}%`
}

const isLessThanOnePercent = (num: number, places: number = 0) => {
  if (num > 0 && num.toFixed(places) === '0') {
    return ' < 1%'
  } else if (num.toFixed(places) === '-0') {
    return '0%'
  }
  return `${num.toFixed(places)}%`
}

const toPercentNoPercentage = (num: number, places: number = 0) => `${num.toFixed(places)}`

const formatPhoneNumber = (phoneNumber: number) => {
  const phoneNumberString = phoneNumber.toString()
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phoneNumberString
}

const formatZipcode = (zipcode: string) => {
  const cleaned = ('' + zipcode).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{5})(\d{4})$/)
  if (match) {
    return match[1] + '-' + match[2]
  }
  return zipcode
}

const hasNumber = (myString: string) => /\d/.test(myString)

const fileSizeUnits = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

const getFileSize = (sizeInBytes: number, precision: number = 2): string => {
  if (isNaN(parseFloat(String(sizeInBytes))) || !isFinite(sizeInBytes)) return '?'

  let fileSizeUnit = 0
  let bytes = sizeInBytes

  while (bytes >= 1024) {
    bytes /= 1024
    fileSizeUnit++
  }

  return `${bytes.toFixed(precision)} ${fileSizeUnits[fileSizeUnit]}`
}

type numberOrString = number | string

// findMode aka findMostFrequent : return the mode or multiple if same frequency
const findMode = (array: numberOrString[]) => {
  const totals = array.reduce((prev, curr, i) => {
    const newVal = {...prev, [curr]: (prev[curr] || 0) + 1}

    return newVal
  }, {} as Record<numberOrString, number>)

  return Object.keys(totals)
    .map((key) => [key, totals[key]] as [numberOrString, number])
    .sort(([, a], [, b]) => b - a)
    .filter(([, count], _, arr) => count === arr[0][1])
    .map(([thing]) => thing)
}

const getBatch = <T>(array: T[], batchSize: number = 10) => {
  const len = array.length
  let lastBatchSize = batchSize
  let currentIndex = 0
  let storedArray = [...array]

  const done = () => currentIndex >= len
  const next = (nextBatchSize: number = lastBatchSize) => {
    lastBatchSize = nextBatchSize
    const nextSize = len - currentIndex + 1 < nextBatchSize ? len - currentIndex : nextBatchSize
    const batch = storedArray.slice(currentIndex, currentIndex + nextSize)
    currentIndex = currentIndex + nextSize

    return batch
  }
  const sort = (compareFn?: (a: T, b: T) => number) => {
    storedArray = [...array].sort(compareFn)
    currentIndex = 0
  }
  const sortAndGetFirstBatch = (compareFn?: (a: T, b: T) => number, firstBatchSize: number = lastBatchSize) => {
    sort(compareFn)

    return next(firstBatchSize)
  }

  return {
    next,
    done,
    sort,
    sortAndGetFirstBatch
  }
}

/**
 * Transforms object to key value pair array [{ key, value }, { key, value }]
 * @param obj Object to transform
 */
const objectToKVPArray = <T extends Object>(obj: T) =>
  Object.keys(obj).map((key) => ({key, value: obj[key]} as {key: keyof T; value: T[keyof T]}))

const defaultTimeZone = 'America/New_York'

/**
 * Get Timezone from Browser if available
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
 * May not work in IE11 so defaulting to Eastern aka 'America/New_York'
 */
let getTimeZone = () => {
  // TODO: use TS 3.7 obj?.val ?? default
  // Check if browser has Timezone because IE11
  if (Intl && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions) {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || defaultTimeZone
  }

  return defaultTimeZone
}

export const IEIntlPolyfill = async () => {
  if (Intl && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions) {
    const opts = Intl.DateTimeFormat().resolvedOptions()
    if (opts.timeZone) {
      return // No Polyfill needed
    }
  }

  const moment = await import(/* webpackChunkName: "moment-timezone" */ 'moment-timezone')
  const currentTimeZone = moment.tz.guess()

  if (currentTimeZone) {
    console.info('Loaded moment Timezone polyfill, Current TimeZone: ', currentTimeZone)
    getTimeZone = () => currentTimeZone // Reassign getTimeZone function
  } else {
    console.info('No TimeZone Found Defaulting to  ', defaultTimeZone)
    getTimeZone = () => defaultTimeZone // Reassign getTimeZone function
  }
}

/**
 * Formats date with custom format string
 *  gets timezone display from date-fns-timezone library plus current user's timezone if browser allows
 *  Curry with format string and optional get timezone function returns
 * @param format String for format can include custom timezone display formatting
 * @param getUserTZ function defaults to utility function that returns a TimeZone String default 'America/New_York' if browser
 */
export const formatDateWithUserTZ = (format: string, getUserTZ: () => string = getTimeZone) => {
  const timeZone = getUserTZ()

  return (date: Date) => formatInTimeZone(date, timeZone, format)
}

export const backInNam = new Date(0)
export const isBackInNam = (date: Date) => isSameDay(backInNam, date)

export const randomizeArray = <T>(array: T[]) => {
  for (let i = 0, randNum, tempPlace; i < array.length; i++) {
    randNum = Math.floor(Math.random() * i)
    tempPlace = array[i]
    array[i] = array[randNum]
    array[randNum] = tempPlace
  }

  return array
}

export const getCategoryAlias = (list: any, categoryToReplace: string) => {
  return list.find((x: any) => x.name === categoryToReplace)
}

export {
  isObjectEmpty,
  formatCurrency,
  toUsDate,
  toPercent,
  isLessThanOnePercent,
  toPercentNoPercentage,
  isNumeric,
  getFileSize,
  findMode,
  getBatch,
  hasNumber,
  thousandsFormat,
  millionsFormat,
  objectToKVPArray,
  abbreviatedNumberFormat,
  formatPhoneNumber,
  formatZipcode
}
