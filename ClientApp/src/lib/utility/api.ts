/*
  @author Guido Arce
  @description Api Factory
*/

import {clearEmptyValues, isBrowserIE11} from './utility'
import {hashRecord, getValueIfExists} from './sessionStorage'
import {getToken} from '../authentication/authentication'
import {config} from '../config'

export type AbortSignal = {
  aborted: boolean
  onabort: ((this: AbortSignal, ev: Event) => any) | null
  addEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => void
  dispatchEvent: (event: Event) => boolean
  removeEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) => void
}

export const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json'
}

const isIE11 = isBrowserIE11()

const IEHeader = {
  'X-Request-IE-Cache-Override': 'true'
}

export const noCacheHeaders = {
  'Cache-Control': 'no-cache', // dumb IE caching XHR
  Pragma: 'no-cache'
}

export const cacheHeader = {
  'Cache-Control': 'cash-money' // get results from server cache
}

const GET_HEADERS: HeadersInit =
  config.disableServerCache || isIE11
    ? {
        ...DEFAULT_HEADERS,
        ...noCacheHeaders, // dumb IE caching XHR
        ...(isIE11 ? IEHeader : undefined) // Always Set Custom header to Cache IE Server Side if possible
      }
    : {
        ...DEFAULT_HEADERS,
        ...cacheHeader
      }

const PUT_HEADERS: HeadersInit = {
  ...DEFAULT_HEADERS
}

const POST_HEADERS: HeadersInit = {
  ...DEFAULT_HEADERS
}

const DELETE_HEADERS: HeadersInit = {
  ...DEFAULT_HEADERS
}

// remove header properties by setting 'clear' on any http header property
// { 'default-property1': 'clear', property2: 'keep me' } -> { property2: 'keep me' }
const clearHeaders = (headers?: HeadersInit) =>
  headers
    ? Object.entries(headers).reduce((acc, curr) => {
        const [k, v] = curr
        if (v !== 'clear') {
          return {
            ...acc,
            [k]: v
          }
        }

        return acc
      }, {} as HeadersInit)
    : {}

const apiFactoryWithCache = (url: string, prependCacheKeyMaker?: (hash: string) => string, includeJwtHeader = true) => {
  const api = apiFactory(url, includeJwtHeader)

  const getWithCache = <T>(query?: Record<string, string>, additionalHeaders: HeadersInit = {}) => {
    const [cachedVal, setter] = getValueIfExists<T>(
      prependCacheKeyMaker ? prependCacheKeyMaker(hashRecord(query || {}, url)) : hashRecord(query || {}, url)
    )

    if (cachedVal) {
      return Promise.resolve(cachedVal)
    }

    return api.get<T>(query, additionalHeaders).then((data: any) => {
      if (setter) {
        setter(data as T)
      }

      return data
    })
  }

  return config.disableAppCache
    ? api
    : {
        ...api,
        get: getWithCache
      }
}

const withId = (url: string, id?: number) => (id ? `${url}?id=${id}` : url)
const withCompanyId = (url: string, id?: number) => (id ? `${url}?companyId=${id}` : url)
const withQuery = (url: string, query?: Record<string, string>) =>
  query ? `${url}?${new URLSearchParams(clearEmptyValues(query)).toString()}` : url

export const withJwtHeader = (token?: string) => ({
  Authorization: `bearer ${token ? token : getToken()}`
})

const DEFAULT_REQUEST: RequestInit = {
  credentials: 'include'
}

const fetcher = (url: string, request: RequestInit) =>
  fetch(url, {
    ...DEFAULT_REQUEST,
    ...request
  }).then(handleErrors)

const handleErrors = async (res: Response) => {
  if (!res.ok) {
    throw await res.json()
  }
  return res
}

