const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_APSSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
});

db.connect();

module.exports = db;