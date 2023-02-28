import {useMemo} from 'react'
import * as PropTypes from 'prop-types'
import {MuiPickersContext} from '@material-ui/pickers'

export const MuiPickersTzUtilsProvider = (props) => {
  const {children, utils, dateFormats, dateLibInstance, locale, timeZone} = props
  const utilsContext = useMemo(() => new utils({locale, timeZone, formats: dateFormats, instance: dateLibInstance}), [
    utils,
    locale,
    timeZone,
    dateFormats,
    dateLibInstance
  ])
  return <MuiPickersContext.Provider value={utilsContext} children={children} />
}

MuiPickersTzUtilsProvider.propTypes = {
  utils: PropTypes.oneOfType([PropTypes.object, PropTypes.string]), //PropTypes.func.isRequired,
  locale: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  timeZone: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element.isRequired, PropTypes.arrayOf(PropTypes.element.isRequired)])
    .isRequired
}

export default MuiPickersTzUtilsProvider
