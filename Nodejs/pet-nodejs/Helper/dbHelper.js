const sql = require ("mysql");

const db = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "petshop"
})
db.connect();
module.exports = db;