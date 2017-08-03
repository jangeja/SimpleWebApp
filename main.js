var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var Session = require('./Routes/Session.js');
var Validator = require('./Routes/Validator.js');
var CnnPool = require('./Routes/CnnPool.js');
var Random = require('random-js');
var r = new Random(Random.engines.mt19937().seedWithArray([0x12345678, 0x90abcdef]));
var table1Rows = 47;
var table2Rows = 26;

var getPort = function(argv) {
   //Default port is 3000
   var port = 3000;

   for (var i = 0; i < argv.length; i++) {
      if (argv[i] === '-p' && i !== argv.length - 1)
         port = argv[i + 1];
   }

   return port;
}

var async = require('async');

var app = express();
//app.use(function(req, res, next) {console.log("Hello"); next();});
// Static paths to be served like index.html and all client side js

app.use(express.static(path.join(__dirname, 'public')));

// Parse all request bodies using JSON
app.use(bodyParser.json());

// Attach cookies to req as req.cookies.<cookieName>
app.use(cookieParser());

// Set up Session on req if available
app.use(Session.router);

// Check general login.  If OK, add Validator to |req| and continue processing,
// otherwise respond immediately with 401 and noLogin error tag.
app.use(function(req, res, next) {
   if (req.session || (req.method === 'POST' && (req.path === '/Sessions') )|| (req.path === '/DB')) {
      req.validator = new Validator(req, res);
      next();
   }
   else {
      res.status(401).end();
   }
});

// Add DB connection, with smart chkQry method, to |req|
app.use(CnnPool.router);

// Load all subroutes
app.use('/Sessions', require('./Routes/Account/Sessions.js'));
app.use('/Persons', require('./Routes/Account/Persons.js'));
app.use('/Tables', require('./Routes/Tables/Tables.js'));

// Special debugging route for /DB DELETE.  Clears all table contents,
//resets all auto_increment keys to start at 1, and reinserts one admin user.
app.delete('/DB', function(req, res) {

   req.pool.connect(function (err, client, release){
      // Callbacks to clear tables
      var cbs = ["Table1", "Table2", "Person"].map(function(tblName) {
         return function(cb) {
            client.query("delete from " + tblName, cb);
         };
      });

      // Callback to clear sessions, release connection and return result
      cbs.push(function(callback){
         for (var session in Session.sessions)
            delete Session.sessions[session];
         callback();
      });

      cbs.push(function(cb) {
         client.query('GRANT ALL ON Table SimpleWebApp.*  TO test_user',cb);
      });

      for (var i = 0; i < table1Rows; i ++) {
         var flop = true;
         cbs.push(function(cb) {
            var column1 = r.integer(-100000, 100000),
                column2 = r.integer(-100000, 100000) + Math.random(),
                column3 = true ? Math.random() > 0.5 : false,
                column4 = r.date(new Date(0), new Date()),
                column5 = r.date(new Date(0), new Date()),
                column6 = r.string(20, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
             client.query('insert into Table1(column1, column2, column3, column4, ' +
               'column5, column6) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
               [column1, column2, column3, column4, column5, column6 ], cb);
               console.log([column1, column2, column3, column4, column5, column6 ]);

         });
      }

      for (var i = 0; i < table2Rows; i ++) {
         var flop = true;
         cbs.push(function(cb) {
            var column1 = r.integer(-100000, 100000),
                column2 = r.integer(-100000, 100000) + Math.random(),
                column3 = true ? Math.random() > 0.5 : false,
                column4 = r.date(new Date(0), new Date()),
                column5 = r.date(new Date(0), new Date()),
                column6 = r.string(20, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
             client.query('insert into Table2(column1, column2, column3, column4, ' +
               'column5, column6) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
               [column1, column2, column3, column4, column5, column6 ], cb);
         });
      }

      cbs.push(function(cb) {
         client.query('INSERT INTO Person (email, password) VALUES ' +
             '($1, $2) RETURNING *', ["admin@simpleapp.com", "password"],cb);
      });

      async.series(cbs, function(err) {
         release();
         if (err) {
            console.log(err);
            res.status(400).json(err);
         }
         else
            res.status(200).end();
      });
   });
});

// Handler of last resort.  Print a stacktrace to console and send a 500 response.
app.use(function(req, res, next) {
   res.status(404).end();
});

app.listen(getPort(process.argv), function () {
   console.log('App Listening on port ' + getPort(process.argv));
});
