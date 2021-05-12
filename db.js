const { Client } = require('pg')

let dbUri

if (process.env.NODE_ENV === "test") {
    dbUri = "postgresql:///socialtest_pg_db"
} else {
    dbUri = "postgresql:///social_pg_db"
}

let db = new Client({
    connectionString: dbUri
})

db.connect()

module.exports = db