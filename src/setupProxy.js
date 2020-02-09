const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/__', { target: 'http://localhost:4000/' }))
}
