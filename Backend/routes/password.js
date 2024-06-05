const express = require('express');
const { sendResetLink, resetPassword } = require('../controllers/password.js');

const router = express.Router();

// Handle form submission and send reset link
router.post('/forgot-password', sendResetLink);

// Handle the actual password reset
router.post('/reset-password/:token', resetPassword);

// Handle GET request to reset password page
router.get('/reset-password-form/:token', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reset Password</title>
        </head>
        <body>
            <h1>Reset Password</h1>
            <form action="/api/reset-password/${req.params.token}" method="POST">
                <input type="password" name="password" placeholder="Enter new password" required>
                <button type="submit">Reset Password</button>
            </form>
        </body>
        </html>
    `);
});

module.exports = router;
