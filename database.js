require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync(__dirname + process.env.CRT),
  },
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

module.exports.writeBounces = async function (table, columns, values) {
  // writes an array of errors to the database
  const sql = `INSERT INTO ${table} (${columns}) VALUES ?`;
  const response = await promisePool.query(
    sql,
    [values],
    function (err, results, fields) {
      if (err) {
        context.log('There was an error writing bounces to the database:', err);
        return err;
      }
      return results;
    }
  );
  return response;
};