const apiFactory = (url: string, includeJwtHeader = true) => {
  const get = <T>(query?: Record<string, string>, additionalHeaders: HeadersInit = {}, abortSignal?: AbortSignal) =>
    fetcher(withQuery(url, query), {
      headers: clearHeaders({
        ...(includeJwtHeader ? withJwtHeader() : {}),
        ...GET_HEADERS,
        ...additionalHeaders
      }),
      method: 'GET',
      signal: abortSignal
    }).then((res) => res.json() as Promise<T>)

  const getById = <T>(id: number, query: Record<string, string> | undefined, additionalHeaders: HeadersInit = {}) =>
    fetcher(withQuery(withId(url, id), query), {
      headers: clearHeaders({
        ...(includeJwtHeader ? withJwtHeader() : {}),
        ...GET_HEADERS,
        ...additionalHeaders
      }),
      method: 'GET'
    }).then((res) => res.json() as Promise<T>)

  const put = <T>(
    id: number | undefined,
    query: Record<string, string> | undefined,
    body: T,
    additionalHeaders: HeadersInit = {}
  ) =>
    fetcher(withQuery(withId(url, id), query), {
      headers: clearHeaders({
        ...(includeJwtHeader ? withJwtHeader() : {}),
        ...PUT_HEADERS,
        ...additionalHeaders
      }),
      body: JSON.stringify(body),
      method: 'PUT'
    })
  const companyPut = <T>(
    companyId: number | undefined,
    query: Record<string, string> | undefined,
    body: T,
    additionalHeaders: HeadersInit = {}
  ) =>
    fetcher(withQuery(withCompanyId(url, companyId), query), {
      headers: clearHeaders({
        ...(includeJwtHeader ? withJwtHeader() : {}),
        ...PUT_HEADERS,
        ...additionalHeaders
      }),
      body: JSON.stringify(body),
      method: 'PUT'
    })

  const post = <T>(
    query: Record<string, string> | undefined,
    body: T,
    additionalHeaders: HeadersInit = {},
    abortSignal?: AbortSignal
  ) =>
    fetcher(withQuery(url, query), {
      headers: clearHeaders({
        ...(includeJwtHeader ? withJwtHeader() : {}),
        ...POST_HEADERS,
        ...additionalHeaders
      }),
      signal: abortSignal,
      body: JSON.stringify(body),
      method: 'POST',
      credentials: 'same-origin'
    })

  const postI = <T>(
    query: Record<string, string> | undefined,
    body: T,
    additionalHeaders: HeadersInit = {},
    abortSignal?: AbortSignal
  ) =>
    fetcher(withQuery(url, query), {
      headers: clearHeaders({
        ...POST_HEADERS,
        ...additionalHeaders
      }),
      signal: abortSignal,
      body: JSON.stringify(body),
      method: 'POST',
      credentials: 'include'
    })

  const deleteM = (
    id: number | undefined,
    query: Record<string, string> | undefined,
    additionalHeaders: HeadersInit = {}
  ) =>
    fetcher(withQuery(withId(url, id), query), {
      headers: clearHeaders({
        ...(includeJwtHeader ? withJwtHeader() : {}),
        ...DELETE_HEADERS,
        ...additionalHeaders
      }),
      method: 'DELETE'
    })

  const deleteBody = <T>(query: Record<string, string> | undefined, body: T, additionalHeaders: HeadersInit = {}) =>
    fetcher(withQuery(url, query), {
      headers: clearHeaders({
        ...(includeJwtHeader ? withJwtHeader() : {}),
        ...DELETE_HEADERS,
        ...additionalHeaders
      }),
      body: JSON.stringify(body),
      method: 'DELETE'
    })

  const getString = (query?: Record<string, string>, additionalHeaders: HeadersInit = {}) =>
    fetcher(withQuery(url, query), {
      headers: clearHeaders({
        ...(includeJwtHeader ? withJwtHeader() : {}),
        ...GET_HEADERS,
        ...additionalHeaders
      }),
      method: 'GET'
    }).then((res) => res.text() as Promise<string>)

  return {
    get,
    getById,
    companyPut,
    put,
    post,
    postI,
    delete: deleteM,
    deleteBody,
    getString
  }
}

export {apiFactory, apiFactoryWithCache}
