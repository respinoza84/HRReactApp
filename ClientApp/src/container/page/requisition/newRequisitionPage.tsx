import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {updatePageHeader} from 'store/action/contextActions'
import {withRouter, RouteComponentProps} from 'react-router'

export type NewRequistionPageProps = {}

export const NewRequistionPage = withRouter(({history}: RouteComponentProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updatePageHeader('New Requisition'))
  }, []) // eslint-disable-line

  return (
    <div>
      <h2>NEW REQUISITION</h2>
    </div>
  )
})

