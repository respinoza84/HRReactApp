import {format} from 'date-fns-tz'
import DateFnsUtils from '@date-io/date-fns'

export default class DateFnsTzUtils extends DateFnsUtils {
  constructor(props) {
    super()
    this.timeZone = props.timeZone
  }
  format(date, formatString) {
    return format(date, formatString, {
      //timeZone: this.timeZone,
      locale: this.locale
    })
  }
}
