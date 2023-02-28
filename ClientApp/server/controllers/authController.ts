/*
  @author Oliver Zamora
  @description return common controller
*/
const getLogin = require('../routes/getLogin')

//JSON imports for generic GET
const usersJSON = require('../data/users')

module.exports = (app: any) => {
  const authUrl = '/api/'

  app.get(authUrl + 'Login', (req: any, res: any) => getLogin(req, res, usersJSON, 1))
}
