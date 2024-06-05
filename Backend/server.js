const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const apiRoutes = require("./routes/ApiRoutes");
require("dotenv").config();
const helmet = require('helmet');
const mongoDB = require("./config/db");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require('cors');

// Initialize MongoDB connection
mongoDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// Allowed origins for CORS
const allowedOrigins = [
    process.env.BACKEND_URL,
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'https://deploy-preview-*.netlify.app'
];

// CORS options configuration
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

// Use CORS middleware
app.use(cors(corsOptions));

// Handle CORS preflight requests
app.options('*', cors(corsOptions));

// Apply security-related headers using Helmet
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Root route
app.get('/', (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.send("API running....");
});

// Use the API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(error);
    } else {
        next(error);
    }
});

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    } else {
        res.status(500).json({
            message: error.message
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

module.exports = app;
