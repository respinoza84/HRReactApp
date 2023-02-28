/*
  @author Oliver Zamora
  @description GET config data
*/
const configJSON = require('../data/config')

module.exports = (req: any, res: any) => {
  return res.send(configJSON)
}
