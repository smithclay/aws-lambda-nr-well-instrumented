// Use this for running locally outside of AWS Lambda:
// $ node index.local.js

const app = require('./index').app
const port = 3000

console.log('listening on port 3000');
app.listen(port)