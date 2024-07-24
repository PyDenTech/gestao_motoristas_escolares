const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgres://xpzwfwjo:q1JVxUapiyhjUa0ax4E8PW8izeYm7wP-@silly.db.elephantsql.com/xpzwfwjo'
});

module.exports = pool;
