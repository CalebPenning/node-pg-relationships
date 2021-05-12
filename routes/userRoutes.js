/* Routes for users of pg-relationships */

const express = require("express")
const db = require("../db")
const router = new express.Router()

/* Get users: [user, user, user] */

router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(
            `SELECT id, name, type FROM users;`)
        return res.json(results.rows)
    }

    catch(e) {
        return next(e)
    }
})

module.exports = router