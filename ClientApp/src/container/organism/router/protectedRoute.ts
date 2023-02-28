import {connect} from 'react-redux'
import {IApplicationState} from 'store/reducer'
import {RouteProps} from 'react-router'
import {ProtectedRoute as targetComponent, ProtectedRouteProps} from 'router/protectedRoute'

type OwnProps = RouteProps & Pick<ProtectedRouteProps, 'requiredRoles'>
const mapToProps = (state: IApplicationState, ownProps: OwnProps): ProtectedRouteProps => ({
  userRoles: state.context.user.roles
})

const ProtectedRoute = connect(mapToProps)(targetComponent)

export {ProtectedRoute}
