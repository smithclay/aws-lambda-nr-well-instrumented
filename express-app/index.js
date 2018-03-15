const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const awsServerlessExpress = require('aws-serverless-express')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()

app.set('view engine', 'pug')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

app.get('/', (req, res) => {
  res.render('index', {
    apiUrl: req.apiGateway ? `https://${req.apiGateway.event.headers.Host}/${req.apiGateway.event.requestContext.stage}` : 'http://localhost:3000'
  })
})

const server = awsServerlessExpress.createServer(app)
  
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
}
