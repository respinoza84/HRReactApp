/*
  @author Oliver Zamora
  @description GET common
*/

const {utils} = require('../utility/data')

module.exports = (req: any, res: any, json: any = {}, throttleTime) => {
  setTimeout(
    () => {
      if (utils.showErrors) {
        return res.status(utils.errorStatus).send()
      } else if (utils.returnEmpty) {
        return res.send({})
      } else {
        return res.send(json)
      }
    },
    throttleTime ? throttleTime : utils.getThrottleRange()
  )
}
