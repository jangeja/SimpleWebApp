var Express = require('express');
var clientPool = require('../CnnPool.js');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Sessions';

router.get('/', function(req, res) {
   var body = [], ssn;

   if (req.validator.checkAdmin()) {

      for (var cookie in ssnUtil.sessions) {
         ssn = ssnUtil.sessions[cookie];
         body.push({cookie: cookie, prsId: ssn.id, loginTime: ssn.loginTime});
      }

      res.status(200).json(body);
   }
});

router.post('/', function(req, res) {
   var cookie;
   var vld = req.validator;
   req.pool.connect(function (err, client, release) {
      async.waterfall(
         [
            function(cb) {
               client.query('select * from Person where email = $1', [req.body.email], cb);
            },
            function(results, cb){
               // This means a person exists in the database
               if (results.rows.length) {
                  cb(null, results);
               }
               else {
                  client.query('insert into Person(email, password) VALUES($1, $2) RETURNING *', [req.body.email, req.body.password], cb);
               }
            },
            function(results, cb) {
               // This means a person exists in the database
               cookie = ssnUtil.makeSession(results.rows[0], res);
               cb(null, results);
            }
         ],
         function(err, results) {
            if (!err){
               res.location(router.baseURL + '/' + cookie).status(200).end();
            }
            else {
               console.log(err);
               res.status(500).end();
            }
            release();
         }
      );
   });
});

router.delete('/:cookie', function(req, res, next) {
   if (req.validator.check(req.params.cookie === req.cookies[ssnUtil.cookieName]
    || req.session, Tags.noPermission)) {
      ssnUtil.deleteSession(req.params.cookie);
      res.status(200).end();
   }
});

router.get('/:cookie', function(req, res, next) {
   var cookie = req.params.cookie;
   var vld = req.validator;
   var person;
   req.pool.connect(function(err, client, release) {
      if (err) {
         finish();
      }
      if (vld.check(ssnUtil.sessions[cookie], Tags.notFound) &&
       vld.checkPrsOK(ssnUtil.sessions[cookie].id)) {
         person = ssnUtil.sessions[cookie]
         res.json({prsId: person.id, loginTime: person.loginTime, cookie: cookie});
      }
      release();
   });

});

module.exports = router;
