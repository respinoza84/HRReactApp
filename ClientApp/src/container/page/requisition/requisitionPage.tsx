import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {updatePageHeader} from 'store/action/contextActions'
import {withRouter, RouteComponentProps} from 'react-router'

export type RequistionPageProps = {}

export const RequistionPage = withRouter(({history}: RouteComponentProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updatePageHeader('Requisitions'))
  }, []) // eslint-disable-line

  return (
    <div>
      <h2>REQUISITIONS</h2>
    </div>
  )
})
