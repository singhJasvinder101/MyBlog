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
const session = require("express-session");

// middleware to recognize the body by express
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())


const allowedOrigins = [
    process.env.BACKEND_URL,
    process.env.CLIENT_URL,
    'http://192.168.99.198:5173',
    'https://deploy-preview-*.netlify.app'
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true);
        }

        const allowed = allowedOrigins.some(pattern => {
            const regex = new RegExp(`^${pattern.replace('*', '.*')}$`);
            return regex.test(origin);
        }); 

        if (allowed) {
            return callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

// app.use(cors(corsOptions));
// app.use((req, res, next) => {
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//         res.header('Access-Control-Allow-Origin', origin);
//     }
//     res.header('Access-Control-Allow-Credentials', 'true');
//     app.options('*', cors(corsOptions));
//     next();
// });

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));


app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}))

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
})


app.listen(port, () => {
    console.log(`started at http://localhost:${port}`)

})
