/*
  @author Oliver Zamora
  @description connected nav component
*/
import {connect, MapDispatchToPropsParam} from 'react-redux'
import {Dispatch} from 'redux'

import {IApplicationState} from 'store/reducer'
import {Nav, NavProps} from 'lib/molecule/nav'
import {resetToasts} from 'store/action/globalActions'

const mapStateToProps = (state: IApplicationState): Partial<NavProps> => {
  return {
    userName: state.context.user.userName,
    mainHeaderTitle: state.context.pageHeader.pageModule,
    roles: state.context.user.roles
  }
}

const mapDispatchToProps: MapDispatchToPropsParam<NavProps, {}> = (dispatch: Dispatch) => ({
  resetToasts: () => dispatch(resetToasts())
})

const ConnectedNav = connect(mapStateToProps, mapDispatchToProps)(Nav)

export {ConnectedNav}
