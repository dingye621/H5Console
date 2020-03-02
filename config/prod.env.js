'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  API_ROOT:'"http://10.105.16.61:8080"',
  WS_HOST_ROOT:'"10.105.16.61:8080"'
})