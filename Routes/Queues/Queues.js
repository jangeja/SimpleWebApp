var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var amqp = require('amqplib/callback_api');


router.baseURL = '/Tables';

router.get('/', function(req, res) {
   var table = req.params.table;
   req.pool.connect(function(err, client, release){
      client.query("SELECT * from Queues order by queueName asc",
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

router.get('/:queue', function(req, res) {

   var vld = req.validator;
   var body = req.body;
   var mqConn;

   req.pool.connect(function(err, client, release){
      async.waterfall([
         function (cb) {
            client.query('select * from Queues where queueName = $1', [req.params.queue], cb);
         },
         function (results, cb) {
            row = results.rows.length && results.rows[0];
            if (vld.check(row, Tags.notFound, cb)) {
               amqp.connect('amqp://localhost', function(err, conn) {
                  mqConn = conn;
                  conn.createChannel(function(err, ch) {
                     var q = req.params.queue;
                     ch.assertQueue(q, {durable: false});
                     ch.consume(q, function(msg) {
                        cb(null, msg.content.toString())
                     }, {noAck: true});
                 });
               });
            }
         }],
         function (err, results) {
            if (!err) {
               res.json(message);
            }
            else {
               res.status(500).end();
               console.log(err);
            }
            mqConn.close();
            release();
         }
      );
   });

});

router.post('/:queue', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var mqConn;
   req.pool.connect(function(err, client, release){
      async.waterfall([
         function (cb) {

         },

         function(cb) {
            amqp.connect('amqp://localhost', function(err, conn) {
               mqConn = conn;
               conn.createChannel(function(err, ch) {
                  var q = req.params.queue;

                  ch.assertQueue(q, {durable: false});

                // Note: on Node 6 Buffer.from(msg) should be used
                  ch.sendToQueue(q, new Buffer(req.body.message));
              });
            });
         }],
         function(err, results) {
            if (!err) {
               res.status(200);
            }
            else {
               console.log(err);
               res.status(500).end();
            }
            mqConn.close();
            release();
         });
   });

});

router.delete('/:queue', function(req, res) {
   var vld = req.validator;

   req.pool.connect(function(err, client, release) {
      async.waterfall([
         function(cb) {
            client.query('select * from Queues where queueName = $1', [req.params.queue], cb);
         },

         function(results, cb) {
            if (vld.check(results.rows.length, Tags.notFound, null, cb)) {
               client.query('delete from Queues where queueName = $1', [req.params.queue], cb);
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
