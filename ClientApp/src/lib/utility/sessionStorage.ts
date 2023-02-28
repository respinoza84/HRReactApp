import hash from 'object-hash'
import {compressToUTF16, decompressFromUTF16} from 'lz-string'

const noParse = <T>(x: T) => x

const getOrStore = (key: string, getter: () => string) => {
  const sessionValue = sessionStorage.getItem(key)

  if (sessionValue) {
    return decompressFromUTF16(sessionValue)
  }

  const getterVal = getter()
  storeByKey(key, noParse)(getterVal)

  return getterVal
}

const getString = (key: string) => sessionStorage.getItem(key)

const getObject = <T>(key: string) => {
  const text = getString(key)

  return text ? (JSON.parse(text) as T) : undefined
}

const getStringIfExists = (key: string, compressed = true) => {
  const sessionValue = sessionStorage.getItem(key)
  const setter = (getter: () => string) => storeByKey(key, noParse)(getter())
  const val = sessionValue ? (compressed ? decompressFromUTF16(sessionValue) : sessionValue) : null

  return [val, setter] as [string | null, (getter: () => string) => void]
}

const getValueIfExists = <T>(key: string) => {
  try {
    //const sessionString = sessionStorage.getItem(key)
    const sessionValue = /*sessionString ? JSON.parse(decompressFromUTF16(sessionString)) :*/ null

    const setter = storeByKey(key)

    return [sessionValue, setter] as [T | null, (item: T) => void]
  } catch (e) {
    throw Error(e)
  }
}

const hashRecord = (record: Record<string, string>, nonce?: string) => {
  const hashedRec = nonce ? hash({...record, nonce}) : hash(record)

  return hashedRec
}

const storeByKey = (key: string, valGetter: (item: any) => string = JSON.stringify, compress = true) => (item: any) => {
  try {
    sessionStorage.setItem(key, compress ? compressToUTF16(valGetter(item)) : valGetter(item))
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e)
    remove(key)
    throw e
  }
}

const removeMatch = (filterMatch: (key: string) => boolean) =>
  Object.keys(sessionStorage).filter(filterMatch).map(remove)

const remove = (key: string) => sessionStorage.removeItem(key)

const clearSessionStorage = () => sessionStorage.clear()

export {
  getOrStore,
  storeByKey,
  remove,
  getStringIfExists,
  hashRecord,
  getValueIfExists,
  clearSessionStorage,
  removeMatch,
  getString,
  getObject
}
