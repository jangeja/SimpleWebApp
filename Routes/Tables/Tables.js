var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Tables';

router.get('/:table', function(req, res) {
   var table = req.params.table;
   req.pool.connect(function(err, client, release){
      client.query("SELECT * from " + table + " order by id asc",
         function(err, results) {
            if (!err) {
               res.json(results.rows);
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

router.get('/:table/Rows/:rowId', function(req, res) {

   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var rowId = req.params.rowId;
   var table = req.params.table;

   req.pool.connect(function(err, client, release){
      async.waterfall([

         function (cb) {
            client.query('select * from ' + table + ' where id = $1', [rowId], cb);
         }],
         function (err, results) {
            if (!err) {
               row = results.rows.length && results.rows[0];
               if (vld.check(row, Tags.notFound, null)) {
                  res.status(200).json(row);
               }
            }
            else {
               res.status(500).end();
               console.log(err);
            }
            release();
         }
      );
   });

});

router.post('/:table', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var table = req.params.table;
   req.pool.connect(function(err, client, release){
      async.waterfall([

         function(cb) {
            if (vld.hasFields(body,["column1", "column2", "column3",
               "column4", "column5", "column6"], cb)) {
            client.query('insert into ' + table + '(column1, column2, column3, column4, ' +
               'column5, column6) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
               [ body.column1, body.column2, body.column3, body.column4, body.column5,
               body.column6 ], cb);
            }
         }],
         function(err, results) {
            if (!err) {
               res.json(results.rows);
            }
            else {
               console.log(err);
               res.status(500).end();
            }
            release();
         });
   });

});

router.put('/:table/Rows/:rowId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var table = req.params.table;
   var rowId = req.params.rowId;

   req.pool.connect(function(err, client, release){
      async.waterfall([
         function(cb) {
            client.query('select * from ' + table + ' where id = $1', [rowId], cb);
            console.log(table);
         },

         function(results, cb) {
            var keys = [];
            var values = [];
            var queryString = 'update ' + table + ' SET (';
            if (vld.check(results.rows.length, Tags.notFound, null, cb)) {
               Object.keys(req.body).forEach(function(key, i){
                  keys.push(key);
                  if (typeof req.body[key] === 'string' || req.body[key] instanceof String) {
                     values.push('\'' + req.body[key] + '\'');
                  }
                  else {
                     values.push(req.body[key]);
                  }
               });
               client.query('update ' + table + ' SET (' + keys.join(',') + ') = (' + values.join(',') + ') WHERE id = ' + rowId, cb);
            }
         }],

         function(err, results) {
            if (!err)
               res.status(200).end();
            else {
               res.status(500).end();
               console.log(err);
            }
            release();
         });
   });
});

router.delete('/:table/Rows/:rowId', function(req, res) {
   var vld = req.validator;
   var table = req.params.table;
   var rowId = req.params.rowId;

   req.pool.connect(function(err, client, release) {
      async.waterfall([

         function(cb) {
            client.query('select * from ' + table + ' where id = $1', [rowId], cb);
         },

         function(results, cb) {
            if (vld.check(results.rows.length, Tags.notFound, null, cb)) {
               client.query('delete from ' + table + ' where id = $1', [rowId], cb);
            }
         }],

         function(err) {
            if (!err)
               res.status(200).end();
            else {
               res.status(500).end();
            }
            release();
         });
   });

});

module.exports = router;
