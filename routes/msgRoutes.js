const db = require("../db")
const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const e = require("express")


router.get("/:id", async (req, res, next) => {
    try {
        const results = await db.query(
            `SELECT m.id, m.msg, t.tag
            FROM messages AS m
            LEFT JOIN messages_tags AS mt
            ON m.id = mt.message_id
            LEFT JOIN tags AS t
            ON mt.tag_code = t.code
            WHERE m.id = $1;`, [req.params.id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Message with id of ${req.params.id} not found.`, 404)
        }
        const { id, msg } = results.rows[0]
        const tags = results.rows.map(r => r.tag)
            return res.json({id, msg, tags})
    }
    
    catch(e) {
        return next(e)
    }
})

router.patch("/:id", async (req, res, next) => {
    try {
        const msg = await db.query(`SELECT id FROM messages WHERE id = $1`, [req.params.id])
        if (msg.rows.length === 0) throw new ExpressError(`Message with id of ${req.params.id} not found`, 404)
        const results = await db.query(
            `UPDATE messages SET msg = $1
            WHERE id = $2 
            RETURNING id, user_id, msg`, 
            [req.body.msg, req.params.id]
        )
        return res.json(results.rows[0])
    }

    catch(e) {
        return next(e)
    }
})

module.exports = router