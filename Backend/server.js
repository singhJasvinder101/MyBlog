const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const apiRoutes = require("./routes/ApiRoutes")
require("dotenv").config()
var helmet = require('helmet')

// config
const mongoDB = require("./config/db")
mongoDB()
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const cors = require('cors');

// middleware to recognize the body by express
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
<<<<<<< HEAD

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
=======
// app.use(cors())
app.use(cors());
>>>>>>> e06b23a81adb5e9e11a848f58c01b6ad6ea1af13


app.use(helmet({
    contentSecurityPolicy: false, 
    crossOriginEmbedderPolicy: false
}))

app.get('/', (req, res) => {
<<<<<<< HEAD
    // res.setHeader("Access-Control-Allow-Credentials", "true")
=======
    res.setHeader("Access-Control-Allow-Credentials", "true")
>>>>>>> e06b23a81adb5e9e11a848f58c01b6ad6ea1af13
    res.send("Api running....")
})

app.use('/api', apiRoutes)

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(error)
    } else {
        next(error)
    }
})

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        res.status(500).json({
            message: error.message,
            stack: error.stack
        })
    } else {
        res.status(500).json({
            message: error.message
        })
    }
});

app.listen(port, () => {
    console.log(`started at http://localhost:${port}`)
})
