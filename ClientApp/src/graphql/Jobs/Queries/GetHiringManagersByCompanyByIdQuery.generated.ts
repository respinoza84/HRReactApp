/* eslint-disable */
import * as Types from '../../types.generated'
import {useQuery, UseQueryOptions} from 'react-query'
import {fetchData} from 'utility/reactQuery'

export type GetHiringManagersByCompanyByIdQueryVariables = Types.Exact<{
  companyId: Types.Scalars['Int']
}>

export type GetHiringManagersByCompanyByIdQuery = {
  __typename?: 'JobQuery'
  hiringManagersByCompanyById: Array<{__typename?: 'HiringManager'; id: number; hiringManagerName: string}>
}

export const GetHiringManagersByCompanyByIdDocument = `
      query GetHiringManagersByCompanyById($companyId: Int!) {
    hiringManagersByCompanyById(companyId: $companyId) {
      id
      hiringManagerName
    }
  }`
  
export const useGetHiringManagersByCompanyByIdQuery = <TData = GetHiringManagersByCompanyByIdQuery, TError = unknown>(
  variables: GetHiringManagersByCompanyByIdQueryVariables,
  options?: UseQueryOptions<GetHiringManagersByCompanyByIdQuery, TError, TData>
) =>
  useQuery<GetHiringManagersByCompanyByIdQuery, TError, TData>(
    ['GetHiringManagersByCompanyById', variables],
    fetchData<GetHiringManagersByCompanyByIdQuery, GetHiringManagersByCompanyByIdQueryVariables>(
      GetHiringManagersByCompanyByIdDocument,
      variables
    ),
    options
  )
