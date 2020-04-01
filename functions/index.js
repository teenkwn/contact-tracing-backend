const functions = require('firebase-functions')
const cors = require('cors')
const app = require('express')()
const bodyParser = require('body-parser')
const routes = require('./routes')

app.use(bodyParser.json())
app.use(cors({ origin: true }))

app.get('/', async (req, res) => {
  res.send('ok')
})

routes.forEach(route => {
  app[route.method](route.path, authMiddleware, methodOverride(route.controller))
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err.message)
})

function methodOverride (fn) {  
  return (req, res, next) => {
    const routePromise = fn(req, res, next)
    if (routePromise.catch) {
      routePromise.catch(err => next(err))
    }
  }
}
function authMiddleware(req, res, next) {
  next()
}

exports.covid19 = functions.region('asia-northeast1').https.onRequest(app)
