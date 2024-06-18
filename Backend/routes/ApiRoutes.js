const express = require("express")
const app = express.Router()
const blogRoutes = require('./blogRoutes')
const userRoutes = require('./userRoutes')
const jwt = require('jsonwebtoken')
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send("this is api route")
})

app.get("/logout", (req, res) => {
    res.clearCookie("auth_token", {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: true
    }).send("access token cleared");
})

app.get("/get-token", (req, res) => {
    try {
        // console.log(req.cookies.auth_token)
        const accessToken = req.cookies.auth_token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        // console.log(process.env.JWT_SECRET_KEY)
        return res.json({ token: decoded.name, isAdmin: decoded.isAdmin });
    } catch (err) {
        return res.status(401).send(err);
    }
})

app.use('/blogs', blogRoutes)
app.use('/users', userRoutes)
// app.use('/categories', categoriesRoutes)

module.exports = app