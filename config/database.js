require('dotenv').config();

const mysql = require('mysql2');
const conn = mysql.createConnection({
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  timezone : process.env.DATABASE_TIMEZONE,
  dateStrings : process.env.DATABASE_DATESTRINGS
});

conn.connect();

module.exports = conn;