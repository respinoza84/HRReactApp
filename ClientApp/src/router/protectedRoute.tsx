import {RouteProps, Route, Redirect} from 'react-router'
import {isAllowed} from 'utility'
import {routes} from './router'
import {Feature} from 'lib/type/security'
import {ModalRoleEnums} from 'type/user/roles'

export type ProtectedRouteProps = RouteProps & {
  component?: any // ! super annoying but not sure why the types are not
  // ! working. had to make this workaround. i'll buy a
  // ! coffee for someone that can properly get the types to
  // ! work right here and explain it to me.
  requiredFeature?: Feature
  requiredRoles?: ModalRoleEnums[]
  userRoles: ModalRoleEnums[]
}

export const ProtectedRoute = ({
  component: Component,
  requiredFeature,
  requiredRoles,
  userRoles,
  ...rest
}: ProtectedRouteProps) => (
  <Route
    {...rest}
    render={(props) => {
      if (isAllowed(requiredRoles, userRoles)) {
        return <Component {...props} />
      } else {
        return (
          <Redirect
            to={{
              pathname: routes.Access_Denied,
              state: props.location
            }}
          />
        )
      }
    }}
  />
)
