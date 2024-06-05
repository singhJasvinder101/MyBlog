const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/userModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    },
});

const sendResetLink = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ errorMessage: 'No account with that email address exists.' });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    const resetURL = `http://${req.headers.host}/api/password/reset-password-form/${resetToken}`;

    const mailOptions = {
        to: user.email,
        from: process.env.MAIL,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetURL}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ errorMessage: 'Error sending the email. Please try again later.' });
        }
        res.status(200).json({ message: 'A reset link has been sent to your email.' });
    });
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ errorMessage: 'Invalid token or user does not exist.' });
        }

        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({ errorMessage: 'Password length should be between 8 and 20 characters.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ errorMessage: 'An error occurred while resetting the password.' });
    }
};

module.exports = { sendResetLink, resetPassword };
