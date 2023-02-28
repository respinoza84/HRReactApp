/* eslint-disable */
import * as Types from '../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetCompanyVerticalQueryVariables = Types.Exact<{[key: string]: never}>

export type GetCompanyVerticalQuery = {
  __typename?: 'Query'
  companyVertical?: {
    __typename?: 'CompanyVerticalCollectionSegment'
    items?: Array<{__typename?: 'CompanyVertical'; id?: number | null; vertical?: string | null}> | null
  } | null
}

export const GetCompanyVerticalDocument = `
    query GetCompanyVertical {
  companyVertical {
    items {
      id
      vertical
    }
  }
}
    `
export const useGetCompanyVerticalQuery = <TData = GetCompanyVerticalQuery, TError = unknown>(
  variables?: GetCompanyVerticalQueryVariables,
  options?: UseQueryOptions<GetCompanyVerticalQuery, TError, TData>
) =>
  useQuery<GetCompanyVerticalQuery, TError, TData>(
    variables === undefined ? ['GetCompanyVertical'] : ['GetCompanyVertical', variables],
    fetchData<GetCompanyVerticalQuery, GetCompanyVerticalQueryVariables>(GetCompanyVerticalDocument, variables),
    options
  )
