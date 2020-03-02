'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"testing"',
  API_ROOT:'"http://localhost:10082/"',
  WS_HOST_ROOT:'"localhost:7082"'
})
