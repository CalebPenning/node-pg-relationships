const express = require("express")
const app = express()
const ExpressError = require("./expressError")
const userRoutes = require("./routes/userRoutes")
const msgRoutes = require("./routes/msgRoutes")

app.use(express.json())
app.use("/users", userRoutes)
app.use("/messages", msgRoutes)

app.use((req, res, next) => {
    const err = new ExpressError("Not found", 404)
    return next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    return res.json({
        error: err,
        message: err.message
    })
})

module.exports = app