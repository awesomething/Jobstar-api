const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const jobsRouter = require('./jobs/jobs-router')
const servicesRouter = require('./jobs/services-router')

const app = express()

const {CLIENT_ORIGIN} = require('./config');

app.use(
    cors({
        origin: "https://localhost:3000"
    })
);

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.use('/', servicesRouter);
app.use('/jobs', jobsRouter);


app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' }
  } else {
    console.error(error)
    response = { error: error.message, object: error }
  }
  res.status(500).json(response)
})

module.exports = app
