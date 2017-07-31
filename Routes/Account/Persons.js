var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Persons';


router.get('/', function(req, res) {

   var email = req.session && req.session.isAdmin() && req.query.email ||
    req.session && !req.session.isAdmin() &&
    (req.session.email.includes(req.query.email) || !req.query.email)
    && req.session.email;

   var handler = function(err, prsArr) {
      res.json(prsArr);
      req.cnn.release();
   };

   if (email) {

      if (!req.session.isAdmin()) {
         req.cnn.chkQry('select id, email from Person where email = ?', [email],
          handler);
      }

      else {
         req.cnn.chkQry('select id, email from Person where email like ?',
          [email.concat("%")], handler);
      }

   }
   else  {

      if (req.session && req.session.isAdmin())
         req.cnn.chkQry('select id, email from Person', handler);

      else
         handler(null, []);
   }
});

router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;

   if (admin && !body.password) {
      body.password = "*"; // Blocking password
   }

   body.whenRegistered = new Date();

   async.waterfall([

   function(cb) { // Check properties and search for Email duplicates
      if (vld.hasFields(body, ["email", "lastName", "password", "role"], cb) &&
       vld.chain(body.role === 0 || admin, Tags.noPermission)
       .chain(body.termsAccepted || admin, Tags.noTerms)
       .chain(body.lastName, Tags.missingField, ["lastName"])
       .chain(body.email, Tags.missingField, ["email"])
       .chain(body.password || admin, Tags.missingField, ["password"])
       .check(body.role >= 0, Tags.badValue, ["role"], cb)) {

         cnn.chkQry('select * from Person where email = ?', body.email, cb);
      }
   },

   function(existingPrss, fields, cb) {  // If no duplicates, insert new Person
      if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
         body.termsAccepted =  (body.termsAccepted || null) && new Date();
         cnn.chkQry('insert into Person set ?', body, cb);
      }
   },

   function(result, fields, cb) { // Return location of inserted Person
      res.location(router.baseURL + '/' + result.insertId).end();
      cb();
   }],

   function(err) {
      cnn.release();
   });
});

router.get('/:id', function(req, res) {
   var vld = req.validator;

   req.pool.connect(function(err, client, release){
      if (vld.checkPrsOK(req.params.id)) {
         client.query('select id, email from Person where id = $1', [req.params.id],
         function(err, prsArr) {
            if (err){
               res.status(500).end()
            }
            else {
               if (vld.check(prsArr.rows.length, Tags.notFound))
                  res.json(prsArr.rows);
            }
            release();
         });
      }
      else {
         release();
      }
   });
});

router.put('/:id', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {

      if (vld.checkPrsOK(req.params.id, cb) &&

       vld.chain(!body.role || admin, Tags.badValue, ['role'])
       .chain(!(body.role < 0), Tags.badValue, ["role"])
       .chain(!body.hasOwnProperty('termsAccepted'), Tags.forbiddenField,
        ['termsAccepted'])

       .chain(!body.hasOwnProperty('email'), Tags.forbiddenField, ['email'])
       .chain(!body.hasOwnProperty('whenRegistered'), Tags.forbiddenField,
        ['whenRegistered'])

       .check(!body.hasOwnProperty('password') ||
        body.oldPassword || admin, Tags.noOldPwd, null, cb)

       && vld.check(Object.keys(body).length,
        Tags.serverError, ['serverError'], cb)) {

         cnn.chkQry("select * from Person where id = ? ", [req.params.id], cb);
      }
   },

   function(qRes, fields, cb) {
      if (vld.check(admin || !body.hasOwnProperty('password') ||
       qRes[0].password === body.oldPassword, Tags.oldPwdMismatch, null, cb)) {

       // && vld.check(!body.hasOwnProperty('password') || body.password !== '',
        //Tags.badValue, ['password'], cb)) {

         delete req.body.oldPassword;
         cnn.chkQry("update Person set ? where id = ?",
          [req.body, req.params.id], cb);
       }
   }
   ],

   function(err) {
      res.status(200).end();
      cnn.release();
   });
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      if (vld.checkAdmin(cb)) {
         cnn.chkQry('DELETE from Person where id = ?', [req.params.id], cb);
      }
   },

   function(qRes, fields, cb) {
      if (vld.check(qRes.affectedRows, Tags.notFound, null, cb)) {
         cnn.chkQry('DELETE from Conversation where ownerId = ?',
          [req.params.id], cb);
      }
   },

   function(qRes, fields, cb) {
      cnn.chkQry('DELETE from Conversation where ownerId = ?', [req.params.id],
       cb);
   },

   ],
   function(err) {
      if (!err){
         res.status(200).end();
      }
      else {
         res.status(500).end();
      }
      cnn.release();
   }
   );
});

module.exports = router;
