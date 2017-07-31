var pg = require('pg');

var config = {
  user: 'test_user',
  host: 'localhost',
  database: 'SimpleWebApp',
  port: 26257,
};

// Constructor for DB connection pool
var CnnPool = function() {
   this.pool = new pg.Pool(config);
};

CnnPool.PoolSize = 1;

// Conventional getConnection, drawing from the pool
CnnPool.prototype.getConnection = function(cb) {
   this.pool.getConnection(cb);

};

// Router function for use in auto-creating CnnPool for a request
CnnPool.router = function(req, res, next) {
   req.pool = CnnPool.singleton.pool;
   next();
};

// The one (and probably only) CnnPool object needed for the app
CnnPool.singleton = new CnnPool();

module.exports = CnnPool;
