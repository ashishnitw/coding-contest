const Pool = require('pg').Pool;
const process = require('process');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'userapi',
    password: process.env.DB_PASS || 'postgres',
    port: 5432
});

module.exports = pool;