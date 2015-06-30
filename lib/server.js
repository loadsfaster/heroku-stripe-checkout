var _ = require('lodash')
var config = require('./config')
var Nudge = require('hapi-nudge')
var Hapi = require('hapi')
var Joi = require('joi')
var stripe = require('stripe')(config.stripeSecretKey)
var util = require('util')

var PATHNAME = '/'

var server = new Hapi.Server()

module.exports = server

server.app.PATHNAME = PATHNAME

server.connection({
    port: config.port,
})

if (config.appName) {
    server.register({
        register: Nudge,
        options: {
            host: [
                config.appName,
                '.herokuapp.com',
            ].join(''),
            pathname: '/uptime',
            protocol: 'https',
        },
    }, function (err) { if (err) throw err })
}

server.route({
    config: {
        cors: {
            origin: config.corsOrigins,
        },
        validate: {
            payload: {
                amount: Joi.number().integer().greater(50).required(),
                description: Joi.string(),
                metadata: Joi.object(),
                stripeToken: Joi.string().token().required(),
                stripeTokenType: Joi.string().regex(/^card$/),
                stripeEmail: Joi.string().email().required(),
            },
        },
    },
    handler: function (request, reply) {
        var options = {
            amount: request.payload.amount,
            currency: config.currency,
            card: request.payload.stripeToken,
            receipt_email: request.payload.stripeEmail,
            metadata: _.extend({
                buyerEmail: request.payload.stripeEmail
            }, request.payload.metadata),
        }
        if (request.payload.description) {
            options.description = request.payload.description;
        }
        stripe.charges.create(options, function (stripeError) {
          var ret = reply()
          if (stripeError) {
            ret.statusCode = 500
          } else {
            ret.statusCode = 200
          }
          return ret
        })
    },
    method: 'POST',
    path: PATHNAME,
})
