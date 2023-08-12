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


const allowedOrigins = ['https://blog-backend-1m3w.onrender.com', 'http://localhost:5174'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
};

app.use(cors(corsOptions));



// app.use(helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false
// }))

app.get('/', (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true")
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
