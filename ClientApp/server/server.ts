/*
  @author Oliver Zamora
  @description Node/Express server
*/
// @ts-ignore
const express = require('express')
const bodyParser = require('body-parser')
const authController = require('./controllers/authController')

const port = process.env.PORT || 5000
const app = express()

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))

const controllerInitArray = [authController]

controllerInitArray.map((initController) => initController(app))

app.listen(port, () => console.info(`Listening on port ${port}`))
