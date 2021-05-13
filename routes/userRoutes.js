/* Routes for users of pg-relationships */

const express = require("express")
const db = require("../db")
const ExpressError = require("../expressError")
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

router.get("/:id", async (req, res, next) => {
    // Get a single user, then get all of that user's messages and respond with json.
    try {
        const { id } = req.params
        const userResults = await db.query(
            `SELECT id, name, type
            FROM users
            WHERE id = $1;`, [id])
        const msgResults = await db.query(
        `SELECT id, user_id, msg
        FROM messages
        WHERE user_id = $1;`, [id])
        if (userResults.rows.length === 0){
            const err = new ExpressError(`User with id of ${req.params.id} not found.`, 404)
            return next(err)
        }
        const user = userResults.rows[0]
        user.messages = msgResults.rows
        res.json(user)
    }

    catch(e) {
        return next(e)
    }
})

module.exports = router