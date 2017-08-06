var Express = require('express');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var router = Express.Router({caseSensitive: true});
var async = require('async');
var request = require('request');

router.post('/', function(req, res) {
   var restInfo = {
      url: req.body.url,
      headers: req.body.headers,
      auth: req.body.auth,
      method: req.body.method,
      body: req.body.body
   }
   request(restInfo,
   function (error, response, body) {
      console.log(response);
      res.json(response);
   });
});

module.exports = router;
