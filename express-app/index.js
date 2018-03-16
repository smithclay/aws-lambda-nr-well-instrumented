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

// Adds a custom attribute to a New Relic Browser PageView event.
// https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api/set-custom-attribute
const addInstrumentationJs = (releaseName, version) => {
    return `if (typeof newrelic == 'object') { newrelic.setCustomAttribute('${releaseName}', '${version}');\nnewrelic.addRelease('${releaseName}', '${version}');\nthrow new Error('synthetic error'); }`;
}

app.get('/', (req, res) => {
  console.log(process.env);
  res.render('index', {
    addInstrumentationJs: addInstrumentationJs,
    AWS_LAMBDA_FUNCTION_VERSION: process.env.AWS_LAMBDA_FUNCTION_VERSION,
    apiUrl: req.apiGateway ? `https://${req.apiGateway.event.headers.Host}/${req.apiGateway.event.requestContext.stage}` : 'http://localhost:3000'
  })
})

const server = awsServerlessExpress.createServer(app)
  
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
}
